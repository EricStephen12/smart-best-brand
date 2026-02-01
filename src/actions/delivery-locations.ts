'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

// Get all delivery locations
export async function getAllDeliveryLocations() {
    try {
        const locations = await prisma.deliveryLocation.findMany({
            orderBy: { name: 'asc' }
        })
        return { success: true, data: locations }
    } catch (error) {
        console.error('Error fetching delivery locations:', error)
        return { success: false, error: 'Failed to fetch delivery locations' }
    }
}

// Get active delivery locations
export async function getActiveDeliveryLocations() {
    try {
        const locations = await prisma.deliveryLocation.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        })
        return { success: true, data: locations }
    } catch (error) {
        console.error('Error fetching active delivery locations:', error)
        return { success: false, error: 'Failed to fetch delivery locations' }
    }
}

// Create delivery location
export async function createDeliveryLocation(formData: FormData) {
    try {
        const name = formData.get('name') as string
        const basePrice = parseFloat(formData.get('basePrice') as string)

        const location = await prisma.deliveryLocation.create({
            data: {
                name,
                basePrice,
                isActive: true
            }
        })

        revalidatePath('/account/delivery-locations')
        revalidatePath('/checkout')

        return { success: true, data: location }
    } catch (error) {
        console.error('Error creating delivery location:', error)
        return { success: false, error: 'Failed to create delivery location' }
    }
}

// Update delivery location
export async function updateDeliveryLocation(id: string, formData: FormData) {
    try {
        const name = formData.get('name') as string
        const basePrice = parseFloat(formData.get('basePrice') as string)
        const isActive = formData.get('isActive') === 'true'

        const location = await prisma.deliveryLocation.update({
            where: { id },
            data: {
                name,
                basePrice,
                isActive
            }
        })

        revalidatePath('/account/delivery-locations')
        revalidatePath('/checkout')

        return { success: true, data: location }
    } catch (error) {
        console.error('Error updating delivery location:', error)
        return { success: false, error: 'Failed to update delivery location' }
    }
}

// Delete delivery location
export async function deleteDeliveryLocation(id: string) {
    try {
        await prisma.deliveryLocation.delete({
            where: { id }
        })

        revalidatePath('/account/delivery-locations')
        revalidatePath('/checkout')

        return { success: true }
    } catch (error) {
        console.error('Error deleting delivery location:', error)
        return { success: false, error: 'Failed to delete delivery location' }
    }
}
