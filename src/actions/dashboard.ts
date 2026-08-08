'use server'

import prisma from '@/lib/prisma'

export async function getDashboardStats() {
    try {
        const [totalProducts, totalOrders, totalBrands, paidOrders] = await Promise.all([
            prisma.product.count({ where: { isActive: true } }),
            prisma.order.count(),
            prisma.brand.count({ where: { isActive: true } }),
            prisma.order.aggregate({
                where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
                _sum: { total: true },
                _count: true,
            }),
        ])

        return {
            success: true,
            data: {
                totalProducts,
                totalOrders,
                totalBrands,
                paidOrderCount: paidOrders._count,
                revenue: paidOrders._sum.total || 0,
            },
        }
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
        return { success: false, error: 'Failed to fetch dashboard stats' }
    }
}

export async function getRecentOrders(limit = 5, email?: string) {
    try {
        const orders = await prisma.order.findMany({
            where: email ? { customerEmail: email.toLowerCase() } : {},
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                orderNumber: true,
                customerName: true,
                total: true,
                status: true,
                createdAt: true,
            },
        })
        return { success: true, data: orders }
    } catch (error) {
        console.error('Failed to fetch recent orders:', error)
        return { success: false, error: 'Failed to fetch recent orders' }
    }
}
