import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY not set in environment' }, { status: 500 })
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-02-25.clover',
    httpClient: Stripe.createFetchHttpClient(),
  })
  try {
    const body = await req.json()
    const { pixels, totalPrice, category, title, url, vfx } = body

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `PixelForGood — ${pixels} pixel${pixels > 1 ? 's' : ''}`,
              description: `Advertising space on PixelForGood.org · ${title || 'My Ad'} · 50% goes to charity`,
              tax_code: 'txcd_10000000',
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
        ...(vfx ? [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `VFX Effect — ${vfx.replace('_', ' ')}`,
              description: 'Visual animation effect for your pixel block',
              tax_code: 'txcd_10000000',
            },
            unit_amount: vfxPrice(vfx) * 100,
          },
          quantity: 1,
        }] : []),
      ],
      metadata: {
        pixels: String(pixels),
        category: category || 'other',
        title: title || '',
        url: url || '',
        vfx: vfx || '',
      },
      automatic_tax: { enabled: true },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Stripe error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function vfxPrice(vfx: string): number {
  const prices: Record<string, number> = {
    neon_pulse: 15,
    diamond_shine: 20,
    cyber_glitch: 25,
    rainbow_wave: 35,
    fire: 50,
  }
  return prices[vfx] || 0
}
