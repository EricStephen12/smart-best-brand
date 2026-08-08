'use client';

import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, Clock, Send, Globe } from 'lucide-react';
import { submitContactInquiry } from '@/actions/contact';
import { getSupportPhone, getTelHref, getWhatsAppUrl } from '@/lib/contact-channels';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const whatsappUrl = getWhatsAppUrl();
  const supportPhone = getSupportPhone();
  const telHref = getTelHref();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await submitContactInquiry({ name, phone, email, subject, message });
      if (!result.success) {
        toast.error(result.error || 'Could not send message');
        return;
      }
      toast.success('Message sent — we will get back to you soon.');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setSubject('Product inquiry');
    } catch {
      toast.error('Could not send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 sm:pt-36 pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="space-y-10">
            <div>
              <p className="text-sky-700 text-xs font-semibold mb-3">Contact</p>
              <h1 className="text-4xl sm:text-5xl font-semibold text-blue-950 tracking-tight mb-4">
                Talk to Smart Best Brands
              </h1>
              <p className="text-stone-500 text-base leading-relaxed max-w-lg">
                Questions about mattresses, pillows, furniture, delivery, or bulk orders? Send a message and we’ll reply during business hours.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whatsappUrl && (
                <ContactInfo
                  icon={MessageCircle}
                  title="WhatsApp"
                  value="Chat with us"
                  link={whatsappUrl}
                />
              )}
              {supportPhone && telHref && (
                <ContactInfo
                  icon={Phone}
                  title="Phone"
                  value={supportPhone}
                  link={telHref}
                />
              )}
              <ContactInfo
                icon={Mail}
                title="Email"
                value="hello@smartbestbrands.com"
                link="mailto:hello@smartbestbrands.com"
              />
              <ContactInfo
                icon={Globe}
                title="Instagram"
                value="@smartbestbrands"
                link="https://instagram.com/smartbestbrands"
              />
            </div>

            <div className="p-6 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-4">
              <Clock className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-950 text-sm mb-1">Business hours</h4>
                <p className="text-stone-500 text-sm leading-relaxed">
                  We typically reply within a few hours, 8AM – 8PM.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200">
            <h2 className="text-lg font-semibold text-blue-950 mb-6">Send a message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name">
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-200 focus:border-sky-500 rounded-lg text-sm text-blue-950 outline-none"
                    placeholder="Your name"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-200 focus:border-sky-500 rounded-lg text-sm text-blue-950 outline-none"
                    placeholder="080…"
                  />
                </Field>
              </div>
              <Field label="Email (optional)">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-stone-200 focus:border-sky-500 rounded-lg text-sm text-blue-950 outline-none"
                  placeholder="you@email.com"
                />
              </Field>
              <Field label="Subject">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-stone-200 focus:border-sky-500 rounded-lg text-sm text-blue-950 outline-none"
                >
                  <option>Product inquiry</option>
                  <option>Delivery status</option>
                  <option>Bulk / corporate order</option>
                  <option>Custom size request</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Message">
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-stone-200 focus:border-sky-500 rounded-lg text-sm text-blue-950 outline-none resize-none"
                  placeholder="How can we help?"
                />
              </Field>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-950 hover:bg-sky-700 disabled:opacity-50 text-white font-medium text-sm py-3.5 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-stone-500">{label}</label>
      {children}
    </div>
  );
}

function ContactInfo({
  icon: Icon,
  title,
  value,
  link,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  link?: string;
}) {
  const content = (
    <div className="flex items-start gap-3 p-4 bg-white border border-stone-200 rounded-xl h-full">
      <Icon className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
      <div>
        <p className="text-xs text-stone-500 mb-0.5">{title}</p>
        <p className="text-sm font-medium text-blue-950">{value}</p>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} target={link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return content;
}
