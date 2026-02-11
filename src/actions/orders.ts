'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

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
}

// Create order
export async function createOrder(data: CreateOrderData) {
    try {
        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: data.userId || null,
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,
                deliveryAddress: data.deliveryAddress,
                deliveryLocation: data.deliveryLocation,
                deliveryFee: data.deliveryFee,
                subtotal: data.subtotal,
                total: data.total,
                paymentMethod: data.paymentMethod,
                notes: data.notes || null,
                status: 'PENDING',
                items: {
                    create: data.items.map(item => ({
                        variantId: item.variantId,
                        quantity: item.quantity,
                        price: item.price
                    }))
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

        revalidatePath('/account/orders')

        return { success: true, data: order }
    } catch (error) {
        console.error('Error creating order:', error)
        return { success: false, error: 'Failed to create order' }
    }
}

// Get orders (admin can see all, customers see their own)
export async function getAllOrders(email?: string) {
    try {
        const orders = await prisma.order.findMany({
            where: email ? { customerEmail: email } : {},
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

        return { success: true, data: order }
    } catch (error) {
        console.error('Error fetching order:', error)
        return { success: false, error: 'Failed to fetch order' }
    }
}

// Update order status
export async function updateOrderStatus(id: string, status: string) {
    try {
        const order = await prisma.order.update({
            where: { id },
            data: { status: status as any }
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
        const order = await prisma.order.update({
            where: { orderNumber },
            data: {
                paymentReference: reference,
                status: 'PAID'
            }
        })

        revalidatePath('/account/orders')

        return { success: true, data: order }
    } catch (error) {
        console.error('Error updating payment reference:', error)
        return { success: false, error: 'Failed to update payment reference' }
    }
}
