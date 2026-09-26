export const BRAND = {
  name: 'Smart Best Brands',
  legalName: 'Smart Best Brands Nigeria',
  tagline: 'Quality mattresses, pillows & furniture',
  shortDescription: "Nigeria's home for original Mouka, Vitafoam, and Royal Foam mattresses — plus luxury furniture, pillows, and bedding.",
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
  responseNotice: 'We typically reply within a few hours, 8AM – 8PM.',
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
  { label: 'About', href: ROUTES.about },
] as const

export const NAV_RIGHT = [
  { label: 'Contact', href: ROUTES.contact },
  { label: 'Account', href: ROUTES.account },
] as const

export const NAV_MOBILE = [
  { label: 'Shop', href: ROUTES.products },
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
  { label: 'Contact', href: ROUTES.contact },
  { label: 'FAQs', href: ROUTES.faqs },
] as const

export const FOOTER_LEGAL_LINKS = [
  { label: 'Privacy', href: ROUTES.privacy },
  { label: 'Terms', href: ROUTES.terms },
  { label: 'Refunds', href: ROUTES.refund },
] as const

export const PAYMENT_METHODS = [
  { id: 'paystack', label: 'Paystack', description: 'Debit / Credit Card, Bank, USSD' },
  { id: 'bank_transfer', label: 'Bank Transfer', description: 'Direct transfer to our official business account' },
  { id: 'whatsapp', label: 'WhatsApp Order', description: 'Confirm and coordinate payment directly with our team' },
] as const

export const ANNOUNCEMENT_BAR = {
  enabled: false,
  text: 'Original Nigerian mattresses & furniture — fast delivery to your door.',
  link: ROUTES.products,
} as const

export const HERO_BANNERS = [
  {
    id: 'hero-1',
    title: 'Sleep Like It Matters',
    subtitle: "Original mattresses from Nigeria's most trusted brands — delivered to your door.",
    imageUrl: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
    ctaLabel: 'Shop the Collection',
    ctaHref: ROUTES.products,
  },
  {
    id: 'hero-2',
    title: 'No Fakes. Ever.',
    subtitle: "Every piece is factory-direct, sealed, and covered by a real manufacturer's warranty.",
    imageUrl: '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg',
    ctaLabel: "See what's in stock",
    ctaHref: ROUTES.products,
  },
  {
    id: 'hero-3',
    title: 'A Home Worth Coming Back To',
    subtitle: 'From the bedroom to the living room — furniture that earns its place.',
    imageUrl: '/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg',
    ctaLabel: 'Explore furniture',
    ctaHref: ROUTES.products,
  },
] as const

export const STORY_CONTENT = {
  badge: 'Who We Are',
  title: 'Original Mattresses, Directly to Your Home.',
  text: 'We started Smart Best Brands to make buying genuine mattresses simple in Nigeria. No fake foam, no hidden fees—just original brands like Mouka, Vitafoam, and Royal Foam delivered directly to your doorstep.',
  secondaryBadge: 'Our Promise',
  secondaryTitle: '100% Authentic, Direct From the Factory.',
  secondaryText: 'We source directly from authorized factory distributors so you never have to worry about counterfeits. Every mattress comes in its original factory packaging with a real manufacturer warranty.',
  stats: {
    statOneBadge: 'Partner Brands',
    statOneValue: '07',
    statTwoBadge: 'Original Stock',
    statTwoValue: '100%',
  },
  storyLinkLabel: 'Our full story →',
} as const

export const PROMO_BANNER = {
  badge: 'Crafted for Nigerian homes',
  title: 'Spaces worth living in.',
  ctaLabel: 'Shop the collection',
  ctaHref: ROUTES.products,
  imageUrl: '/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg',
} as const

export const SHOP_HEADER = {
  title: 'The Collection',
  tagline: 'Original mattresses, luxury furniture, and bedding — every piece factory-sealed and warranted.',
} as const

export const COLLECTIONS_SECTION = {
  title: 'Shop by category',
  description: 'Mattresses, pillows, furniture — find exactly what your space is missing.',
} as const

export const FEATURED_SECTION = {
  title: 'What people keep coming back for.',
  description: 'Our most-loved pieces — or browse everything we carry.',
} as const

