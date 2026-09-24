import type { Metadata } from 'next'
import FAQsClient from './faqs-client'

export const metadata: Metadata = {
  title: 'FAQs | Smart Best Brands',
  description: 'Answers to common questions about our mattresses, delivery, returns, payments, and custom size orders.',
  alternates: { canonical: '/faqs' },
}

// FAQPage JSON-LD for Google rich results
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you sell original mattresses?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We are authorized distributors for all the brands listed on our site, including Vitafoam, Mouka Foam, and Royal Foam. Every mattress comes in its original factory packaging with a valid manufacturer warranty.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does delivery take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For locations within Abuja and Benin, delivery typically takes 24–48 hours. For other locations, it may take 3–5 business days depending on the size of the order.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I pay for my order?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can pay securely online via Paystack (debit card), direct bank transfer, or order via WhatsApp. Pay on delivery is not available for large furniture items.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I return a mattress?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Due to hygiene reasons, mattresses cannot be returned once the factory seal has been opened. If there is a factory defect, we will facilitate a free replacement through the manufacturer warranty process.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer bulk discounts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we offer special pricing for hotels, hospitals, and large corporate orders. Contact us via our contact page for a custom quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I order a custom size mattress?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we arrange custom mattress sizes. If you have a custom bed frame or special dimensions, we can place a custom order directly with Vitafoam, Mouka, or Royal Foam. Message us on WhatsApp with your measurements.',
      },
    },
  ],
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
