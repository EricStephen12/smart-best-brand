import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { reduceInventory } from '@/actions/orders'
import { sendCustomerPaymentSuccessEmail, sendAdminPaymentAlert } from '@/lib/sms'
import { getPaystackSecretKey, nairaToKobo } from '@/lib/paystack'

function verifySignature(payload: string, signature: string | null) {
    const secret = getPaystackSecretKey()
    if (!signature || !secret) return false

    const expected = crypto.createHmac('sha512', secret).update(payload).digest('hex')
    const expectedBuffer = Buffer.from(expected, 'utf8')
    const signatureBuffer = Buffer.from(signature, 'utf8')
    if (expectedBuffer.length !== signatureBuffer.length) return false
    return crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
}

async function markOrderPaid(orderNumber: string, paymentReference: string) {
    const updated = await prisma.order.updateMany({
        where: { orderNumber, status: 'PENDING' },
        data: {
            status: 'PAID',
            paymentReference,
        },
    })

    if (updated.count === 0) {
        return null
    }

    const order = await prisma.order.findUnique({ where: { orderNumber } })
    if (!order) return null

    await reduceInventory(order.id)
    void sendCustomerPaymentSuccessEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        deliveryAddress: order.deliveryAddress,
        deliveryLocation: order.deliveryLocation,
        total: order.total,
        paymentMethod: order.paymentMethod,
        status: order.status,
        items: []
    })
    void sendAdminPaymentAlert({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        total: order.total,
        paymentMethod: order.paymentMethod
    })
    revalidatePath('/account/orders')
    return order
}

export async function POST(req: Request) {
    try {
        const rawBody = await req.text()
        const signature = req.headers.get('x-paystack-signature')

        if (!verifySignature(rawBody, signature)) {
            return new NextResponse('Invalid signature', { status: 401 })
        }

        const body = JSON.parse(rawBody) as {
            event?: string
            data?: {
                id?: number
                reference?: string
                amount?: number
                currency?: string
                status?: string
            }
        }

        const event = body.event
        const respData = body.data

        if (event === 'charge.success' && respData?.reference) {
            const orderNumber = respData.reference
            const order = await prisma.order.findUnique({ where: { orderNumber } })

            if (!order) {
                console.warn('Paystack webhook: order not found for reference', orderNumber)
                return new NextResponse('OK', { status: 200 })
            }

            if (order.status === 'PAID') {
                return new NextResponse('OK', { status: 200 })
            }

            const expectedKobo = nairaToKobo(order.total)
            const currency = (respData.currency || '').toUpperCase()
            const amountMatches = respData.amount === expectedKobo
            const currencyMatches = currency === 'NGN'
            const statusOk = respData.status === 'success'

            if (!amountMatches || !currencyMatches || !statusOk) {
                console.error('Paystack webhook amount/currency mismatch', {
                    orderNumber,
                    expectedKobo,
                    receivedAmount: respData.amount,
                    currency,
                    status: respData.status,
                })
                return new NextResponse('Payment amount mismatch', { status: 400 })
            }

            await markOrderPaid(orderNumber, respData.id?.toString() || orderNumber)
        }

        return new NextResponse('OK', { status: 200 })
    } catch (error) {
        console.error('Paystack webhook error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
