export const BRAND = {
  name: 'Smart Best Brands',
  legalName: 'Smart Best Brands Nigeria',
  tagline: 'Original mattresses, pillows & furniture',
  shortDescription: 'Original Mouka, Vitafoam and Royal Foam mattresses. Delivered in Abuja and Benin City.',
  currency: '₦',
  currencyCode: 'NGN',
  country: 'Nigeria',
  location: 'Abuja · Benin City',
  cities: ['Abuja', 'Benin City', 'Lagos'],
  url: 'https://smartbestbrands.com',
} as const

export const CONTACT = {
  email: 'hello@smartbestbrands.com',
  supportPhone: '+2348000000000',
  whatsappNumber: '2348064619479',
  address: 'Abuja · Benin City',
  businessHours: '8AM – 8PM WAT (Mon – Sat)',
  responseNotice: 'We reply within a few hours.',
  socials: {
    instagram: 'https://instagram.com/smartbestbrands',
    facebook: '',
    twitter: '',
    tiktok: '',
    twitterHandle: '@smartbestbrands',
  },
} as const

export const BANK_DETAILS = {
  bankName: 'Moniepoint MFB / Zenith Bank',
  accountName: 'Smart Best Brands Nigeria',
  accountNumber: '08064619479',
} as const

export const ROUTES = {
  home: '/',
  products: '/products',
  about: '/about',
  contact: '/contact',
  blog: '/blog',
  faqs: '/faqs',
  ourStory: '/our-story',
  delivery: '/delivery',
  checkout: '/checkout',
  account: '/account',
  wishlist: '/account/wishlist',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  privacy: '/privacy',
  terms: '/terms',
  refund: '/refund',
  admin: '/account/site',
} as const

export const NAV_LEFT = [
  { label: 'Shop', href: ROUTES.products },
  { label: 'Blog', href: ROUTES.blog },
  { label: 'About', href: ROUTES.about },
] as const

export const NAV_RIGHT = [
  { label: 'Contact', href: ROUTES.contact },
  { label: 'Account', href: ROUTES.account },
] as const

export const NAV_MOBILE = [
  { label: 'Shop', href: ROUTES.products },
  { label: 'Blog', href: ROUTES.blog },
  { label: 'Wishlist', href: ROUTES.wishlist },
  { label: 'About', href: ROUTES.about },
  { label: 'FAQs', href: ROUTES.faqs },
  { label: 'Contact', href: ROUTES.contact },
  { label: 'Account', href: ROUTES.account },
] as const

export const FOOTER_SHOP_LINKS = [
  { label: 'All products', href: ROUTES.products },
  { label: 'Mattresses', href: `${ROUTES.products}?category=Mattresses` },
  { label: 'Pillows', href: `${ROUTES.products}?category=Pillows` },
  { label: 'Furniture', href: `${ROUTES.products}?category=Furniture` },
] as const

export const FOOTER_COMPANY_LINKS = [
  { label: 'About', href: ROUTES.about },
  { label: 'Blog & Guides', href: ROUTES.blog },
  { label: 'Contact', href: ROUTES.contact },
  { label: 'FAQs', href: ROUTES.faqs },
] as const

export const FOOTER_LEGAL_LINKS = [
  { label: 'Privacy', href: ROUTES.privacy },
  { label: 'Terms', href: ROUTES.terms },
  { label: 'Refunds', href: ROUTES.refund },
] as const

export const PAYMENT_METHODS = [
  { id: 'paystack', label: 'Paystack', description: 'Card, bank or USSD' },
  { id: 'bank_transfer', label: 'Bank Transfer', description: 'Pay into our account' },
  { id: 'whatsapp', label: 'WhatsApp Order', description: 'Order and pay through WhatsApp' },
] as const

export const ANNOUNCEMENT_BAR = {
  enabled: false,
  text: 'Original Mouka, Vitafoam & Royal Foam. Delivery in 24–48 hours.',
  link: ROUTES.products,
} as const

export const HERO_BANNERS = [
  {
    id: 'hero-1',
    title: 'Original Mattresses. Delivered.',
    subtitle: 'Mouka, Vitafoam and Royal Foam at your door in 24–48 hours.',
    imageUrl: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
    ctaLabel: 'Shop mattresses',
    ctaHref: ROUTES.products,
  },
  {
    id: 'hero-2',
    title: 'No fake foam.',
    subtitle: 'Sealed at the factory. Warranty card in the box.',
    imageUrl: '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg',
    ctaLabel: "See what's in stock",
    ctaHref: ROUTES.products,
  },
  {
    id: 'hero-3',
    title: 'Furniture for every room.',
    subtitle: 'Beds, sofas and more.',
    imageUrl: '/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg',
    ctaLabel: 'Shop furniture',
    ctaHref: ROUTES.products,
  },
] as const

