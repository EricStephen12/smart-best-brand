'use server'

import crypto from 'crypto'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getSession } from '@/actions/auth'
import { sendN8nEvent } from '@/lib/n8n'

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

// Create order
export async function createOrder(data: CreateOrderData) {
    try {
        const session = await getSession()

        const variantIds = data.items.map(item => item.variantId)
        const variants = await prisma.productVariant.findMany({
            where: { id: { in: variantIds } }
        })

        if (variants.length !== data.items.length) {
            return { success: false, error: 'Invalid order items' }
        }

        let computedSubtotal = 0
        const sanitizedItems = data.items.map(item => {
            const variant = variants.find((variant) => variant.id === item.variantId)
            if (!variant) {
                throw new Error('Invalid variant')
            }

            const expectedPrice = variant.promoPrice ?? variant.price
            if (item.price !== expectedPrice) {
                throw new Error('Order item prices do not match server pricing')
            }

            computedSubtotal += expectedPrice * item.quantity
            return {
                variantId: item.variantId,
                quantity: item.quantity,
                price: expectedPrice
            }
        })

        if (data.discount && (data.discount < 0 || data.discount > computedSubtotal)) {
            return { success: false, error: 'Invalid discount amount' }
        }

        const expectedTotal = computedSubtotal + data.deliveryFee - (data.discount || 0)
        if (Math.abs(expectedTotal - data.total) > 0.01) {
            return { success: false, error: 'Order total does not match calculated total' }
        }

        const orderNumber = `ORD-${crypto.randomUUID()}`

        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: session?.id || null,
                customerName: data.customerName,
                customerEmail: data.customerEmail.toLowerCase(),
                customerPhone: data.customerPhone,
                deliveryAddress: data.deliveryAddress,
                deliveryLocation: data.deliveryLocation,
                deliveryFee: data.deliveryFee,
                subtotal: computedSubtotal,
                total: expectedTotal,
                discount: data.discount || 0,
                promoCode: data.promoCode || null,
                paymentMethod: data.paymentMethod.toUpperCase(),
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
        return { success: false, error: 'Failed to create order' }
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

// Update payment reference (for Paystack)
export async function updatePaymentReference(orderNumber: string, reference: string) {
    try {
        const updated = await prisma.order.updateMany({
            where: { orderNumber, status: 'PENDING' },
            data: {
                paymentReference: reference,
                status: 'PAID'
            }
        })

        if (updated.count === 0) {
            return { success: false, error: 'Order not found or already processed' }
        }

        const order = await prisma.order.findUnique({ where: { orderNumber } })
        if (!order) {
            return { success: false, error: 'Order not found after update' }
        }

        await reduceInventory(order.id)
        void sendN8nEvent('order.paid', {
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
        console.error('Error updating payment reference:', error)
        return { success: false, error: 'Failed to update payment reference' }
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
