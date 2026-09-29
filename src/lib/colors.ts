/**
 * Centralized Brand Colors System
 * Single source of truth for all brand and theme colors across Smart Best Brands.
 *
 * Use this file whenever you need color values in code, or use the corresponding
 * CSS variables and Tailwind classes (e.g. `bg-brand-primary`, `bg-navy-dark`, `text-brand-accent`).
 */

export const BRAND_COLORS = {
  // Primary Navy Palette
  navy: '#172554',        // Primary luxury navy
  navyDark: '#0c1633',    // Deep navy for footer, dark hero banners
  navyLight: '#1e3a8a',   // Navy hover / interactive
  navyMuted: '#1e293b',   // Dark slate/navy for subtle borders
  navyDeep: '#080d1e',    // Deepest navy for backdrop contrast

  // Accent & Secondary
  sky: '#0284c7',         // Vibrant sky accent
  skyLight: '#e0f2fe',    // Soft sky tint for chips/highlights
  skyDark: '#0369a1',     // Deep sky blue for hover
  gold: '#d97706',        // Warm accent
  amber: '#f59e0b',       // Star ratings & highlights

  // Warm & Cream Neutrals
  white: '#ffffff',
  canvas: '#f7f6f3',      // Soft canvas background
  cream: '#f2ece2',       // Warm section banner background
  creamBorder: '#e5dcce', // Delicate cream separator border
  sand: '#f5f3ef',        // Product image canvas
  sandDark: '#ebe7df',
  borderLight: '#e2e8f0',
  textMuted: '#64748b',

  // Messaging & Channels
  whatsapp: '#128c7e',
  whatsappDark: '#0e7568',
  whatsappLight: '#25d366',

  // Status & Feedback
  success: '#16a34a',
  error: '#dc2626',
  warning: '#d97706',
  info: '#0284c7',
} as const

export type BrandColorKey = keyof typeof BRAND_COLORS

export const COLORS = {
  brandPrimary: BRAND_COLORS.navy,
  brandAccent: BRAND_COLORS.sky,
  brandBg: BRAND_COLORS.white,
  deepBlue: BRAND_COLORS.navy,
  footerBg: BRAND_COLORS.navyDark,
  badgeBg: BRAND_COLORS.navy,
  buttonHover: BRAND_COLORS.navyLight,
  canvasBg: BRAND_COLORS.canvas,
  creamBg: BRAND_COLORS.cream,
  creamBorder: BRAND_COLORS.creamBorder,
  sandBg: BRAND_COLORS.sand,
  whatsappBg: BRAND_COLORS.whatsapp,
  whatsappHover: BRAND_COLORS.whatsappDark,
  scrollbarThumb: '#d4d4d4',
  glass: 'rgba(255,255,255,0.9)',
} as const

export type ColorKey = keyof typeof COLORS

export default COLORS