export const FOOTER_CONTENT = {
  text: 'Authentic comfort for Nigerian homes. Quality mattresses, pillows, and furniture from trusted brands.',
  acceptBadgeTitle: 'We accept',
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
    title: '100% Authentic',
    description: "We source every product directly from authorised brand distributors. If it's not original, it doesn't make it onto our shelves.",
  },
  {
    id: 'delivery',
    title: 'Reliable Delivery',
    description: 'We handle delivery ourselves across Abuja and Benin City so your order arrives exactly as it left the factory.',
  },
  {
    id: 'warranties',
    title: 'Real Warranties',
    description: "Every mattress and piece of furniture comes with the manufacturer's original warranty — not a store promise, the actual card.",
  },
  {
    id: 'people_first',
    title: 'People First',
    description: "We take the time to understand what you actually need. The right mattress isn't the most expensive one — it's the right fit for you.",
  },
] as const

export const DELIVERY_STEPS = [
  {
    number: '01',
    title: 'Carefully Inspected',
    description: 'Every order is inspected and properly packaged before leaving our store or factory partner.',
  },
  {
    number: '02',
    title: 'Handled With Care',
    description: 'Our delivery team transports mattresses and furniture safely so they arrive in perfect, brand-new condition.',
  },
  {
    number: '03',
    title: 'Coordinated Delivery',
    description: 'We agree on a delivery day and time that works for you, with WhatsApp updates when your driver is on the way.',
  },
] as const

export const DELIVERY_ZONES = [
  { city: 'Abuja', price: '₦5,000 - ₦15,000', time: '24-48 Hours', note: 'Direct doorstep delivery.' },
  { city: 'Benin City', price: '₦5,000 - ₦12,000', time: '24-48 Hours', note: 'Local hub fulfillment.' },
  { city: 'Lagos', price: '₦15,000 - ₦35,000', time: '3-5 Business Days', note: 'Inter-state delivery.' },
  { city: 'Other Locations', price: 'Calculated at Checkout', time: '5-7 Business Days', note: 'Nationwide partner delivery.' },
] as const

export const TRUST_BADGES = [
  { id: 'secure', label: 'Secure checkout' },
  { id: 'warranty', label: 'Factory warranty' },
  { id: 'delivery', label: 'Nationwide delivery' },
] as const

export const POLICIES = {
  delivery: {
    title: 'Delivery & Transit Timelines',
    points: [
      'Abuja & Lagos: 24–48 hours (same-day dispatch available on morning orders).',
      'Other States: 3–5 business days via insured haulage.',
      'Inspection: You are encouraged to inspect item packaging upon delivery before courier team departs.',
    ],
  },
  returns: {
    title: '7-Day Return & Exchange Policy',
    points: [
      'Return Window: Returns or exchanges accepted within 7 days of delivery.',
      'Hygiene Standard: For mattresses, the original factory clear polythene seal must remain intact and unopened.',
      'Factory Flaws: Immediate 100% free replacement if manufacturing defect or transit damage is detected.',
    ],
  },
  warranty: {
    title: '100% Factory Warranty & Authenticity',
    points: [
      'Direct Sourcing: Factory-sealed products sourced directly from certified brand manufacturing plants.',
      'Manufacturer Certificate: Includes official manufacturer warranty card and documentation.',
      'Dedicated Support: Our team coordinates directly with the factory service center if assistance is ever required.',
    ],
  },
} as const

export const CUSTOM_REQUEST_STEPS = [
  {
    title: 'Measure',
    desc: 'Provide your exact length, width, and height.',
  },
  {
    title: 'Confirm',
    desc: 'We verify dimensions and get an exact quote from the factory.',
  },
  {
    title: 'Deliver',
    desc: 'The factory produces your size and we deliver in 5–10 days.',
  },
] as const

