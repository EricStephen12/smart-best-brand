import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendCartRecoveryEmail } from '@/lib/sms'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://smartbestbrands.com'
const CRON_SECRET = process.env.CRON_SECRET || process.env.AUTH_SECRET || 'sbb-cron-secret-key'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const secretParam = searchParams.get('secret')
        const authHeader = req.headers.get('authorization')
        const providedSecret = authHeader?.replace('Bearer ', '') || secretParam

        // Optional protection: if CRON_SECRET is set, require match
        if (CRON_SECRET && providedSecret !== CRON_SECRET) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const now = new Date()
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
        const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)

        // 1. Find abandoned carts that haven't received a recovery email
        const abandonedCarts = await prisma.cart.findMany({
            where: {
                email: { not: null },
                isRecovered: false,
                lastAbandonedEmailSentAt: null,
                updatedAt: {
                    lte: oneHourAgo,
                    gte: fortyEightHoursAgo,
                },
                items: {
                    some: {},
                },
            },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                                size: true,
                            },
                        },
                    },
                },
            },
            take: 20,
        })

        let emailsSent = 0

        for (const cart of abandonedCarts) {
            if (!cart.email || !cart.recoveryToken || cart.items.length === 0) continue

            const items = cart.items.map((item) => ({
                name: item.variant.product.name,
                size: item.variant.size?.label,
                quantity: item.quantity,
                price: item.variant.promoPrice || item.variant.price,
            }))

            const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
            const recoveryUrl = `${APP_URL}/checkout?recover=${encodeURIComponent(cart.recoveryToken)}`

            const res = await sendCartRecoveryEmail({
                customerEmail: cart.email,
                items,
                total,
                recoveryUrl,
            })

            if (res.success) {
                emailsSent++
                await prisma.cart.update({
                    where: { id: cart.id },
                    data: { lastAbandonedEmailSentAt: new Date() },
                })
            }
        }

        return NextResponse.json({
            success: true,
            foundCarts: abandonedCarts.length,
            recoveryEmailsSent: emailsSent,
        })
    } catch (error) {
        console.error('Error running abandoned cart cron:', error)
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
