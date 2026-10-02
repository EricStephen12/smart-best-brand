'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/actions/auth'

export type AnalyticsPeriod = 'all' | 'year' | '30d' | '7d'

export interface AnalyticsSummary {
  period: AnalyticsPeriod
  totalRevenue: number
  pipelineValue: number
  totalOrders: number
  paidOrdersCount: number
  pendingOrdersCount: number
  processingOrdersCount: number
  shippedOrdersCount: number
  deliveredOrdersCount: number
  cancelledOrdersCount: number
  averageOrderValue: number
  totalUnitsSold: number
  fulfillmentRate: number
  activeProductsCount: number
  trends: Array<{
    label: string
    revenue: number
    orders: number
  }>
  statusDistribution: Array<{
    status: string
    label: string
    count: number
    percentage: number
    color: string
    bg: string
  }>
  topProducts: Array<{
    name: string
    brand: string
    unitsSold: number
    revenue: number
  }>
  brandPerformance: Array<{
    brand: string
    unitsSold: number
    revenue: number
    percentage: number
  }>
  regionalPerformance: Array<{
    location: string
    ordersCount: number
    revenue: number
    percentage: number
  }>
  paymentMethodPerformance: Array<{
    method: string
    ordersCount: number
    revenue: number
    percentage: number
  }>
}