export const FAQS = [
  {
    question: 'Do you sell original mattresses?',
    answer: 'Yes. We are authorized distributors for all the brands listed on our site, including Vitafoam, Mouka Foam, and Royal Foam. Every mattress comes in its original factory packaging with a valid manufacturer warranty.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'For locations within Abuja and Benin, delivery typically takes 24–48 hours. For other locations, it may take 3–5 business days depending on the size of the order.',
  },
  {
    question: 'How do I pay for my order?',
    answer: 'You can pay securely online via Paystack (debit card), direct bank transfer, or order via WhatsApp. Pay on delivery is not available for large furniture items.',
  },
  {
    question: 'Can I return a mattress?',
    answer: 'Due to hygiene reasons, mattresses cannot be returned once the factory seal has been opened. If there is a factory defect, we will facilitate a free replacement through the manufacturer warranty process.',
  },
  {
    question: 'Do you offer bulk discounts?',
    answer: 'Yes, we offer special pricing for hotels, hospitals, and large corporate orders. Contact us via our contact page for a custom quote.',
  },
  {
    question: 'Can I order a custom size mattress?',
    answer: 'Yes, we arrange custom mattress sizes. If you have a custom bed frame or special dimensions, we can place a custom order directly with Vitafoam, Mouka, or Royal Foam. Message us on WhatsApp with your measurements.',
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

export const COLORS = {
  brandPrimary: '#172554',
  brandAccent: '#0284c7',
  brandBg: '#f7f6f3',
  deepBlue: '#0f172a',
  scrollbarThumb: '#1e293b',
  badgeBg: '#0284c7',
  glass: 'rgba(255,255,255,0.8)',
} as const

export const THEME_PRESETS = [
  {
    name: 'Classic Navy & Sky (Default)',
    primaryColor: '#172554',
    accentColor: '#0284c7',
    backgroundColor: '#f7f6f3',
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
  { id: 'brand', label: 'Brand & Colors', iconName: 'Palette', description: 'Store identity, brand colors, and logo' },
  { id: 'design', label: 'Buttons & UI Design', iconName: 'Layers', description: 'Button shapes, card corners, badges, typography, and backdrop watermarks' },
  { id: 'home', label: 'Homepage Writeups', iconName: 'Home', description: 'Hero banner, story, stats, and promo banner copy' },
  { id: 'shop', label: 'Shop & Catalog', iconName: 'ShoppingBag', description: 'Catalog headers, featured products, and categories' },
  { id: 'policies', label: 'Policies & FAQs', iconName: 'ShieldCheck', description: 'Delivery, returns, factory warranty, custom size request, and dynamic FAQs' },
  { id: 'contact', label: 'Contact & Socials', iconName: 'Phone', description: 'Phone, WhatsApp, address, and social links' },
  { id: 'bank', label: 'Bank & Footer', iconName: 'CreditCard', description: 'Bank transfer account details and footer copy' },
] as const

export type SettingsTabId = (typeof SETTINGS_TABS)[number]['id']

export const COLOR_PRESETS = [
  { name: 'Navy & Sky (Default)', primary: '#172554', accent: '#0284c7', bg: '#f7f6f3' },
  { name: 'Midnight & Gold', primary: '#0f172a', accent: '#d97706', bg: '#fafaf9' },
  { name: 'Emerald Luxe', primary: '#064e3b', accent: '#10b981', bg: '#f4fbf7' },
  { name: 'Monochrome Noir', primary: '#18181b', accent: '#475569', bg: '#ffffff' },
  { name: 'Warm Terracotta', primary: '#431407', accent: '#c2410c', bg: '#fdfbf7' },
] as const

export const BUTTON_SHAPE_OPTIONS = [
  { value: 'sharp', label: 'Architectural Sharp', desc: 'Square 90° corners, bold editorial presence', radius: '0px' },
  { value: 'rounded', label: 'Modern Soft', desc: 'Subtle 8px rounded corners, contemporary balance', radius: '8px' },
  { value: 'pill', label: 'Full Capsule / Pill', desc: 'Fully curved 9999px edges, approachable luxury', radius: '9999px' },
] as const

export const CARD_STYLE_OPTIONS = [
  { value: 'sharp', label: 'Square Editorial', desc: '0px crisp edges for architectural clarity', radius: '0px' },
  { value: 'soft', label: 'Modern Rounded', desc: '12px balanced curve for smooth readability', radius: '12px' },
  { value: 'curved', label: 'Luxury Deep Curved', desc: '24px deep organic radius for rich modern feel', radius: '24px' },
] as const

export const BADGE_STYLE_OPTIONS = [
  { value: 'sharp', label: 'Sharp Corner Tags', desc: '0px square minimalist tags' },
  { value: 'pill', label: 'Rounded Capsule', desc: 'Fully rounded pill badges' },
] as const
