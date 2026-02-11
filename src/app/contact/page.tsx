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
                className="text-sky-600 font-black tracking-[0.3em] text-xs uppercase mb-6 block"
              >
                Get in Touch
              </motion.span>
              <h1 className="text-6xl sm:text-8xl font-black text-blue-950 tracking-tight mb-8 leading-[0.9]">
                ELEVATE YOUR <br />
                <span className="text-gray-300">INTERIOR.</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed font-medium max-w-lg">
                Whether you're furnishing a palace or a penthouse, our concierge team is dedicated to your absolute satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <ContactInfo
                icon={MessageCircle}
                title="WhatsApp"
                value="Concierge Chat"
                link="https://wa.me/234XXXXXXXXXX"
                color="text-green-600"
              />
              <ContactInfo
                icon={Phone}
                title="Call"
                value="+234 (0) XXX XXX XXXX"
              />
              <ContactInfo
                icon={Mail}
                title="Email"
                value="hello@smartbestbrands.com"
              />
              <ContactInfo
                icon={Globe}
                title="Online"
                value="Instagram Direct"
                link="https://instagram.com/smartbestbrands"
              />
            </div>

            <div className="p-10 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 flex items-start gap-8 relative overflow-hidden group">
              <div className="bg-white p-4 rounded-2xl shadow-sm relative z-10 transition-transform group-hover:scale-110 duration-500">
                <Clock className="w-6 h-6 text-sky-600" />
              </div>
              <div className="relative z-10">
                <h4 className="font-bold text-blue-950 text-lg mb-1">Elite Response Time</h4>
                <p className="text-gray-600 font-medium">Our specialists typically respond within 15-30 minutes during business hours (8AM - 8PM).</p>
              </div>
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-[3.5rem] p-10 sm:p-16 shadow-2xl shadow-blue-950/5 border border-gray-100 relative"
          >
            <h2 className="text-3xl font-black text-blue-950 mb-10 uppercase tracking-tight flex items-center gap-4">
              Send a Message
              <div className="h-[2px] w-12 bg-sky-600"></div>
            </h2>
            <form className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input type="text" className="w-full px-6 py-5 bg-white border-none rounded-2xl focus:ring-4 focus:ring-sky-600/10 shadow-sm transition-all text-blue-950 font-bold placeholder:text-gray-300" placeholder="John Doe" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                  <input type="text" className="w-full px-6 py-5 bg-white border-none rounded-2xl focus:ring-4 focus:ring-sky-600/10 shadow-sm transition-all text-blue-950 font-bold placeholder:text-gray-300" placeholder="080 1234 5678" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Subject</label>
                <select className="w-full px-6 py-5 bg-white border-none rounded-2xl focus:ring-4 focus:ring-sky-600/10 shadow-sm transition-all text-blue-950 font-bold appearance-none cursor-pointer">
                  <option>Product Inquiry</option>
                  <option>Delivery Status</option>
                  <option>Bulk Orders (Hotels/Hospitals)</option>
                  <option>Bespoke Requirements</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Your Detailed Message</label>
                <textarea rows={5} className="w-full px-6 py-5 bg-white border-none rounded-2xl focus:ring-4 focus:ring-sky-600/10 shadow-sm transition-all text-blue-950 font-bold placeholder:text-gray-300 resize-none" placeholder="Tell us how we can help you create your dream space..." />
              </div>
              <button type="button" className="w-full flex items-center justify-center gap-3 bg-blue-950 hover:bg-sky-600 text-white font-black py-6 rounded-2xl shadow-2xl shadow-blue-900/10 transition-all transform active:scale-[0.98] group">
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Send Message
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
    <div className="group">
      <div className="flex items-center gap-4 mb-3">
        <Icon className={`w-5 h-5 ${color || 'text-sky-600'}`} />
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{title}</h4>
      </div>
      {link ? (
        <a href={link} className="text-2xl font-black text-blue-950 hover:text-sky-600 transition-colors underline decoration-sky-200 decoration-8 underline-offset-8">
          {value}
        </a>
      ) : (
        <p className="text-2xl font-black text-blue-950">{value}</p>
      )}
    </div>
  );
}