export async function getStoreAnalytics(period: AnalyticsPeriod = 'all'): Promise<{
  success: boolean
  error?: string
  data?: AnalyticsSummary
}> {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    let dateFilter: { gte?: Date } | undefined = undefined
    const now = new Date()

    if (period === '7d') {
      dateFilter = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
    } else if (period === '30d') {
      dateFilter = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
    } else if (period === 'year') {
      dateFilter = { gte: new Date(now.getFullYear(), 0, 1) }
    }

    const whereClause = dateFilter ? { createdAt: dateFilter } : {}

    const [orders, activeProductsCount] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      brand: true,
                    },
                  },
                  size: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.product.count({ where: { isActive: true } }),
    ])

    const totalOrders = orders.length
    const paidOrders = orders.filter((o) =>
      ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status)
    )

    // Total fulfilled/paid revenue
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    // Pipeline value (all non-cancelled orders)
    const pipelineValue = orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + (o.total || 0), 0)

    const paidOrdersCount = orders.filter((o) => o.status === 'PAID').length
    const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length
    const processingOrdersCount = orders.filter((o) => o.status === 'PROCESSING').length
    const shippedOrdersCount = orders.filter((o) => o.status === 'SHIPPED').length
    const deliveredOrdersCount = orders.filter((o) => o.status === 'DELIVERED').length
    const cancelledOrdersCount = orders.filter((o) => o.status === 'CANCELLED').length

    const completedCount = paidOrders.length
    const averageOrderValue =
      completedCount > 0
        ? Math.round(totalRevenue / completedCount)
        : totalOrders > 0
        ? Math.round(pipelineValue / totalOrders)
        : 0

    const fulfillmentRate =
      totalOrders > 0
        ? Math.round((deliveredOrdersCount / totalOrders) * 100)
        : 0

    const totalUnitsSold = orders.reduce(
      (sum, o) =>
        sum +
        (o.items || []).reduce((iSum, i) => iSum + (i.quantity || 1), 0),
      0
    )

    // ─────────────────────────────────────────────────────────────
    // 1. Trends over time
    // ─────────────────────────────────────────────────────────────
    const trendMap = new Map<string, { revenue: number; orders: number }>()

    if (period === '7d' || period === '30d') {
      // Daily buckets
      orders.forEach((order) => {
        const d = new Date(order.createdAt)
        const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const current = trendMap.get(key) || { revenue: 0, orders: 0 }
        current.orders += 1
        if (['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status)) {
          current.revenue += order.total || 0
        }
        trendMap.set(key, current)
      })
    } else {
      // Monthly buckets
      orders.forEach((order) => {
        const d = new Date(order.createdAt)
        const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        const current = trendMap.get(key) || { revenue: 0, orders: 0 }
        current.orders += 1
        if (['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status)) {
          current.revenue += order.total || 0
        }
        trendMap.set(key, current)
      })
    }

    const trends = Array.from(trendMap.entries()).map(([label, val]) => ({
      label,
      revenue: Math.round(val.revenue),
      orders: val.orders,
    }))

    // ─────────────────────────────────────────────────────────────
    // 2. Status Distribution
    // ─────────────────────────────────────────────────────────────
    const rawStatuses = [
      { status: 'DELIVERED', label: 'Delivered', count: deliveredOrdersCount, color: 'text-emerald-700', bg: 'bg-emerald-500' },
      { status: 'PAID', label: 'Paid', count: paidOrdersCount, color: 'text-sky-700', bg: 'bg-sky-500' },
      { status: 'PROCESSING', label: 'Processing', count: processingOrdersCount, color: 'text-indigo-700', bg: 'bg-indigo-500' },
      { status: 'SHIPPED', label: 'In Transit', count: shippedOrdersCount, color: 'text-purple-700', bg: 'bg-purple-500' },
      { status: 'PENDING', label: 'Pending Payment', count: pendingOrdersCount, color: 'text-amber-700', bg: 'bg-amber-500' },
      { status: 'CANCELLED', label: 'Cancelled', count: cancelledOrdersCount, color: 'text-rose-700', bg: 'bg-rose-500' },
    ]

    const statusDistribution = rawStatuses.map((st) => ({
      ...st,
      percentage: totalOrders > 0 ? Math.round((st.count / totalOrders) * 100) : 0,
    }))

    // ─────────────────────────────────────────────────────────────
    // 3. Top Products
    // ─────────────────────────────────────────────────────────────
    const productMap = new Map<string, { name: string; brand: string; unitsSold: number; revenue: number }>()

    orders.forEach((order) => {
      ;(order.items || []).forEach((item) => {
        const prod = item.variant?.product
        const name = prod?.name || 'Mattress Item'
        const brand = prod?.brand?.name || 'Smart Best Brands'
        const existing = productMap.get(name) || { name, brand, unitsSold: 0, revenue: 0 }
        existing.unitsSold += item.quantity || 1
        existing.revenue += (item.price || 0) * (item.quantity || 1)
        productMap.set(name, existing)
      })
    })

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6)

    // ─────────────────────────────────────────────────────────────
    // 4. Brand Performance Breakdown
    // ─────────────────────────────────────────────────────────────
    const brandMap = new Map<string, { brand: string; unitsSold: number; revenue: number }>()

    orders.forEach((order) => {
      ;(order.items || []).forEach((item) => {
        const brandName = item.variant?.product?.brand?.name || 'Original Factory Brands'
        const existing = brandMap.get(brandName) || { brand: brandName, unitsSold: 0, revenue: 0 }
        existing.unitsSold += item.quantity || 1
        existing.revenue += (item.price || 0) * (item.quantity || 1)
        brandMap.set(brandName, existing)
      })
    })

    const totalProductRevenue = Array.from(brandMap.values()).reduce((sum, b) => sum + b.revenue, 0)
    const brandPerformance = Array.from(brandMap.values())
      .map((b) => ({
        ...b,
        percentage: totalProductRevenue > 0 ? Math.round((b.revenue / totalProductRevenue) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)

    // ─────────────────────────────────────────────────────────────
    // 5. Regional Delivery Insights
    // ─────────────────────────────────────────────────────────────
    const regionMap = new Map<string, { location: string; ordersCount: number; revenue: number }>()

    orders.forEach((order) => {
      const loc = order.deliveryLocation || 'Standard Regional'
      const existing = regionMap.get(loc) || { location: loc, ordersCount: 0, revenue: 0 }
      existing.ordersCount += 1
      existing.revenue += order.total || 0
      regionMap.set(loc, existing)
    })

    const regionalPerformance = Array.from(regionMap.values())
      .map((r) => ({
        ...r,
        percentage: pipelineValue > 0 ? Math.round((r.revenue / pipelineValue) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)

    // ─────────────────────────────────────────────────────────────
    // 6. Payment Method Breakdown
    // ─────────────────────────────────────────────────────────────
    const paymentMap = new Map<string, { method: string; ordersCount: number; revenue: number }>()

    orders.forEach((order) => {
      const rawMethod = (order.paymentMethod || 'PAYSTACK').toUpperCase()
      const methodLabel =
        rawMethod === 'PAYSTACK'
          ? 'Paystack (Card / Transfer)'
          : rawMethod === 'BANK_TRANSFER'
          ? 'Direct Bank Transfer'
          : rawMethod === 'COD' || rawMethod === 'CASH'
          ? 'Cash on Delivery'
          : rawMethod
      const existing = paymentMap.get(methodLabel) || { method: methodLabel, ordersCount: 0, revenue: 0 }
      existing.ordersCount += 1
      existing.revenue += order.total || 0
      paymentMap.set(methodLabel, existing)
    })

    const paymentMethodPerformance = Array.from(paymentMap.values())
      .map((p) => ({
        ...p,
        percentage: pipelineValue > 0 ? Math.round((p.revenue / pipelineValue) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)

    return {
      success: true,
      data: {
        period,
        totalRevenue,
        pipelineValue,
        totalOrders,
        paidOrdersCount,
        pendingOrdersCount,
        processingOrdersCount,
        shippedOrdersCount,
        deliveredOrdersCount,
        cancelledOrdersCount,
        averageOrderValue,
        totalUnitsSold,
        fulfillmentRate,
        activeProductsCount,
        trends,
        statusDistribution,
        topProducts,
        brandPerformance,
        regionalPerformance,
        paymentMethodPerformance,
      },
    }
  } catch (error) {
    console.error('Error in getStoreAnalytics:', error)
    return { success: false, error: 'Failed to compute store analytics' }
  }
}
