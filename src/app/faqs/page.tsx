import type { Metadata } from 'next'
import FAQsClient from './faqs-client'
import { FAQS } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'FAQs | Smart Best Brands',
  description: 'Answers to common questions about our mattresses, delivery, returns, payments, and custom size orders.',
  alternates: { canonical: '/faqs' },
}

// FAQPage JSON-LD for Google rich results
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQsClient />
    </>
  )
}