export const STORY_CONTENT = {
  badge: 'About us',
  title: 'We sell original mattresses.',
  text: 'Fake foam is a real problem. We buy only from authorized distributors, so you get exactly what the factory made.',
  secondaryBadge: 'Our promise',
  secondaryTitle: 'Sealed. Original. Warranted.',
  secondaryText: "Every mattress comes in factory packaging with the manufacturer's warranty card.",
  stats: {
    statOneBadge: 'Partner Brands',
    statOneValue: '07',
    statTwoBadge: 'Original Stock',
    statTwoValue: '100%',
  },
  storyLinkLabel: 'Our story →',
} as const

export const PROMO_BANNER = {
  badge: 'Furniture',
  title: 'Furnish your home.',
  ctaLabel: 'Shop furniture',
  ctaHref: ROUTES.products,
  imageUrl: '/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg',
} as const

export const STYLE_COMFORT_CONTENT = {
  title: 'BUILT\nTO LAST',
  description:
    'Solid frames and good foam, in styles from modern to classic.',
  imageUrl: '/images/style-meets-comfort.jpg',
  imageAlt: 'Yellow armchair and modern credenza',
  stats: [
    {
      value: '1,200+',
      label: 'Furniture pieces',
    },
    {
      value: '98%',
      label: 'Happy customers',
    },
  ],
} as const

export const CURATED_COMBOS_SLIDES = [
  {
    id: 1,
    title: 'MODERN RETRO SUITE',
    price: '$849 ONLY',
    image: '/images/curated-combos.jpg',
    href: `${ROUTES.products}?category=Furniture`,
    ctaLabel: 'Shop Now',
  },
  {
    id: 2,
    title: 'CURATED COMBOS',
    price: '$999 ONLY',
    image: '/images/curated-combos.jpg',
    href: `${ROUTES.products}?category=Furniture`,
    ctaLabel: 'Shop Now',
  },
  {
    id: 3,
    title: 'SCANDI LIVING SET',
    price: '$1,199 ONLY',
    image: '/images/curated-combos.jpg',
    href: `${ROUTES.products}?category=Furniture`,
    ctaLabel: 'Shop Now',
  },
  {
    id: 4,
    title: 'MINIMALIST LOUNGE',
    price: '$799 ONLY',
    image: '/images/curated-combos.jpg',
    href: `${ROUTES.products}?category=Furniture`,
    ctaLabel: 'Shop Now',
  },
  {
    id: 5,
    title: 'MASTER BEDROOM BUNDLE',
    price: '$1,499 ONLY',
    image: '/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg',
    href: `${ROUTES.products}?category=Mattresses`,
    ctaLabel: 'Shop Now',
  },
  {
    id: 6,
    title: 'EXECUTIVE SUITE',
    price: '$1,299 ONLY',
    image: '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg',
    href: ROUTES.products,
    ctaLabel: 'Shop Now',
  },
  {
    id: 7,
    title: 'NORDIC RETREAT',
    price: '$899 ONLY',
    image: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
    href: ROUTES.products,
    ctaLabel: 'Shop Now',
  },
  {
    id: 8,
    title: 'URBAN ESSENTIALS',
    price: '$699 ONLY',
    image: '/images/curated-combos.jpg',
    href: ROUTES.products,
    ctaLabel: 'Shop Now',
  },
] as const

export const SHOP_HEADER = {
  title: 'Shop',
  tagline: 'Original mattresses, pillows and furniture.',
} as const

export const COLLECTIONS_SECTION = {
  title: 'Shop by category',
  description: 'Mattresses, pillows, furniture and bedding.',
} as const

export const FEATURED_SECTION = {
  title: 'Popular right now',
  description: 'What customers are buying.',
} as const

