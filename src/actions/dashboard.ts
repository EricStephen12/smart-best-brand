'use server'

import prisma from '@/lib/prisma';

export async function getDashboardStats() {
    try {
        const [
            totalProducts,
            totalOrders,
            totalBrands,
            totalValue
        ] = await Promise.all([
            prisma.product.count({ where: { isActive: true } }),
            prisma.order.count(),
            prisma.brand.count(),
            prisma.productVariant.aggregate({
                where: { isActive: true },
                _sum: {
                    price: true
                }
            })
        ]);

        return {
            success: true,
            data: {
                totalProducts,
                totalOrders,
                totalBrands,
                totalValue: totalValue._sum.price || 0,
                // Mock changes for UI aesthetics
                productChange: '+4 this week',
                orderChange: '+12% vs LY',
                brandChange: 'All Active',
                valueChange: '+15% MoM'
            }
        };
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        return { success: false, error: 'Failed to fetch dashboard stats' };
    }
}

export async function getRecentOrders(limit = 5, email?: string) {
    try {
        const orders = await prisma.order.findMany({
            where: email ? { customerEmail: email } : {},
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                orderNumber: true,
                customerName: true,
                total: true,
                status: true,
                createdAt: true
            }
        });
        return { success: true, data: orders };
    } catch (error) {
        console.error('Failed to fetch recent orders:', error);
        return { success: false, error: 'Failed to fetch recent orders' };
    }
}
