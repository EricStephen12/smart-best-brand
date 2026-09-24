import type { Metadata } from 'next'
import ContactClient from './contact-client'

export const metadata: Metadata = {
  title: 'Contact Us | Smart Best Brands',
  description: 'Get in touch with Smart Best Brands for questions about mattresses, furniture, delivery, bulk orders, or custom sizes. We reply within a few hours.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Smart Best Brands',
    description: 'Questions about mattresses, delivery, or bulk orders? Reach us on WhatsApp, phone, or email.',
    type: 'website',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
