export interface Pixel {
  id: string
  x: number
  y: number
  w: number
  h: number
  owner_id: string | null
  url: string | null
  image_url: string | null
  title: string | null
  category: string | null
  vfx: string | null
  is_golden: boolean
  price_paid: number | null
  charity_amount: number | null
  created_at: string | null
  status: 'available' | 'reserved' | 'sold'
}

export interface PurchaseSession {
  pixels: { x: number; y: number; w: number; h: number }[]
  url: string
  title: string
  category: string
  vfx: string | null
  email: string
  total_pixels: number
  total_price: number
  is_golden: boolean
}

export type VFX = 'none' | 'neon_pulse' | 'diamond_shine' | 'cyber_glitch' | 'rainbow_wave' | 'fire'
export type Category = 'all' | 'tech' | 'business' | 'gaming' | 'entertainment' | 'fashion' | 'food' | 'crypto' | 'sports' | 'art' | 'adult'

export interface Stats {
  pixels_sold: number
  revenue: number
  charity_pool: number
  advertisers: number
}