export const EDITORIAL_JOURNAL = {
  eyebrow: 'Guides',
  title: 'Buying guides',
  viewAllLabel: 'View all',
  viewAllHref: ROUTES.faqs,
  articles: [
    {
      id: '1',
      title: 'Orthopedic or semi-orthopedic: which is better for back pain?',
      category: 'Back pain',
      readTime: '4 min read',
      excerpt: 'What each one feels like, and who should choose which.',
      image: '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg',
      href: ROUTES.faqs,
    },
    {
      id: '2',
      title: 'How long should a mattress last?',
      category: 'Foam quality',
      readTime: '5 min read',
      excerpt: 'Why original foam outlasts cheap foam.',
      image: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
      href: ROUTES.about,
    },
    {
      id: '3',
      title: 'King or Queen: which size fits your room?',
      category: 'Sizing',
      readTime: '3 min read',
      excerpt: 'Measure your room before you buy.',
      image: '/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg',
      href: ROUTES.delivery,
    },
  ],
} as const

export const FOOTER_CONTENT = {
  text: 'Original mattresses, pillows and furniture.',
  acceptBadgeTitle: 'We accept',
} as const

export const PRODUCT_COLOR_SWATCHES = [
  { name: 'Oatmeal Bouclé', hex: '#EBE7DF', bg: 'bg-[#EBE7DF]' },
  { name: 'Warm Camel', hex: '#9B7C5F', bg: 'bg-[#9B7C5F]' },
  { name: 'Charcoal Black', hex: '#1C1917', bg: 'bg-[#1C1917]' },
  { name: 'Chalk White', hex: '#F5F5F0', bg: 'bg-[#F5F5F0]' },
] as const

export const PRODUCT_FEATURE_CHECKLIST = [
  '100% original',
  'Factory-sealed, with warranty card',
  'Delivered to your door',
  '7-day replacement for defects',
] as const

export const PRODUCT_TABS_DEFAULT = {
  descriptionParagraphs: [
    'Hardwood frame and high-density foam. Built to last.',
    'Sourced directly from the factory.',
  ],
  dimensionsParagraphs: [
    'Sizes: 3x6, 4x6, 5x6 and 6x6. Custom sizes on request.',
    'Leave 60cm of space around the bed.',
  ],
  materialsParagraphs: [
    'High-density foam with a quilted, dust-mite-resistant cover.',
    'Rotate your mattress every 3–6 months.',
  ],
  shippingParagraphs: [
    'We deliver in Abuja, Benin City, Lagos and other states.',
    'Delivered factory-sealed.',
  ],
  defaultSpecs: {
    materials: 'Rebonded foam, hardwood frame',
    firmness: 'Orthopedic',
    finishing: 'Jacquard / bouclé',
    warranty: '10-year factory warranty',
  },
} as const

export const PRODUCT_NEWSLETTER = {
  title: 'Get restock alerts',
  subtitle: 'New arrivals. Once a month.',
  placeholder: 'Enter your email',
  buttonLabel: 'Subscribe',
} as const

export const PARTNER_BRANDS = [
  'Mouka Foam',
  'Vitafoam',
  'Royal Foam',
] as const

export const FALLBACK_SCROLL_LABELS = [
  { id: 'x1', name: 'Mattresses', href: '/products?category=Mattresses' },
  { id: 'x2', name: 'Furniture', href: '/products?category=Furniture' },
  { id: 'x3', name: 'Pillows', href: '/products?category=Pillows' },
  { id: 'x4', name: 'Shop all', href: '/products' },
] as const

export const VALUES = [
  {
    id: 'authentic',
    title: 'Original',
    description: 'We buy only from authorized distributors.',
  },
  {
    id: 'delivery',
    title: 'Our own delivery',
    description: 'Our team delivers in Abuja and Benin City.',
  },
  {
    id: 'warranties',
    title: 'Real warranty',
    description: "The manufacturer's warranty card, not a shop promise.",
  },
  {
    id: 'people_first',
    title: 'Honest advice',
    description: 'We tell you what fits you, not what costs the most.',
  },
] as const

export const DELIVERY_STEPS = [
  {
    number: '01',
    title: 'Checked',
    description: 'We inspect and pack your order.',
  },
  {
    number: '02',
    title: 'Delivered',
    description: 'Our team brings it to your door.',
  },
  {
    number: '03',
    title: 'Confirmed',
    description: 'We agree a time and update you on WhatsApp.',
  },
] as const

export const DELIVERY_ZONES = [
  { city: 'Abuja', price: '₦5,000 - ₦15,000', time: '24-48 Hours', note: 'Doorstep delivery.' },
  { city: 'Benin City', price: '₦5,000 - ₦12,000', time: '24-48 Hours', note: 'Doorstep delivery.' },
  { city: 'Lagos', price: '₦15,000 - ₦35,000', time: '3-5 Business Days', note: 'Inter-state.' },
  { city: 'Other Locations', price: 'Calculated at Checkout', time: '5-7 Business Days', note: 'Partner courier.' },
] as const

