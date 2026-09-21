'use server'

import crypto from 'crypto'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getSession } from '@/actions/auth'
import { validatePromotionCode } from '@/actions/promotions'
import {
    isSuccessfulPaystackCharge,
    nairaToKobo,
    verifyPaystackTransaction,
} from '@/lib/paystack'
import {
    sendCustomerOrderReceipt,
    sendCustomerPaymentSuccessEmail,
    sendOrderStatusUpdateEmail,
    sendAdminOrderAlert,
    sendAdminPaymentAlert,
} from '@/lib/sms'

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
    idempotencyKey?: string
}

function generateOrderNumber(): string {
    const now = new Date()
    const yy = String(now.getFullYear()).slice(-2)
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const rand = crypto.randomBytes(3).toString('hex').toUpperCase()
    return `SBB-${yy}${mm}${dd}-${rand}`
}

const CUSTOM_DELIVERY_LOCATION = 'Other Locations'

// Create order
export async function createOrder(data: CreateOrderData) {
    try {
        const session = await getSession()

        // Idempotency check: if order was already submitted with this key, return it
        if (data.idempotencyKey) {
            const existing = await prisma.order.findUnique({
                where: { idempotencyKey: data.idempotencyKey },
                include: {
                    items: {
                        include: {
                            variant: {
                                include: {
                                    product: true,
                                    size: true,
                                }
                            }
                        }
                    }
                }
            })
            if (existing) {
                return { success: true, data: existing, alreadyCreated: true }
            }
        }

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
        if (paymentMethod !== 'PAYSTACK' && paymentMethod !== 'WHATSAPP' && paymentMethod !== 'BANK_TRANSFER') {
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

        const totalQuantity = data.items.reduce((acc, item) => acc + item.quantity, 0)

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
            const bulkyHandlingFee = Math.max(0, totalQuantity - 1) * 2500
            deliveryFee = zone.basePrice + bulkyHandlingFee
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
                cartItems,
                data.customerEmail
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

        const orderNumber = generateOrderNumber()

        const order = await prisma.order.create({
            data: {
                orderNumber,
                idempotencyKey: data.idempotencyKey || null,
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

        // Auto-save delivery details to user profile if authenticated
        if (session?.id) {
            try {
                await prisma.user.update({
                    where: { id: session.id },
                    data: {
                        phone: data.customerPhone.trim(),
                        deliveryAddress: data.deliveryAddress.trim(),
                        deliveryLocation,
                    }
                })
            } catch (profileErr) {
                console.warn('Could not auto-save delivery details to user profile:', profileErr)
            }
        }

        // Send direct admin alert for every new order
        void sendAdminOrderAlert({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            customerEmail: order.customerEmail,
            deliveryAddress: order.deliveryAddress,
            deliveryLocation: order.deliveryLocation,
            paymentMethod: order.paymentMethod,
            total: order.total,
            status: order.status,
            items: order.items.map(item => ({
                name: item.variant.product.name,
                size: item.variant.size?.label,
                quantity: item.quantity,
                price: item.price
            }))
        })

        // Dispatch branded Resend order receipt to customer for Bank Transfer and WhatsApp
        // (For Paystack, receipt is dispatched only after card payment is confirmed)
        if (paymentMethod !== 'PAYSTACK') {
            void sendCustomerOrderReceipt({
                orderNumber: order.orderNumber,
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                customerPhone: order.customerPhone,
                deliveryAddress: order.deliveryAddress,
                deliveryLocation: order.deliveryLocation,
                deliveryFee: order.deliveryFee,
                subtotal: order.subtotal,
                discount: order.discount,
                total: order.total,
                paymentMethod: order.paymentMethod,
                status: order.status,
                items: order.items.map(item => ({
                    name: item.variant.product.name,
                    size: item.variant.size?.label,
                    quantity: item.quantity,
                    price: item.price
                }))
            })
        }

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
export async function updateOrderStatus(id: string, status: string, trackingNote?: string) {
    try {
        const session = await getSession()
        if (!session) {
            return { success: false, error: 'Not authenticated' }
        }

        if (session.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized' }
        }

        const existingOrder = await prisma.order.findUnique({
            where: { id },
            include: { items: true }
        })

        if (!existingOrder) {
            return { success: false, error: 'Order not found' }
        }

        // Restock inventory if an order whose inventory was deducted is cancelled
        if (status === 'CANCELLED' && existingOrder.inventoryDeductedAt) {
            await prisma.$transaction(async (tx) => {
                for (const item of existingOrder.items) {
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: {
                            stock: { increment: item.quantity }
                        }
                    })
                }
                await tx.order.update({
                    where: { id },
                    data: {
                        status: 'CANCELLED',
                        inventoryDeductedAt: null
                    }
                })
            })
        } else {
            await prisma.order.update({
                where: { id },
                data: { status: status as any }
            })

            // If manually marked PAID by admin, ensure inventory deduction & promo redemption count increment
            if (status === 'PAID' && existingOrder.status !== 'PAID') {
                if (!existingOrder.inventoryDeductedAt) {
                    await reduceInventory(id)
                }
                if (existingOrder.promoCode) {
                    await prisma.promotion.updateMany({
                        where: { code: existingOrder.promoCode.toUpperCase() },
                        data: { usedCount: { increment: 1 } }
                    })
                }
            }
        }

        const order = await prisma.order.findUnique({ where: { id } })
        if (!order) return { success: false, error: 'Order not found' }

        // Resend automation: dispatch customer status update email automatically
        void sendOrderStatusUpdateEmail({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            status: order.status,
            deliveryAddress: order.deliveryAddress,
            deliveryLocation: order.deliveryLocation,
            total: order.total,
            trackingNote: trackingNote?.trim() || undefined
        })

        revalidatePath('/account/orders')
        revalidatePath(`/account/orders/${id}`)

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

        const paidOrder = await prisma.order.findUnique({
            where: { orderNumber: reference },
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
        if (!paidOrder) {
            return { success: false, error: 'Order not found after update' }
        }

        if (!paidOrder.inventoryDeductedAt) {
            await reduceInventory(paidOrder.id)
        }
        if (paidOrder.promoCode) {
            await prisma.promotion.updateMany({
                where: { code: paidOrder.promoCode.toUpperCase() },
                data: { usedCount: { increment: 1 } }
            })
        }
        void sendCustomerPaymentSuccessEmail({
            orderNumber: paidOrder.orderNumber,
            customerName: paidOrder.customerName,
            customerEmail: paidOrder.customerEmail,
            customerPhone: paidOrder.customerPhone,
            deliveryAddress: paidOrder.deliveryAddress,
            deliveryLocation: paidOrder.deliveryLocation,
            total: paidOrder.total,
            paymentMethod: paidOrder.paymentMethod,
            status: paidOrder.status,
            items: paidOrder.items.map(item => ({
                name: item.variant.product.name,
                size: item.variant.size?.label,
                quantity: item.quantity,
                price: item.price
            }))
        })
        void sendAdminPaymentAlert({
            orderNumber: paidOrder.orderNumber,
            customerName: paidOrder.customerName,
            total: paidOrder.total,
            paymentMethod: paidOrder.paymentMethod
        })
        revalidatePath('/account/orders')

        return { success: true, data: paidOrder }
    } catch (error) {
        console.error('Error confirming Paystack payment:', error)
        return { success: false, error: 'Failed to confirm payment' }
    }
}

// Reduce inventory when order is paid (idempotent + transactional)
export async function reduceInventory(orderId: string) {
    try {
        return await prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: { items: true }
            })

            if (!order) return { success: false, error: 'Order not found' }

            // Idempotency: do not deduct multiple times
            if (order.inventoryDeductedAt) {
                return { success: true, alreadyDeducted: true }
            }

            const variantIds = order.items.map(item => item.variantId)
            const variants = await tx.productVariant.findMany({
                where: { id: { in: variantIds } },
                include: { product: true }
            })

            for (const item of order.items) {
                const variant = variants.find((v) => v.id === item.variantId)
                if (!variant) {
                    return { success: false, error: 'Product variant not found' }
                }
                if (variant.stock < item.quantity) {
                    console.error(
                        `[Oversell Warning] Order ${order.orderNumber}: Product "${variant.product?.name}" variant ${variant.id} has stock ${variant.stock}, needed ${item.quantity}`
                    )
                }
            }

            for (const item of order.items) {
                const variant = variants.find((v) => v.id === item.variantId)
                const currentStock = variant ? variant.stock : 0
                const nextStock = Math.max(0, currentStock - item.quantity)
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: {
                        stock: nextStock
                    }
                })
            }

            await tx.order.update({
                where: { id: orderId },
                data: {
                    inventoryDeductedAt: new Date()
                }
            })

            return { success: true }
        })
    } catch (error) {
        console.error('Inventory reduction error:', error)
        return { success: false, error }
    }
}
