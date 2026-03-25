import { Pixel, Stats } from '@/types'

// Mock sold pixels for demo — will be replaced by Supabase
export const MOCK_PIXELS: Pixel[] = [
  // Tech cluster
  { id: '1', x: 50, y: 50, w: 40, h: 40, owner_id: 'u1', url: 'https://github.com', image_url: null, title: 'GitHub', category: 'tech', vfx: 'neon_pulse', is_golden: false, price_paid: 40, charity_amount: 20, created_at: null, status: 'sold' },
  { id: '2', x: 100, y: 80, w: 30, h: 30, owner_id: 'u2', url: 'https://stripe.com', image_url: null, title: 'Stripe', category: 'tech', vfx: null, is_golden: false, price_paid: 30, charity_amount: 15, created_at: null, status: 'sold' },
  { id: '3', x: 200, y: 150, w: 50, h: 50, owner_id: 'u3', url: 'https://vercel.com', image_url: null, title: 'Vercel', category: 'tech', vfx: 'cyber_glitch', is_golden: false, price_paid: 50, charity_amount: 25, created_at: null, status: 'sold' },
  // Gaming cluster
  { id: '4', x: 600, y: 100, w: 60, h: 40, owner_id: 'u4', url: 'https://steam.com', image_url: null, title: 'Steam', category: 'gaming', vfx: 'fire', is_golden: false, price_paid: 60, charity_amount: 30, created_at: null, status: 'sold' },
  { id: '5', x: 700, y: 200, w: 40, h: 40, owner_id: 'u5', url: 'https://twitch.tv', image_url: null, title: 'Twitch', category: 'gaming', vfx: 'rainbow_wave', is_golden: false, price_paid: 40, charity_amount: 20, created_at: null, status: 'sold' },
  // Golden zone
  { id: '6', x: 400, y: 460, w: 80, h: 50, owner_id: 'u6', url: 'https://example.com', image_url: null, title: 'Premium Ad', category: 'business', vfx: 'diamond_shine', is_golden: true, price_paid: 800, charity_amount: 400, created_at: null, status: 'sold' },
  // Crypto
  { id: '7', x: 800, y: 400, w: 35, h: 35, owner_id: 'u7', url: 'https://coinbase.com', image_url: null, title: 'Coinbase', category: 'crypto', vfx: 'neon_pulse', is_golden: false, price_paid: 35, charity_amount: 17.5, created_at: null, status: 'sold' },
  { id: '8', x: 850, y: 500, w: 45, h: 30, owner_id: 'u8', url: 'https://bitcoin.org', image_url: null, title: 'Bitcoin', category: 'crypto', vfx: null, is_golden: false, price_paid: 45, charity_amount: 22.5, created_at: null, status: 'sold' },
  // Art
  { id: '9', x: 300, y: 700, w: 55, h: 45, owner_id: 'u9', url: 'https://behance.net', image_url: null, title: 'Behance', category: 'art', vfx: 'rainbow_wave', is_golden: false, price_paid: 55, charity_amount: 27.5, created_at: null, status: 'sold' },
  // Sports
  { id: '10', x: 150, y: 800, w: 40, h: 40, owner_id: 'u10', url: 'https://nba.com', image_url: null, title: 'NBA', category: 'sports', vfx: null, is_golden: false, price_paid: 40, charity_amount: 20, created_at: null, status: 'sold' },
]

export const MOCK_STATS: Stats = {
  pixels_sold: 347829,
  revenue: 347829,
  charity_pool: 173914,
  advertisers: 2847,
}

export const MOCK_RECENT = [
  { title: 'TechCorp', pixels: 500, category: 'tech', time: '2 min ago' },
  { title: 'GameZone', pixels: 100, category: 'gaming', time: '7 min ago' },
  { title: 'CryptoDAO', pixels: 250, category: 'crypto', time: '14 min ago' },
  { title: 'ArtStudio', pixels: 64, category: 'art', time: '23 min ago' },
  { title: 'FoodieApp', pixels: 36, category: 'food', time: '31 min ago' },
]
