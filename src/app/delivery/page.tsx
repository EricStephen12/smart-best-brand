'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  Package,
  ArrowRight,
  HeadphonesIcon
} from 'lucide-react';

const deliverySteps = [
  {
    number: "01",
    title: "Quality Curation",
    description: "Every order undergoes a rigorous quality inspection at our central hub before being meticulously packaged for transit.",
    icon: Package
  },
  {
    number: "02",
    title: "Elite Handling",
    description: "Our specialized logistics partners treat your furniture with the utmost care, ensuring safe passage to your doorstep.",
    icon: ShieldCheck
  },
  {
    number: "03",
    title: "Precise Delivery",
    description: "Scheduled delivery windows that respect your time, with real-time updates as your collection approaches.",
    icon: Truck
  }
];

const zones = [
  { city: "Abuja", price: "₦5,000 - ₦15,000", time: "24-48 Hours", note: "Priority white-glove service available." },
  { city: "Benin City", price: "₦5,000 - ₦12,000", time: "24-48 Hours", note: "Local hub fulfillment." },
  { city: "Lagos", price: "₦15,000 - ₦35,000", time: "3-5 Business Days", note: "Inter-state logistics." },
  { city: "Other Locations", price: "Calculated at Checkout", time: "5-7 Business Days", note: "National coverage via partners." }
];

export default function DeliveryPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="pt-32 pb-20 sm:pt-48 sm:pb-32 bg-blue-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight mb-8 leading-none">
              ELITE <span className="text-sky-400">LOGISTICS.</span>
            </h1>
            <p className="text-xl text-sky-100/80 font-medium leading-relaxed max-w-2xl">
              Our commitment to excellence extends beyond our products. We ensure a seamless, premium delivery experience for every piece in your collection.
            </p>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sky-600/20 to-transparent"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Delivery Process (Editorial Style) */}
      <div className="py-24 sm:py-32 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-20">
          {deliverySteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="text-8xl font-black text-blue-50 mb-6 group-hover:text-sky-50 transition-colors duration-500">
                {step.number}
              </div>
              <div className="relative -mt-16 sm:-mt-20 pl-4 sm:pl-6 border-l-4 border-sky-500">
                <h3 className="text-2xl font-bold text-blue-950 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Delivery Zones Table */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-blue-950 mb-4 uppercase tracking-tight">Delivery Zones</h2>
            <div className="w-20 h-2 bg-sky-600"></div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-950 text-white">
                    <th className="p-8 font-bold uppercase tracking-widest text-xs">Region</th>
                    <th className="p-8 font-bold uppercase tracking-widest text-xs">Estimated Fee</th>
                    <th className="p-8 font-bold uppercase tracking-widest text-xs">Timeline</th>
                    <th className="p-8 font-bold uppercase tracking-widest text-xs">Service Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {zones.map((zone, idx) => (
                    <tr key={idx} className="group hover:bg-sky-50/50 transition-colors">
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-sky-600" />
                          <span className="font-bold text-blue-950 text-xl">{zone.city}</span>
                        </div>
                      </td>
                      <td className="p-8 text-gray-700 font-bold">{zone.price}</td>
                      <td className="p-8">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 font-medium">{zone.time}</span>
                        </div>
                      </td>
                      <td className="p-8">
                        <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-900 text-sm font-bold">
                          {zone.note}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ / Reassurance Strip */}
      <div className="py-24 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h4 className="text-xl font-bold text-blue-950 mb-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-sky-600" />
              Secure Transit
            </h4>
            <p className="text-gray-600 leading-relaxed font-medium">
              Every item is insured from the moment it leaves our warehouse until it is placed in your home. We take full responsibility for the safety of your purchase.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-bold text-blue-950 mb-4 flex items-center gap-3">
              <HeadphonesIcon className="w-6 h-6 text-sky-600" />
              Real-time Tracking
            </h4>
            <p className="text-gray-600 leading-relaxed font-medium">
              Our concierge team is available via WhatsApp to provide live updates on your order status and coordinate the perfect delivery time for you.
            </p>
          </div>
        </div>

        <div className="mt-20 p-12 bg-blue-950 rounded-[3rem] text-center text-white relative overflow-hidden group">
          <div className="relative z-10 transition-transform group-hover:scale-105 duration-700">
            <h2 className="text-3xl font-black mb-6">Experience the Elite Standard</h2>
            <p className="text-sky-200 mb-10 max-w-sm mx-auto font-medium">Ready to curated your palace? Shop our latest designer collections now.</p>
            <a href="/products" className="inline-flex items-center gap-3 bg-sky-600 hover:bg-sky-500 text-white font-black py-5 px-12 rounded-2xl shadow-2xl transition-all">
              Shop Collections
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}