export const TRUST_BADGES = [
  { id: 'secure', label: 'Secure checkout' },
  { id: 'warranty', label: 'Factory warranty' },
  { id: 'delivery', label: 'Nationwide delivery' },
] as const

export const POLICIES = {
  delivery: {
    title: 'Delivery',
    points: [
      'Abuja & Lagos: 24–48 hours. Same-day dispatch on morning orders.',
      'Other states: 3–5 business days.',
      'Check the packaging before the driver leaves.',
    ],
  },
  returns: {
    title: 'Returns',
    points: [
      'Return or exchange within 7 days of delivery.',
      'Mattress seal must be unopened.',
      'Defective or damaged in transit? Free replacement.',
    ],
  },
  warranty: {
    title: 'Warranty',
    points: [
      'Sourced directly from certified factories.',
      'Official warranty card included.',
      'We handle warranty claims with the factory for you.',
    ],
  },
} as const

export const CUSTOM_REQUEST_STEPS = [
  {
    title: 'Measure',
    desc: 'Send your length, width and height.',
  },
  {
    title: 'Confirm',
    desc: 'We get a quote from the factory.',
  },
  {
    title: 'Deliver',
    desc: 'Made and delivered in 5–10 days.',
  },
] as const

export const FAQS = [
  {
    question: 'Are your mattresses original?',
    answer: 'Yes. We are authorized distributors of Vitafoam, Mouka Foam and Royal Foam. Each one comes factory-sealed with a warranty card.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Abuja and Benin City: 24–48 hours. Other locations: 3–5 business days.',
  },
  {
    question: 'How do I pay?',
    answer: 'Paystack, bank transfer or WhatsApp. No pay on delivery for large furniture.',
  },
  {
    question: 'Can I return a mattress?',
    answer: 'Not after the factory seal is opened. If it has a factory defect, we replace it free.',
  },
  {
    question: 'Do you give bulk discounts?',
    answer: 'Yes, for hotels, hospitals and companies. Contact us for a quote.',
  },
  {
    question: 'Can I order a custom size?',
    answer: 'Yes. Send your measurements on WhatsApp.',
  },
] as const

export const CONTACT_SUBJECTS = [
  'Product inquiry',
  'Delivery status',
  'Bulk / corporate order',
  'Custom size request',
  'Other',
] as const

export const PRODUCT_CATEGORIES = [
  { label: 'All', slug: '' },
  { label: 'Mattresses', slug: 'Mattresses' },
  { label: 'Pillows', slug: 'Pillows' },
  { label: 'Furniture', slug: 'Furniture' },
  { label: 'Bedding', slug: 'Bedding' },
] as const

export const PRICE_RANGES = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under 50k', min: 0, max: 50000 },
  { label: '50k - 200k', min: 50000, max: 200000 },
  { label: '200k - 500k', min: 200000, max: 500000 },
  { label: 'Above 500k', min: 500000, max: Infinity },
] as const

export const MATTRESS_SIZES = [
  { label: '6x6 (King)', width: 6, length: 6 },
  { label: '6x7 (Super King)', width: 6, length: 7 },
  { label: '4.5x6 (Double)', width: 4.5, length: 6 },
  { label: '4x6 (Family)', width: 4, length: 6 },
  { label: '3x6 (Single)', width: 3, length: 6 },
] as const

export const SORT_OPTIONS = [
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A-Z', value: 'name_asc' },
] as const

export const ORDER_STATUS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
} as const

export const PAYMENT_STATUS = {
  unpaid: 'Unpaid',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
} as const

export const STORAGE_KEYS = {
  cart: 'sbb_cart_items',
  wishlist: 'sbb_wishlist_items',
  previewSettings: 'sbb_preview_site_settings',
} as const

import { BRAND_COLORS, COLORS } from './colors'
export { BRAND_COLORS, COLORS }
export * from './colors'

export const THEME_PRESETS = [
  {
    name: 'Classic Navy & Sky (Default)',
    primaryColor: BRAND_COLORS.navy,
    accentColor: BRAND_COLORS.sky,
    backgroundColor: '#ffffff',
  },
  {
    name: 'Clean White & Warm',
    primaryColor: '#111111',
    accentColor: '#9b7c5f',
    backgroundColor: '#ffffff',
  },
  {
    name: 'Emerald & Gold',
    primaryColor: '#064e3b',
    accentColor: '#d97706',
    backgroundColor: '#f6f7f5',
  },
  {
    name: 'Rich Burgundy & Rose',
    primaryColor: '#4a0404',
    accentColor: '#e11d48',
    backgroundColor: '#faf8f8',
  },
  {
    name: 'Charcoal & Amber',
    primaryColor: '#18181b',
    accentColor: '#f59e0b',
    backgroundColor: '#f4f4f5',
  },
] as const

