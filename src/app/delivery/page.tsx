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
      <div className="py-24 sm:py-32 max-w-7xl mx-auto px-4 font-sans">
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
              <div className="text-8xl font-black text-slate-50 mb-6 group-hover:text-sky-50 transition-colors duration-500 font-display">
                {step.number}
              </div>
              <div className="relative -mt-16 sm:-mt-20 pl-4 sm:pl-6 border-l-4 border-sky-600">
                <h3 className="text-2xl font-black text-blue-950 mb-4 tracking-tight uppercase">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium font-inter">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Delivery Zones Table */}
      <div className="bg-slate-50 py-24 sm:py-32 font-sans">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-blue-950 mb-4 uppercase tracking-tighter font-display">Logistic Domains</h2>
            <div className="w-20 h-2 bg-sky-600"></div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-950/5 overflow-hidden border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-950 text-white">
                    <th className="p-8 font-black uppercase tracking-[0.2em] text-[10px]">Region</th>
                    <th className="p-8 font-black uppercase tracking-[0.2em] text-[10px]">Investment</th>
                    <th className="p-8 font-black uppercase tracking-[0.2em] text-[10px]">Timeline</th>
                    <th className="p-8 font-black uppercase tracking-[0.2em] text-[10px]">Service Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {zones.map((zone, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-sky-600 group-hover:bg-white transition-colors">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <span className="font-black text-blue-950 text-xl tracking-tight">{zone.city}</span>
                        </div>
                      </td>
                      <td className="p-8 text-slate-500 font-black tabular-nums">{zone.price}</td>
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-slate-300" />
                          <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">{zone.time}</span>
                        </div>
                      </td>
                      <td className="p-8">
                        <span className="inline-block px-4 py-2 rounded-xl bg-sky-50 text-sky-600 text-[9px] font-black uppercase tracking-widest border border-sky-100">
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
      <div className="py-24 max-w-5xl mx-auto px-4 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h4 className="text-lg font-black text-blue-950 mb-6 flex items-center gap-4 uppercase tracking-tight">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-sky-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              Invoiced Transit
            </h4>
            <p className="text-slate-500 leading-relaxed font-medium font-inter">
              Every item is insured from the moment it leaves our warehouse until it is placed in your home. We take full responsibility for the safety of your purchase.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-black text-blue-950 mb-6 flex items-center gap-4 uppercase tracking-tight">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-sky-600">
                <HeadphonesIcon className="w-6 h-6" />
              </div>
              Precision Tracking
            </h4>
            <p className="text-slate-500 leading-relaxed font-medium font-inter">
              Our concierge team is available via WhatsApp to provide live updates on your order status and coordinate the perfect delivery time for you.
            </p>
          </div>
        </div>

        <div className="mt-20 p-12 sm:p-20 bg-blue-950 rounded-[3rem] text-center text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight font-display uppercase">The Elite Standard</h2>
            <p className="text-sky-200/80 mb-12 max-w-sm mx-auto font-medium text-lg font-inter leading-relaxed">Ready to curate your palace? Experience the pinnacle of authentic rest.</p>
            <a href="/products" className="btn-elite inline-flex !rounded-[2rem] px-16 group/btn">
              Explore Collections
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
            </a>
          </div>
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-400/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}

