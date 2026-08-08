'use server'

import crypto from 'crypto'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getSession } from '@/actions/auth'
import { sendN8nEvent } from '@/lib/n8n'
import { validatePromotionCode } from '@/actions/promotions'
import {
    isSuccessfulPaystackCharge,
    nairaToKobo,
    verifyPaystackTransaction,
} from '@/lib/paystack'
import { sendOrderNotification } from '@/lib/sms'

interface CreateOrderData {
    customerName: string
    customerEmail: string
    customerPhone: string
    deliveryAddress: string
    deliveryLocation: string
    deliveryFee: number
    subtotal: number
    total: number
    paymentMethod: string
    items: {
        variantId: string
        quantity: number
        price: number
    }[]
    userId?: string
    notes?: string
    discount?: number
    promoCode?: string
}

const CUSTOM_DELIVERY_LOCATION = 'Other Locations'

// Create order
export async function createOrder(data: CreateOrderData) {
    try {
        const session = await getSession()

        if (!data.items?.length) {
            return { success: false, error: 'Cart is empty' }
        }

        if (!data.customerName?.trim() || !data.customerPhone?.trim() || !data.deliveryAddress?.trim()) {
            return { success: false, error: 'Please fill in your delivery details' }
        }

        if (!data.customerEmail?.trim()) {
            return { success: false, error: 'Email is required' }
        }

        const paymentMethod = data.paymentMethod.toUpperCase()
        if (paymentMethod !== 'PAYSTACK' && paymentMethod !== 'WHATSAPP') {
            return { success: false, error: 'Invalid payment method' }
        }

        const variantIds = data.items.map(item => item.variantId)
        const variants = await prisma.productVariant.findMany({
            where: { id: { in: variantIds } },
            include: {
                product: {
                    include: {
                        categories: true,
                    },
                },
            },
        })

        if (variants.length !== data.items.length) {
            return { success: false, error: 'Invalid order items' }
        }

        let computedSubtotal = 0
        const sanitizedItems: { variantId: string; quantity: number; price: number }[] = []

        for (const item of data.items) {
            const variant = variants.find((v) => v.id === item.variantId)
            if (!variant) {
                return { success: false, error: 'Invalid order items' }
            }

            if (variant.stock < item.quantity) {
                return {
                    success: false,
                    error: `Not enough stock for ${variant.product.name}`,
                }
            }

            const expectedPrice = variant.promoPrice ?? variant.price
            if (Math.abs(item.price - expectedPrice) > 0.01) {
                return {
                    success: false,
                    error: 'Cart prices are out of date. Refresh the page and try again.',
                }
            }

            computedSubtotal += expectedPrice * item.quantity
            sanitizedItems.push({
                variantId: item.variantId,
                quantity: item.quantity,
                price: expectedPrice,
            })
        }

        // Recompute delivery fee from DB (never trust client amount for known zones)
        let deliveryFee = 0
        let deliveryLocation = data.deliveryLocation.trim()
        const isCustomDelivery =
            deliveryLocation.toLowerCase() === CUSTOM_DELIVERY_LOCATION.toLowerCase()

        if (isCustomDelivery) {
            deliveryFee = 0
            deliveryLocation = CUSTOM_DELIVERY_LOCATION
        } else {
            const zone = await prisma.deliveryLocation.findFirst({
                where: { name: deliveryLocation, isActive: true },
            })
            if (!zone) {
                return { success: false, error: 'Invalid delivery location' }
            }
            deliveryFee = zone.basePrice
            deliveryLocation = zone.name
        }

        // Recompute discount from promo code on the server
        let discount = 0
        let promoCode: string | null = null

        if (data.promoCode) {
            const cartItems = variants.map((variant) => ({
                productId: variant.productId,
                categoryIds: variant.product.categories.map((c) => c.categoryId),
            }))
            const promoResult = await validatePromotionCode(
                data.promoCode,
                computedSubtotal,
                cartItems
            )
            if (!promoResult.success || !promoResult.data) {
                return { success: false, error: promoResult.error || 'Invalid promotion code' }
            }
            discount = promoResult.data.discount
            promoCode = promoResult.data.promotion.code || data.promoCode.toUpperCase()
        }

        const expectedTotal = computedSubtotal + deliveryFee - discount
        if (expectedTotal < 0) {
            return { success: false, error: 'Invalid order total' }
        }

        // Reject client totals that don't match server-computed values
        if (
            Math.abs(expectedTotal - data.total) > 0.01 ||
            Math.abs(deliveryFee - data.deliveryFee) > 0.01 ||
            Math.abs(discount - (data.discount || 0)) > 0.01
        ) {
            return { success: false, error: 'Order total does not match calculated total' }
        }

        const orderNumber = `ORD-${crypto.randomUUID()}`

        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: session?.id || null,
                customerName: data.customerName,
                customerEmail: (data.customerEmail || '').trim().toLowerCase(),
                customerPhone: data.customerPhone,
                deliveryAddress: data.deliveryAddress,
                deliveryLocation,
                deliveryFee,
                subtotal: computedSubtotal,
                total: expectedTotal,
                discount,
                promoCode,
                paymentMethod,
                notes: data.notes || null,
                status: 'PENDING',
                items: {
                    create: sanitizedItems
                }
            },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                                size: true
                            }
                        }
                    }
                }
            }
        })

        void sendN8nEvent('order.created', {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            deliveryLocation: order.deliveryLocation,
            total: order.total,
            status: order.status,
            items: order.items.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.price
            }))
        })

        revalidatePath('/account/orders')

        return { success: true, data: order }
    } catch (error) {
        console.error('Error creating order:', error)
        const message =
            error instanceof Error && error.message
                ? error.message
                : 'Failed to create order'
        return { success: false, error: message }
    }
}

