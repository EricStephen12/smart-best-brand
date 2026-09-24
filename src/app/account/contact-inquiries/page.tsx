'use client'

import React, { useEffect, useState } from 'react'
import { getAllContactInquiries } from '@/actions/contact'
import toast from 'react-hot-toast'
import { Loader2, Mail, Phone, MessageSquare, Clock, Search } from 'lucide-react'

type Inquiry = {
  id: string
  name: string
  phone: string
  email: string | null
  subject: string
  message: string
  createdAt: string | Date
}

export default function ContactInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      setLoading(true)
      const result = await getAllContactInquiries()
      if (result.success && result.data) setInquiries(result.data as Inquiry[])
      else toast.error(result.error || 'Failed to load inquiries')
      setLoading(false)
    })()
  }, [])

  const filtered = inquiries.filter((i) => {
    const q = search.toLowerCase()
    return (
      !q ||
      i.name.toLowerCase().includes(q) ||
      i.subject.toLowerCase().includes(q) ||
      i.email?.toLowerCase().includes(q) ||
      i.phone.includes(q)
    )
  })

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
          Contact Inquiries
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Messages submitted through the contact form.{' '}
          {!loading && (
            <span className="font-semibold text-blue-950">{inquiries.length} total</span>
          )}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Search by name, email, subject…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-blue-950 placeholder:text-stone-400 outline-none focus:border-blue-950/50 focus:ring-2 focus:ring-blue-950/10 transition-all bg-white"
        />
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-sky-700" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white border border-stone-200 rounded-2xl">
          <MessageSquare className="w-10 h-10 text-stone-200 mx-auto mb-3" />
          <p className="text-sm text-stone-500">
            {search ? 'No inquiries match your search.' : 'No contact inquiries yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inquiry) => {
            const isOpen = open === inquiry.id
            return (
              <div
                key={inquiry.id}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden"
              >
                {/* Header row — always visible */}
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : inquiry.id)}
                  className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 text-left hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-700 shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-blue-950 truncate">
                        {inquiry.name}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5 truncate">
                        {inquiry.subject}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0 pl-14 sm:pl-0">
                    {inquiry.email && (
                      <span className="inline-flex items-center gap-1 text-xs text-stone-500">
                        <Mail className="w-3 h-3" /> {inquiry.email}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-stone-500">
                      <Phone className="w-3 h-3" /> {inquiry.phone}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-stone-400">
                      <Clock className="w-3 h-3" />
                      {new Date(inquiry.createdAt).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className={`text-xs font-semibold transition-colors ${isOpen ? 'text-blue-950' : 'text-stone-400'}`}>
                      {isOpen ? '▲ Hide' : '▼ View'}
                    </span>
                  </div>
                </button>

                {/* Expanded message */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-stone-100 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-xs">
                      <div>
                        <p className="font-black uppercase tracking-wider text-stone-400 mb-1">Name</p>
                        <p className="font-semibold text-blue-950">{inquiry.name}</p>
                      </div>
                      <div>
                        <p className="font-black uppercase tracking-wider text-stone-400 mb-1">Phone</p>
                        <a href={`tel:${inquiry.phone}`} className="font-semibold text-sky-700 hover:underline">
                          {inquiry.phone}
                        </a>
                      </div>
                      {inquiry.email && (
                        <div>
                          <p className="font-black uppercase tracking-wider text-stone-400 mb-1">Email</p>
                          <a href={`mailto:${inquiry.email}`} className="font-semibold text-sky-700 hover:underline break-all">
                            {inquiry.email}
                          </a>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-stone-400 mb-2">Message</p>
                      <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 border border-stone-100 rounded-xl p-4 whitespace-pre-wrap">
                        {inquiry.message}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      {inquiry.email && (
                        <a
                          href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}`}
                          className="inline-flex items-center gap-2 bg-blue-950 hover:bg-sky-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Reply by email
                        </a>
                      )}
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="inline-flex items-center gap-2 border border-stone-200 text-blue-950 hover:border-stone-300 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