export const FONTS = {
  displayVar: '--font-display',
  bodyVar: '--font-body',
  montserratVar: '--font-montserrat',
  defaultDisplay: 'Cormorant Garamond',
  defaultBody: 'Plus Jakarta Sans',
  wordmark: 'Montserrat',
} as const

export const LAYOUT = {
  containerClass: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  headerHeightDesktop: 96,
  headerHeightMobile: 80,
  headerScrollThreshold: 24,
  scrollbarWidth: '6px',
} as const

export const ANIMATION = {
  scrollLabelsDuration: '28s',
  mobileMenuDuration: 0.2,
  hoverTransitionMs: 300,
  heroAutoPlayIntervalMs: 6500,
  highlightPulseDuration: 1800,
  highlightRemoveDelay: 2000,
} as const

export const SEO = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://smartbestbrands.com',
  defaultOgImage: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  openingHours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '18:00',
  },
  paymentAccepted: 'Cash, Credit Card, Bank Transfer, Paystack',
} as const

export const TOAST_STYLE = {
  background: COLORS.deepBlue,
  color: '#fff',
  borderRadius: '1rem',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  padding: '1rem 2rem',
  border: '1px solid rgba(255,255,255,0.1)',
} as const

export const EXTERNAL = {
  paystackScript: 'https://js.paystack.co/v1/inline.js',
  googleFontsBase: 'https://fonts.googleapis.com/css2?family=',
} as const

// ── Admin Settings Tabs & UI Presets ──
export const SETTINGS_TABS = [
  { id: 'brand', label: 'Brand & Colors', iconName: 'Palette', description: 'Store name, colors and logo' },
  { id: 'design', label: 'Buttons & UI Design', iconName: 'Layers', description: 'Buttons, cards, badges and fonts' },
  { id: 'home', label: 'Homepage Text', iconName: 'Home', description: 'Hero, story, stats and promo text' },
  { id: 'shop', label: 'Shop & Catalog', iconName: 'ShoppingBag', description: 'Shop headers, featured products and categories' },
  { id: 'policies', label: 'Policies & FAQs', iconName: 'ShieldCheck', description: 'Delivery, returns, warranty, custom sizes and FAQs' },
  { id: 'contact', label: 'Contact & Socials', iconName: 'Phone', description: 'Phone, WhatsApp, address and social links' },
  { id: 'bank', label: 'Bank & Footer', iconName: 'CreditCard', description: 'Bank account details and footer text' },
] as const

export type SettingsTabId = (typeof SETTINGS_TABS)[number]['id']

export const COLOR_PRESETS = [
  { name: 'Navy & Sky (Default)', primary: BRAND_COLORS.navy, accent: BRAND_COLORS.sky, bg: '#f7f6f3' },
  { name: 'Midnight & Gold', primary: '#0f172a', accent: '#d97706', bg: '#fafaf9' },
  { name: 'Emerald Luxe', primary: '#064e3b', accent: '#10b981', bg: '#f4fbf7' },
  { name: 'Monochrome Noir', primary: '#18181b', accent: '#475569', bg: '#ffffff' },
  { name: 'Warm Terracotta', primary: '#431407', accent: '#c2410c', bg: '#fdfbf7' },
] as const

export const BUTTON_SHAPE_OPTIONS = [
  { value: 'sharp', label: 'Sharp', desc: 'Square corners', radius: '0px' },
  { value: 'rounded', label: 'Soft', desc: 'Slightly rounded', radius: '8px' },
  { value: 'pill', label: 'Pill', desc: 'Fully rounded', radius: '9999px' },
] as const

export const CARD_STYLE_OPTIONS = [
  { value: 'sharp', label: 'Square', desc: 'Sharp edges', radius: '0px' },
  { value: 'soft', label: 'Rounded', desc: 'Light curve', radius: '12px' },
  { value: 'curved', label: 'Deep Curve', desc: 'Very rounded', radius: '24px' },
] as const

export const BADGE_STYLE_OPTIONS = [
  { value: 'sharp', label: 'Square Tags', desc: 'Sharp corners' },
  { value: 'pill', label: 'Rounded Tags', desc: 'Fully rounded' },
] as const