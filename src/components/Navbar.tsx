'use client'

import { useState } from 'react'
import { Search, Menu, X } from 'lucide-react'
import Link from 'next/link'
import Logo from './Logo'
import { CATEGORIES } from '@/lib/constants'
import { Category } from '@/types'

interface NavbarProps {
  activeCategory: Category
  onCategoryChange: (cat: Category) => void
  onBuyClick: () => void
  searchQuery: string
  onSearchChange: (q: string) => void
  pixelsSold: number
  revenue: number
}

export default function Navbar({
  activeCategory, onCategoryChange, onBuyClick,
  searchQuery, onSearchChange, pixelsSold, revenue
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [adultConfirmed, setAdultConfirmed] = useState(false)

  const handleCategoryClick = (cat: Category, restricted?: boolean) => {
    if (restricted && !adultConfirmed) {
      const ok = window.confirm('This section contains adult content (18+). Do you confirm you are 18 or older?')
      if (!ok) return
      setAdultConfirmed(true)
    }
    onCategoryChange(cat)
  }

  const pct = Math.round((pixelsSold / 1_000_000) * 100)

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,51,102,0.2)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-6 h-14 gap-3">
        <Logo />

        {/* Search */}
        <div className="relative hidden md:flex flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#666' }} />
          <input
            type="text"
            placeholder="Search advertisers..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-all"
            style={{ background: '#111', border: '1px solid #222', color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}
            onFocus={e => e.target.style.borderColor = '#ff3366'}
            onBlur={e => e.target.style.borderColor = '#222'}
          />
        </div>

        {/* Stats pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: '#111', border: '1px solid #222', fontFamily: "'Space Grotesk', sans-serif" }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#ff3366' }}></span>
          <span style={{ color: '#aaa' }}>{pixelsSold.toLocaleString()} sold</span>
          <span style={{ color: '#333' }}>·</span>
          <span style={{ color: '#00d4ff' }}>${revenue.toLocaleString()} raised</span>
        </div>

        {/* Buy button */}
        <Link
          href="/about"
          className="hidden md:block text-xs font-semibold transition-colors hover:text-white"
          style={{ color: '#555', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.05em', textDecoration: 'none' }}
        >
          About
        </Link>

        <button
          onClick={onBuyClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #ff3366, #cc0044)',
            color: '#fff',
            fontFamily: "'Space Grotesk', sans-serif",
            boxShadow: '0 0 20px rgba(255,51,102,0.4)',
            letterSpacing: '0.1em'
          }}
        >
          <span>Buy Pixels</span>
        </button>

        <button className="md:hidden p-1" onClick={() => setMobileOpen(!mobileOpen)} style={{ color: '#fff' }}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full" style={{ background: '#111' }}>
        <div
          className="h-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #ff3366, #00d4ff)' }}
        />
      </div>

      {/* Category tabs */}
      <div className="hidden md:flex items-center gap-1 px-4 overflow-x-auto py-1.5 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id as Category, cat.restricted)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all hover:scale-105"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: activeCategory === cat.id ? 'rgba(255,51,102,0.15)' : 'transparent',
              color: activeCategory === cat.id ? '#ff3366' : '#666',
              border: activeCategory === cat.id ? '1px solid rgba(255,51,102,0.4)' : '1px solid transparent',
              letterSpacing: '0.05em'
            }}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
            {cat.restricted && <span className="text-[10px] px-1 rounded" style={{ background: '#ff3366', color: '#fff' }}>18+</span>}
          </button>
        ))}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4" style={{ background: '#050505' }}>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#666' }} />
            <input
              type="text"
              placeholder="Search advertisers..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none"
              style={{ background: '#111', border: '1px solid #222', color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { handleCategoryClick(cat.id as Category, cat.restricted); setMobileOpen(false) }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: activeCategory === cat.id ? 'rgba(255,51,102,0.15)' : '#111',
                  color: activeCategory === cat.id ? '#ff3366' : '#888',
                  border: `1px solid ${activeCategory === cat.id ? 'rgba(255,51,102,0.4)' : '#222'}`,
                }}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
