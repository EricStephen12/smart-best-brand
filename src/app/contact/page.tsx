'use client';

import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <div className="pt-32 sm:pt-48 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">

          {/* Left Column: Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12 sm:space-y-16"
          >
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sky-600 font-black tracking-[0.3em] text-[10px] uppercase mb-6 block font-sans"
              >
                04 / Concierge Protocol
              </motion.span>
              <h1 className="text-6xl sm:text-8xl font-black text-blue-950 tracking-[-0.04em] mb-8 leading-[0.85] font-display uppercase">
                ELEVATE YOUR <br />
                <span className="text-slate-200">INTERIOR.</span>
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-lg font-inter">
                Whether you&apos;re furnishing a palace or a penthouse, our concierge team is dedicated to your absolute satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <ContactInfo
                icon={MessageCircle}
                title="WhatsApp"
                value="Concierge Chat"
                link="https://wa.me/2349033333333"
                color="text-emerald-500"
              />
              <ContactInfo
                icon={Phone}
                title="Direct Line"
                value="+234 903 333 3333"
              />
              <ContactInfo
                icon={Mail}
                title="Correspondence"
                value="hello@smartbestbrands.com"
                link="mailto:hello@smartbestbrands.com"
              />
              <ContactInfo
                icon={Globe}
                title="Elite Social"
                value="Instagram Direct"
                link="https://instagram.com/smartbestbrands"
              />
            </div>

            <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-start gap-8 relative overflow-hidden group">
              <div className="bg-white p-4 rounded-2xl shadow-sm relative z-10 transition-transform group-hover:scale-110 duration-500">
                <Clock className="w-6 h-6 text-sky-600" />
              </div>
              <div className="relative z-10">
                <h4 className="font-black text-blue-950 text-lg mb-1 tracking-tight uppercase">Elite Response Time</h4>
                <p className="text-slate-500 font-medium font-inter leading-relaxed">Our specialists typically respond within 15-30 minutes during business hours (8AM - 8PM).</p>
              </div>
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-50 rounded-[3.5rem] p-10 sm:p-16 shadow-2xl shadow-blue-950/5 border border-slate-100 relative"
          >
            <h2 className="text-2xl font-black text-blue-950 mb-10 uppercase tracking-widest flex items-center gap-4 font-display">
              Inquiry Dossier
              <div className="h-[2px] w-12 bg-sky-600"></div>
            </h2>
            <form className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 font-sans">Full Patron Name</label>
                  <input type="text" className="w-full px-6 py-5 bg-white border-2 border-transparent focus:border-sky-600 rounded-2xl transition-all text-blue-950 font-bold placeholder:text-slate-200 outline-none" placeholder="e.g. Adebayo Johnson" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 font-sans">Contact Terminal</label>
                  <input type="text" className="w-full px-6 py-5 bg-white border-2 border-transparent focus:border-sky-600 rounded-2xl transition-all text-blue-950 font-bold placeholder:text-slate-200 outline-none" placeholder="080 1234 5678" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 font-sans">Inquiry Subject</label>
                <select className="w-full px-6 py-5 bg-white border-2 border-transparent focus:border-sky-600 rounded-2xl transition-all text-blue-950 font-bold appearance-none cursor-pointer outline-none">
                  <option>Product Acquisition Inquiry</option>
                  <option>Logistics & Delivery Status</option>
                  <option>Bulk Institutional Orders</option>
                  <option>Bespoke Specifications</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 font-sans">Detailed Specification</label>
                <textarea rows={5} className="w-full px-6 py-5 bg-white border-2 border-transparent focus:border-sky-600 rounded-2xl transition-all text-blue-950 font-bold placeholder:text-slate-200 resize-none outline-none" placeholder="Define your requirement with precision..." />
              </div>
              <button type="button" className="btn-elite w-full">
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Transmit Inquiry
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ContactInfo({ icon: Icon, title, value, link, color }: { icon: React.ElementType, title: string, value: string, link?: string, color?: string }) {
  return (
    <div className="group font-sans">
      <div className="flex items-center gap-4 mb-3">
        <Icon className={`w-4 h-4 ${color || 'text-sky-600'}`} />
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h4>
      </div>
      {link ? (
        <a href={link} className="text-xl font-black text-blue-950 hover:text-sky-600 transition-colors underline decoration-sky-600 decoration-2 underline-offset-8">
          {value}
        </a>
      ) : (
        <p className="text-xl font-black text-blue-950">{value}</p>
      )}
    </div>
  );
}
