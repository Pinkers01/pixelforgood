'use client'

import { useState, useRef } from 'react'
import { X, Upload, Link, Tag, Sparkles, Heart } from 'lucide-react'
import { VFX_PRICES, PRICE_PER_PIXEL, PRICE_GOLDEN_PIXEL, CHARITY_SPLIT, GOLDEN_ZONE, CATEGORIES } from '@/lib/constants'

interface BuyModalProps {
  open: boolean
  onClose: () => void
  selectedArea: { x: number; y: number; w: number; h: number } | null
}

const VFX_OPTIONS = [
  { id: 'none',          label: 'None',         emoji: '○', price: 0 },
  { id: 'neon_pulse',    label: 'Neon Pulse',   emoji: '💙', price: 15 },
  { id: 'diamond_shine', label: 'Diamond',      emoji: '💎', price: 20 },
  { id: 'cyber_glitch',  label: 'Cyber Glitch', emoji: '⚡', price: 25 },
  { id: 'rainbow_wave',  label: 'Rainbow',      emoji: '🌈', price: 35 },
  { id: 'fire',          label: 'Fire',         emoji: '🔥', price: 50 },
]

function isInGoldenZone(area: { x: number; y: number; w: number; h: number }) {
  return (
    area.x >= GOLDEN_ZONE.x && area.y >= GOLDEN_ZONE.y &&
    area.x + area.w <= GOLDEN_ZONE.x + GOLDEN_ZONE.w &&
    area.y + area.h <= GOLDEN_ZONE.y + GOLDEN_ZONE.h
  )
}