// Get orders (admin can see all, customers see their own)
export async function getAllOrders() {
    try {
        const session = await getSession()
        if (!session) {
            return { success: false, error: 'Not authenticated' }
        }

        const filter = session.role === 'ADMIN' ? {} : { customerEmail: session.email.toLowerCase() }
        const orders = await prisma.order.findMany({
            where: filter,
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                                size: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return { success: true, data: orders }
    } catch (error) {
        console.error('Error fetching orders:', error)
        return { success: false, error: 'Failed to fetch orders' }
    }
}

// Get order by number
export async function getOrderByNumber(orderNumber: string) {
    try {
        const session = await getSession()
        if (!session) {
            return { success: false, error: 'Not authenticated' }
        }

        const order = await prisma.order.findUnique({
            where: { orderNumber },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                                size: true
                            }
                        }
                    }
                }
            }
        })

        if (!order) {
            return { success: false, error: 'Order not found' }
        }

        if (session.role !== 'ADMIN' && order.customerEmail.toLowerCase() !== session.email.toLowerCase()) {
            return { success: false, error: 'Unauthorized' }
        }

        return { success: true, data: order }
    } catch (error) {
        console.error('Error fetching order:', error)
        return { success: false, error: 'Failed to fetch order' }
    }
}

// Get order by ID
export async function getOrderById(id: string) {
    try {
        const session = await getSession()
        if (!session) {
            return { success: false, error: 'Not authenticated' }
        }

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                                size: true
                            }
                        }
                    }
                }
            }
        })

        if (!order) {
            return { success: false, error: 'Order not found' }
        }

        if (session.role !== 'ADMIN' && order.customerEmail.toLowerCase() !== session.email.toLowerCase()) {
            return { success: false, error: 'Unauthorized' }
        }

        return { success: true, data: order }
    } catch (error) {
        console.error('Error fetching order by ID:', error)
        return { success: false, error: 'Failed to fetch order' }
    }
}

