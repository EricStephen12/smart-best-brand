import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund & Returns Policy | Smart Best Brands',
  description: 'Our return, refund, and exchange policy for mattresses, furniture, and bedding.',
}

import RefundClient from './refund-client'

export default function RefundPage() {
  return <RefundClient />
}

