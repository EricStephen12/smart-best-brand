import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Smart Best Brands',
  description: 'Terms and conditions for purchasing from Smart Best Brands Nigeria.',
}

import TermsClient from './terms-client'

export default function TermsPage() {
  return <TermsClient />
}

