export const CANVAS_WIDTH = 1000
export const CANVAS_HEIGHT = 1000
export const TOTAL_PIXELS = CANVAS_WIDTH * CANVAS_HEIGHT

// Golden Zone — center 250x100 block
export const GOLDEN_ZONE = {
  x: 375,
  y: 450,
  w: 250,
  h: 100,
}

export const PRICE_PER_PIXEL = 1.00       // $1/px normal
export const PRICE_GOLDEN_PIXEL = 10.00   // $10/px golden zone
export const CHARITY_SPLIT = 0.50         // 50% to charity
export const IMPACT_FEE = 0.20            // 20% on resale

export const VFX_PRICES: Record<string, number> = {
  none: 0,
  neon_pulse: 15,
  diamond_shine: 20,
  cyber_glitch: 25,
  rainbow_wave: 35,
  fire: 50,
}

export const CATEGORIES = [
  { id: 'all',           label: 'All',           emoji: '🌐' },
  { id: 'tech',          label: 'Tech',          emoji: '💻' },
  { id: 'business',      label: 'Business',      emoji: '💼' },
  { id: 'gaming',        label: 'Gaming',        emoji: '🎮' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { id: 'fashion',       label: 'Fashion',       emoji: '👗' },
  { id: 'food',          label: 'Food',          emoji: '🍕' },
  { id: 'crypto',        label: 'Crypto',        emoji: '₿' },
  { id: 'sports',        label: 'Sports',        emoji: '⚽' },
  { id: 'art',           label: 'Art',           emoji: '🎨' },
  { id: 'adult',         label: '18+',           emoji: '🔞', restricted: true },
]

export const SITE_NAME = 'PixelForGood'
export const SITE_TAGLINE = 'Own your piece of the internet. Fund the future.'
export const SITE_URL = 'https://pixelforgood.com'