// Update order status
export async function updateOrderStatus(id: string, status: string) {
    try {
        const session = await getSession()
        if (!session) {
            return { success: false, error: 'Not authenticated' }
        }

        if (session.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized' }
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status: status as any }
        })

        void sendN8nEvent('order.status', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            total: order.total,
            status: order.status
        })

        revalidatePath('/account/orders')

        return { success: true, data: order }
    } catch (error) {
        console.error('Error updating order status:', error)
        return { success: false, error: 'Failed to update order status' }
    }
}

/**
 * Confirm a Paystack payment by verifying the transaction with Paystack.
 * Marks the order PAID only after amount/currency/status checks pass.
 * Safe to call from the client after Pop callback; webhook remains the backup path.
 */
export async function confirmPaystackPayment(reference: string) {
    try {
        if (!reference || typeof reference !== 'string') {
            return { success: false, error: 'Invalid payment reference' }
        }

        const order = await prisma.order.findUnique({ where: { orderNumber: reference } })
        if (!order) {
            return { success: false, error: 'Order not found' }
        }

        if (order.paymentMethod !== 'PAYSTACK') {
            return { success: false, error: 'Order is not a Paystack payment' }
        }

        if (order.status === 'PAID') {
            return { success: true, data: order, alreadyPaid: true }
        }

        if (order.status !== 'PENDING') {
            return { success: false, error: 'Order cannot be paid in its current status' }
        }

        const verified = await verifyPaystackTransaction(reference)
        if (!verified.success) {
            return { success: false, error: verified.error }
        }

        const expectedKobo = nairaToKobo(order.total)
        if (!isSuccessfulPaystackCharge(verified.data, expectedKobo, 'NGN')) {
            console.error('Paystack confirm mismatch', {
                reference,
                expectedKobo,
                amount: verified.data.amount,
                currency: verified.data.currency,
                status: verified.data.status,
            })
            return { success: false, error: 'Payment verification failed' }
        }

        const updated = await prisma.order.updateMany({
            where: { orderNumber: reference, status: 'PENDING' },
            data: {
                paymentReference: verified.data.id.toString(),
                status: 'PAID',
            },
        })

        if (updated.count === 0) {
            const current = await prisma.order.findUnique({ where: { orderNumber: reference } })
            if (current?.status === 'PAID') {
                return { success: true, data: current, alreadyPaid: true }
            }
            return { success: false, error: 'Order not found or already processed' }
        }

        const paidOrder = await prisma.order.findUnique({ where: { orderNumber: reference } })
        if (!paidOrder) {
            return { success: false, error: 'Order not found after update' }
        }

        await reduceInventory(paidOrder.id)
        await sendOrderNotification(paidOrder.customerEmail, paidOrder.orderNumber, paidOrder.total)
        void sendN8nEvent('order.paid', {
            orderId: paidOrder.id,
            orderNumber: paidOrder.orderNumber,
            customerName: paidOrder.customerName,
            customerEmail: paidOrder.customerEmail,
            total: paidOrder.total,
            status: paidOrder.status,
        })
        revalidatePath('/account/orders')

        return { success: true, data: paidOrder }
    } catch (error) {
        console.error('Error confirming Paystack payment:', error)
        return { success: false, error: 'Failed to confirm payment' }
    }
}

// Reduce inventory when order is paid
export async function reduceInventory(orderId: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        })

        if (!order) return { success: false, error: 'Order not found' }

        const variantIds = order.items.map(item => item.variantId)
        const variants = await prisma.productVariant.findMany({
            where: { id: { in: variantIds } }
        })

        for (const item of order.items) {
            const variant = variants.find((variant) => variant.id === item.variantId)
            if (!variant) {
                return { success: false, error: 'Product variant not found' }
            }
            if (variant.stock < item.quantity) {
                return { success: false, error: 'Insufficient stock for one or more items' }
            }
        }

        const updates = order.items.map(item =>
            prisma.productVariant.update({
                where: { id: item.variantId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            })
        )

        await Promise.all(updates)
        return { success: true }
    } catch (error) {
        console.error('Inventory reduction error:', error)
        return { success: false, error }
    }
}