export default function BuyModal({ open, onClose, selectedArea }: BuyModalProps) {
  const [step, setStep] = useState(1)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('tech')
  const [vfx, setVfx] = useState('none')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const area = selectedArea || { x: 0, y: 0, w: 10, h: 10 }
  const totalPixels = area.w * area.h
  const golden = isInGoldenZone(area)
  const pricePerPx = golden ? PRICE_GOLDEN_PIXEL : PRICE_PER_PIXEL
  const pixelCost = totalPixels * pricePerPx
  const vfxCost = VFX_PRICES[vfx] || 0
  const subtotal = pixelCost + vfxCost
  const charityAmount = subtotal * CHARITY_SPLIT

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1024 * 1024) { alert('Max 1MB image'); return }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleCheckout = async () => {
    if (!url || !title || !agreed) return
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pixels: totalPixels,
          totalPrice: pixelCost,
          category,
          title,
          url,
          vfx: vfx !== 'none' ? vfx : undefined,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Payment error. Please try again.')
        setLoading(false)
      }
    } catch {
      alert('Connection error. Please try again.')
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: '#111', border: '1px solid #222',
    color: '#fff', borderRadius: '8px', outline: 'none',
    fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid rgba(255,51,102,0.3)', boxShadow: '0 0 60px rgba(255,51,102,0.15)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #111' }}>
          <div>
            <h2 className="font-black text-white text-lg uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.15em' }}>Buy Pixels</h2>
            <p className="text-xs mt-0.5" style={{ color: '#555', fontFamily: "'Space Grotesk', sans-serif" }}>
              {selectedArea ? `Selected: ${area.w}×${area.h} at (${area.x}, ${area.y})` : 'No area selected — using 10×10 default'}
              {golden && <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: 'rgba(234,179,8,0.2)', color: '#eab308' }}>✦ GOLDEN ZONE</span>}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: '#555' }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* Price summary */}
          <div className="rounded-xl p-4 space-y-2" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
            <div className="flex justify-between text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <span style={{ color: '#666' }}>{totalPixels.toLocaleString()} pixels × ${pricePerPx}</span>
              <span style={{ color: '#aaa' }}>${pixelCost.toFixed(2)}</span>
            </div>
            {vfxCost > 0 && (
              <div className="flex justify-between text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span style={{ color: '#666' }}>VFX Effect ({vfx.replace('_', ' ')})</span>
                <span style={{ color: '#aaa' }}>${vfxCost}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold" style={{ borderColor: '#222', fontFamily: "'Space Grotesk', sans-serif" }}>
              <span style={{ color: '#fff' }}>Total (+ tax at checkout)</span>
              <span style={{ color: '#ff3366' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#00d4ff', fontFamily: "'Space Grotesk', sans-serif" }}>
              <Heart className="w-3 h-3" style={{ fill: '#ff3366', color: '#ff3366' }} />
              <span>${charityAmount.toFixed(2)} goes to charity (50%)</span>
            </div>
          </div>

          {/* Upload image */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#666', fontFamily: "'Space Grotesk', sans-serif" }}>
              <Upload className="inline w-3 h-3 mr-1" />Icon / Image
            </label>
            <div
              className="flex items-center justify-center rounded-xl cursor-pointer transition-all"
              style={{ height: '80px', border: '2px dashed #222', background: imagePreview ? 'transparent' : '#0d0d0d' }}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#ff3366' }}
              onDragLeave={e => { e.currentTarget.style.borderColor = '#222' }}
              onDrop={e => {
                e.preventDefault()
                e.currentTarget.style.borderColor = '#222'
                const file = e.dataTransfer.files[0]
                if (file) { setImageFile(file); const r = new FileReader(); r.onload = ev => setImagePreview(ev.target?.result as string); r.readAsDataURL(file) }
              }}
            >
              {imagePreview
                ? <img src={imagePreview} alt="preview" className="h-16 w-16 object-contain rounded" />
                : <span className="text-xs" style={{ color: '#444', fontFamily: "'Space Grotesk', sans-serif" }}>Click or drop image (max 1MB)</span>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#666', fontFamily: "'Space Grotesk', sans-serif" }}>
              <Link className="inline w-3 h-3 mr-1" />Destination URL *
            </label>
            <input
              style={inputStyle}
              type="url"
              placeholder="https://yourbusiness.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onFocus={e => (e.target.style.borderColor = '#ff3366')}
              onBlur={e => (e.target.style.borderColor = '#222')}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#666', fontFamily: "'Space Grotesk', sans-serif" }}>
              Display Name *
            </label>
            <input
              style={inputStyle}
              type="text"
              placeholder="Your Brand / Name"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={50}
              onFocus={e => (e.target.style.borderColor = '#ff3366')}
              onBlur={e => (e.target.style.borderColor = '#222')}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#666', fontFamily: "'Space Grotesk', sans-serif" }}>
              <Tag className="inline w-3 h-3 mr-1" />Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <button key={cat.id} onClick={() => setCategory(cat.id)} className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all" style={{ fontFamily: "'Space Grotesk', sans-serif", background: category === cat.id ? 'rgba(255,51,102,0.15)' : '#111', color: category === cat.id ? '#ff3366' : '#555', border: `1px solid ${category === cat.id ? 'rgba(255,51,102,0.4)' : '#1a1a1a'}` }}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* VFX */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#666', fontFamily: "'Space Grotesk', sans-serif" }}>
              <Sparkles className="inline w-3 h-3 mr-1" />Visual Effect (optional add-on)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {VFX_OPTIONS.map(v => (
                <button key={v.id} onClick={() => setVfx(v.id)} className="flex flex-col items-center py-2 px-1 rounded-lg transition-all" style={{ background: vfx === v.id ? 'rgba(0,212,255,0.1)' : '#111', border: `1px solid ${vfx === v.id ? 'rgba(0,212,255,0.5)' : '#1a1a1a'}` }}>
                  <span className="text-lg">{v.emoji}</span>
                  <span className="text-[10px] mt-0.5" style={{ color: vfx === v.id ? '#00d4ff' : '#555', fontFamily: "'Space Grotesk', sans-serif" }}>{v.label}</span>
                  <span className="text-[10px] font-bold" style={{ color: vfx === v.id ? '#00d4ff' : '#333', fontFamily: "'Space Grotesk', sans-serif" }}>{v.price === 0 ? 'Free' : `+$${v.price}`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 cursor-pointer"
              style={{ accentColor: '#ff3366' }}
            />
            <label htmlFor="terms" className="text-xs cursor-pointer" style={{ color: '#555', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.5 }}>
              I agree that pixels may be removed if content violates the{' '}
              <span style={{ color: '#ff3366' }}>Content Policy</span>. No resale without support approval. 50% of my payment funds community-voted charities.
            </label>
          </div>

          {/* Checkout button */}
          <button
            onClick={handleCheckout}
            disabled={!url || !title || !agreed || loading}
            className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: (!url || !title || !agreed) ? '#1a1a1a' : 'linear-gradient(135deg, #ff3366, #cc0044)',
              color: (!url || !title || !agreed) ? '#333' : '#fff',
              cursor: (!url || !title || !agreed) ? 'not-allowed' : 'pointer',
              boxShadow: (!url || !title || !agreed) ? 'none' : '0 0 30px rgba(255,51,102,0.4)',
              letterSpacing: '0.15em',
            }}
          >
            {loading ? 'Processing…' : `Pay $${subtotal.toFixed(2)} → Stripe`}
          </button>

          <p className="text-center text-xs" style={{ color: '#333', fontFamily: "'Space Grotesk', sans-serif" }}>
            Apple Pay · Google Pay · Card · Local tax added at checkout
          </p>
        </div>
      </div>
    </div>
  )
}
