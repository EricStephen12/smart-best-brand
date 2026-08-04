import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { reduceInventory } from '@/actions/orders';
import { sendOrderNotification } from '@/lib/sms';
import { sendN8nEvent } from '@/lib/n8n';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || ''

function verifySignature(payload: string, signature: string | null) {
    if (!signature || !PAYSTACK_SECRET) return false
    const expected = crypto.createHmac('sha512', PAYSTACK_SECRET).update(payload).digest('hex')
    const expectedBuffer = Buffer.from(expected, 'utf8')
    const signatureBuffer = Buffer.from(signature, 'utf8')
    if (expectedBuffer.length !== signatureBuffer.length) return false
    return crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
}

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-paystack-signature')

        if (!verifySignature(rawBody, signature)) {
            return new NextResponse('Invalid signature', { status: 401 })
        }

        const body = JSON.parse(rawBody)
        const event = body.event
        const respData = body.data

        if (event === 'charge.success' && respData?.reference) {
            const orderNumber = respData.reference
            const updated = await prisma.order.updateMany({
                where: { orderNumber, status: 'PENDING' },
                data: {
                    status: 'PAID',
                    paymentReference: respData.id?.toString() || null
                }
            })

            if (updated.count > 0) {
                const order = await prisma.order.findUnique({ where: { orderNumber } })
                if (order) {
                    await reduceInventory(order.id)
                    await sendOrderNotification(order.customerEmail, order.orderNumber, order.total)
                    void sendN8nEvent('order.paid', {
                        orderId: order.id,
                        orderNumber: order.orderNumber,
                        customerName: order.customerName,
                        customerEmail: order.customerEmail,
                        total: order.total,
                        status: order.status
                    })
                }
                revalidatePath('/account/orders')
            }
        }

        return new NextResponse('OK', { status: 200 })
    } catch (error) {
        console.error('Paystack webhook error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
