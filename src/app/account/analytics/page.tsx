'use client'

import React, { useEffect, useState } from 'react'
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  BarChart3,
  MapPin,
  CreditCard,
  Layers,
  ArrowUpRight,
  Filter,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  getStoreAnalytics,
  type AnalyticsSummary,
  type AnalyticsPeriod,
} from '@/actions/analytics'
import { toast } from 'react-hot-toast'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('all')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsSummary | null>(null)

  const loadAnalytics = async (selectedPeriod: AnalyticsPeriod) => {
    setLoading(true)
    try {
      const res = await getStoreAnalytics(selectedPeriod)
      if (res.success && res.data) {
        setData(res.data)
      } else {
        toast.error(res.error || 'Failed to load analytics')
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      toast.error('Unexpected error loading analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAnalytics(period)
  }, [period])

  const handleExportReport = () => {
    if (!data) return

    const escapeCsv = (val: unknown) => {
      if (val === null || val === undefined) return '""'
      return `"${String(val).replace(/"/g, '""')}"`
    }

    const lines: string[] = [
      'SMART BEST BRANDS - EXECUTIVE ANALYTICS REPORT',
      `Generated on: ${new Date().toISOString()}`,
      `Period: ${period.toUpperCase()}`,
      '',
      'KEY METRICS',
      `Total Fulfilled Revenue (NGN),${data.totalRevenue}`,
      `Pipeline Gross Value (NGN),${data.pipelineValue}`,
      `Total Orders Recorded,${data.totalOrders}`,
      `Paid & Fulfilled Orders,${data.paidOrdersCount}`,
      `Pending Payment Orders,${data.pendingOrdersCount}`,
      `Delivered Orders,${data.deliveredOrdersCount}`,
      `Average Order Value (NGN),${data.averageOrderValue}`,
      `Total Units Sold,${data.totalUnitsSold}`,
      `Fulfillment Rate (%),${data.fulfillmentRate}%`,
      '',
      'BRAND PERFORMANCE BREAKDOWN',
      'Brand,Units Sold,Revenue (NGN),Market Share (%)',
      ...data.brandPerformance.map(
        (b) => `${escapeCsv(b.brand)},${b.unitsSold},${b.revenue},${b.percentage}%`
      ),
      '',
      'REGIONAL DELIVERY LOCATIONS',
      'Location,Orders Count,Revenue (NGN),Share (%)',
      ...data.regionalPerformance.map(
        (r) => `${escapeCsv(r.location)},${r.ordersCount},${r.revenue},${r.percentage}%`
      ),
      '',
      'TOP SELLING PRODUCTS',
      'Product Name,Brand,Units Sold,Total Revenue (NGN)',
      ...data.topProducts.map(
        (p) => `${escapeCsv(p.name)},${escapeCsv(p.brand)},${p.unitsSold},${p.revenue}`
      ),
    ]

    const csvContent = '\uFEFF' + lines.join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `smart-best-brands-analytics-${period}-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Analytics report downloaded successfully!')
  }

  // Calculate maximum revenue for scaling trend bars
  const maxTrendRevenue = Math.max(
    ...(data?.trends.map((t) => t.revenue) || [100000]),
    1
  )

  return (
    <div className="space-y-8 pb-20 font-sans">
      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-sky-50 text-sky-700 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              Executive Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
            Store Analytics &amp; Reports
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Real-time financial performance, product demand velocity, regional delivery volume, and brand market share.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period selector */}
          <div className="inline-flex bg-white p-1 rounded-2xl border border-stone-200 shadow-sm">
            {(
              [
                { id: 'all', label: 'All Time' },
                { id: 'year', label: 'This Year' },
                { id: '30d', label: 'Last 30 Days' },
                { id: '7d', label: 'Last 7 Days' },
              ] as const
            ).map((tab) => {
              const active = period === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setPeriod(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-blue-950 text-white shadow-sm'
                      : 'text-slate-600 hover:text-blue-950 hover:bg-stone-50'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Export Report */}
          <button
            onClick={handleExportReport}
            disabled={!data || loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-50 text-blue-950 border border-stone-200 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-sky-700" />
            <span>Export Report (CSV)</span>
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-700 animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Compiling Store Analytics…
          </p>
        </div>
      ) : !data ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8">
          <p className="text-slate-500 text-sm">Unable to load analytics data.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* ── 1. Top KPI Summary Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Fulfilled Revenue */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm relative overflow-hidden group hover:border-sky-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Fulfilled Revenue
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  ₦
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
                ₦{Number(data.totalRevenue).toLocaleString()}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="text-emerald-700 font-bold">
                  {data.paidOrdersCount} orders
                </span>{' '}
                paid &amp; active
              </div>
            </div>

            {/* KPI 2: Total Pipeline Orders */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm relative overflow-hidden group hover:border-sky-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Orders
                </span>
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
                {data.totalOrders}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="text-amber-700 font-bold">
                  {data.pendingOrdersCount} pending
                </span>{' '}
                · {data.deliveredOrdersCount} delivered
              </div>
            </div>

            {/* KPI 3: Average Order Value */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm relative overflow-hidden group hover:border-sky-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Avg. Order Value
                </span>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
                ₦{Number(data.averageOrderValue).toLocaleString()}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                Across completed transactions
              </div>
            </div>

            {/* KPI 4: Units Sold & Delivery Rate */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm relative overflow-hidden group hover:border-sky-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Units Sold
                </span>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
                {data.totalUnitsSold}{' '}
                <span className="text-sm font-bold text-slate-400">pcs</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="text-sky-700 font-bold">{data.fulfillmentRate}%</span>{' '}
                fulfillment rate
              </div>
            </div>
          </div>

          {/* ── 2. Visual Revenue Velocity & Trends ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-blue-950 tracking-tight">
                  Revenue &amp; Orders Velocity
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological distribution of sales and order volume over time
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-blue-950" />
                  <span className="text-slate-600">Fulfilled Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-sky-400" />
                  <span className="text-slate-600">Order Count</span>
                </div>
              </div>
            </div>

            {data.trends.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
                No orders recorded during this timeframe
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 items-end h-56 pt-8 pb-2 border-b border-stone-100">
                  {data.trends.map((item, idx) => {
                    const heightPercent = Math.max(
                      Math.round((item.revenue / maxTrendRevenue) * 100),
                      item.orders > 0 ? 8 : 4
                    )
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center justify-end h-full group relative"
                      >
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-12 z-20 bg-blue-950 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap transition-opacity">
                          <div>₦{Number(item.revenue).toLocaleString()}</div>
                          <div className="text-sky-300 font-medium">
                            {item.orders} order{item.orders === 1 ? '' : 's'}
                          </div>
                        </div>

                        {/* Bar */}
                        <div className="w-full max-w-[32px] bg-stone-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.5, delay: idx * 0.03 }}
                            className="w-full bg-gradient-to-t from-blue-950 to-sky-700 rounded-t-xl group-hover:brightness-110 transition-all"
                          />
                        </div>

                        {/* X-axis Label */}
                        <span className="text-[10px] font-bold text-slate-500 mt-2 truncate w-full text-center">
                          {item.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── 3. Two-Column Breakdown: Order Status & Brand Share ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Order Status Distribution */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-blue-950 tracking-tight mb-1">
                  Order Status Breakdown
                </h2>
                <p className="text-xs text-slate-500 mb-6">
                  Fulfillment progression across all recorded customer purchases
                </p>

                {/* Progress bar stack */}
                <div className="w-full h-3 rounded-full bg-stone-100 flex overflow-hidden mb-6">
                  {data.statusDistribution.map((st) =>
                    st.count > 0 ? (
                      <div
                        key={st.status}
                        style={{ width: `${st.percentage}%` }}
                        className={`${st.bg} transition-all`}
                        title={`${st.label}: ${st.count} (${st.percentage}%)`}
                      />
                    ) : null
                  )}
                </div>

                {/* Legend list */}
                <div className="grid grid-cols-2 gap-3">
                  {data.statusDistribution.map((st) => (
                    <div
                      key={st.status}
                      className="p-3 rounded-2xl bg-stone-50/70 border border-stone-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${st.bg}`} />
                        <span className="text-xs font-semibold text-slate-700">
                          {st.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-blue-950">
                          {st.count}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">
                          ({st.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Brand Performance & Market Share */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
              <h2 className="text-lg font-bold text-blue-950 tracking-tight mb-1">
                Mattress Brand Performance
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Market share and revenue generated per manufacturer (Mouka, Vitafoam, Royal Foam)
              </p>

              {data.brandPerformance.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  No brand sales recorded in this period
                </div>
              ) : (
                <div className="space-y-4">
                  {data.brandPerformance.map((brand, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-blue-950">
                          {brand.brand}
                        </span>
                        <div className="text-right">
                          <span className="font-black text-blue-950">
                            ₦{Number(brand.revenue).toLocaleString()}
                          </span>
                          <span className="text-slate-400 ml-2 font-medium">
                            ({brand.unitsSold} pcs · {brand.percentage}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${brand.percentage}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.05 }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-950 to-sky-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── 4. Two-Column Breakdown: Top Products & Regional Delivery ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Products */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-blue-950 tracking-tight">
                    Top Selling Products
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Highest revenue-generating mattress models and furniture pieces
                  </p>
                </div>
                <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full">
                  Top 6
                </span>
              </div>

              {data.topProducts.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  No product sales recorded yet
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {data.topProducts.map((prod, idx) => (
                    <div
                      key={idx}
                      className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-stone-100 text-slate-500 text-xs font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-blue-950 truncate">
                            {prod.name}
                          </p>
                          <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                            {prod.brand} · {prod.unitsSold} units sold
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs sm:text-sm font-black text-blue-950">
                          ₦{Number(prod.revenue).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Regional Delivery Insights */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-blue-950 tracking-tight">
                    Regional Delivery Distribution
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Order volume &amp; revenue split by destination city / state
                  </p>
                </div>
                <div className="p-1.5 bg-stone-100 text-slate-600 rounded-lg">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>

              {data.regionalPerformance.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  No regional data recorded
                </div>
              ) : (
                <div className="space-y-4">
                  {data.regionalPerformance.map((region, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-blue-950 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-sky-700" />
                          {region.location}
                        </span>
                        <div className="text-right">
                          <span className="font-black text-blue-950">
                            ₦{Number(region.revenue).toLocaleString()}
                          </span>
                          <span className="text-slate-400 ml-2 font-medium">
                            ({region.ordersCount} orders · {region.percentage}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${region.percentage}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.05 }}
                          className="h-full rounded-full bg-sky-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── 5. Payment Methods Analysis ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
            <h2 className="text-lg font-bold text-blue-950 tracking-tight mb-1">
              Payment Method Breakdown
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Distribution of customer payment preferences (Paystack, Direct Bank Transfer, Cash on Delivery)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.paymentMethodPerformance.map((method, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-stone-50/70 border border-stone-100 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-950">
                      {method.method}
                    </span>
                    <CreditCard className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-blue-950">
                      ₦{Number(method.revenue).toLocaleString()}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                      {method.ordersCount} orders ({method.percentage}% volume)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
