import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { SiteSettingsProvider } from "@/components/site-settings-context";
import { getSiteSettings } from "@/actions/site-settings";
import { buildThemeCss } from "@/lib/site-settings";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://smartbestbrands.com'),
  title: {
    default: 'Smart Best Brands — Original Mattresses & Luxury Furniture Nigeria',
    template: '%s | Smart Best Brands',
  },
  description:
    'Nigeria\'s home for original Mouka, Vitafoam, and Royal Foam mattresses — plus luxury furniture, pillows, and bedding. Factory-direct pricing, genuine warranties, and doorstep delivery across Nigeria.',
  keywords: [
    'Smart Best Brands',
    'Smart Best',
    'Mouka Foam',
    'Mouka mattress Nigeria',
    'Vitafoam Nigeria',
    'Vitafoam mattress price',
    'Royal Foam Nigeria',
    'Royal Foam mattress',
    'original mattresses in Nigeria',
    'buy mattress Nigeria',
    'orthopedic mattress price Nigeria',
    'best mattress for back pain Nigeria',
    'semi orthopedic mattress',
    'spring mattress Lagos',
    'luxury furniture Lagos',
    'luxury furniture Abuja',
    'mattress store Lagos',
    'mattress store Abuja',
    'bed frames Nigeria',
    'pillows and bedding Lagos',
  ],
  authors: [{ name: 'Smart Best Brands', url: 'https://smartbestbrands.com' }],
  creator: 'Smart Best Brands',
  publisher: 'Smart Best Brands',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://smartbestbrands.com',
    siteName: 'Smart Best Brands',
    title: 'Smart Best Brands | Original Mattresses & Luxury Furniture Nigeria',
    description:
      'Factory-direct Mouka, Vitafoam, and Royal Foam mattresses — plus luxury furniture and bedding. 100% original, every time. Nationwide delivery across Nigeria.',
    images: [
      {
        url: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
        width: 1200,
        height: 630,
        alt: 'Smart Best Brands - Authentic Mattresses & Luxury Furniture in Nigeria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Best Brands | Original Mattresses & Luxury Furniture Nigeria',
    description:
      'Original Mouka, Vitafoam, Royal Foam mattresses and luxury furniture with fast doorstep delivery across Nigeria.',
    images: ['/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg'],
    creator: '@smartbestbrands',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();
  const themeCss = buildThemeCss(siteSettings);

  const businessJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['FurnitureStore', 'HomeGoodsStore'],
    '@id': 'https://smartbestbrands.com/#store',
    name: 'Smart Best Brands',
    alternateName: ['Smart Best', 'Smart Best Brands Nigeria', 'SmartBest'],
    url: 'https://smartbestbrands.com',
    logo: 'https://smartbestbrands.com/favicon.ico',
    image: 'https://smartbestbrands.com/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
    description:
      'Nigeria\'s premier destination for 100% authentic Mouka Foam, Vitafoam, and Royal Foam mattresses — plus bespoke luxury furniture — with nationwide delivery.',
    telephone: siteSettings.supportPhone || '+2348000000000',
    email: siteSettings.contactEmail || 'hello@smartbestbrands.com',
    priceRange: '₦₦',
    currenciesAccepted: 'NGN',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer, Paystack',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abuja',
      addressRegion: 'FCT',
      addressCountry: 'NG',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      siteSettings.instagramUrl || 'https://instagram.com/smartbestbrands',
      siteSettings.facebookUrl || '',
      siteSettings.twitterUrl || '',
    ].filter(Boolean),
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://smartbestbrands.com/#website',
    url: 'https://smartbestbrands.com',
    name: 'Smart Best Brands',
    description: 'Original Mattresses, Bedding & Luxury Furniture in Nigeria',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://smartbestbrands.com/products?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${cormorant.variable} ${jakarta.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <SiteSettingsProvider settings={siteSettings}>
          <CartProvider>
            <WishlistProvider>
              <Layout>
                {children}
              </Layout>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: '#0f172a',
                    color: '#fff',
                    borderRadius: '1rem',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '1rem 2rem',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </SiteSettingsProvider>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
