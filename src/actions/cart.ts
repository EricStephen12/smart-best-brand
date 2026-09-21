'use server'

import crypto from 'crypto'
import prisma from '@/lib/prisma'
import { getSession } from '@/actions/auth'

export interface SyncCartInput {
    items: {
        variantId: string
        quantity: number
    }[]
    email?: string | null
    phone?: string | null
    guestToken?: string | null
}

export async function syncCartToDb(input: SyncCartInput) {
    try {
        const session = await getSession()
        const userId = session?.id || null
        const email = (input.email || session?.email || '').trim().toLowerCase() || null
        const phone = input.phone?.trim() || session?.phone || null
        const guestToken = input.guestToken || null

        if (!userId && !guestToken) {
            return { success: false, error: 'No user or guest identification provided' }
        }

        // Find existing cart by userId or guestToken
        let cart = null
        if (userId) {
            cart = await prisma.cart.findFirst({
                where: { userId },
                orderBy: { updatedAt: 'desc' }
            })
        } else if (guestToken) {
            cart = await prisma.cart.findUnique({
                where: { guestToken }
            })
        }

        const recoveryToken = cart?.recoveryToken || crypto.randomUUID()

        if (cart) {
            cart = await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    userId: userId || cart.userId,
                    email: email || cart.email,
                    phone: phone || cart.phone,
                    updatedAt: new Date(),
                }
            })
        } else {
            cart = await prisma.cart.create({
                data: {
                    userId,
                    guestToken,
                    email,
                    phone,
                    recoveryToken,
                }
            })
        }

        // Synchronize cart items
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        })

        if (input.items.length > 0) {
            await prisma.cartItem.createMany({
                data: input.items.map(item => ({
                    cartId: cart.id,
                    variantId: item.variantId,
                    quantity: item.quantity,
                }))
            })
        }

        return {
            success: true,
            data: {
                cartId: cart.id,
                recoveryToken: cart.recoveryToken
            }
        }
    } catch (error) {
        console.error('Error syncing cart to DB:', error)
        return { success: false, error: 'Failed to sync cart' }
    }
}

export async function recoverCartByToken(recoveryToken: string) {
    try {
        if (!recoveryToken?.trim()) {
            return { success: false, error: 'Invalid recovery token' }
        }

        const cart = await prisma.cart.findUnique({
            where: { recoveryToken: recoveryToken.trim() },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        categories: true,
                                        brand: true,
                                    }
                                },
                                size: true,
                            }
                        }
                    }
                }
            }
        })

        if (!cart) {
            return { success: false, error: 'Cart not found or already recovered' }
        }

        // Mark recovered
        await prisma.cart.update({
            where: { id: cart.id },
            data: { isRecovered: true }
        })

        const formattedItems = cart.items.map(item => ({
            id: `${Date.now()}-${item.variantId}`,
            product_variant_id: item.variantId,
            variant: item.variant,
            product: item.variant.product,
            quantity: item.quantity,
        }))

        return {
            success: true,
            data: {
                items: formattedItems,
                email: cart.email,
                phone: cart.phone,
            }
        }
    } catch (error) {
        console.error('Error recovering cart:', error)
        return { success: false, error: 'Failed to recover cart' }
    }
}
