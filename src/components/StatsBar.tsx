'use client'

import { useEffect, useState } from 'react'
import { Stats } from '@/types'

export default function StatsBar({ stats }: { stats: Stats }) {
  const [displayed, setDisplayed] = useState(stats)

  // Animate counter slowly incrementing
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayed(prev => ({
        ...prev,
        pixels_sold: prev.pixels_sold + Math.floor(Math.random() * 3),
        revenue: prev.revenue + Math.floor(Math.random() * 3),
        charity_pool: prev.charity_pool + Math.floor(Math.random() * 2),
      }))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const remaining = 1_000_000 - displayed.pixels_sold

  return (
    <div className="w-full px-4 py-3 flex flex-wrap items-center justify-center gap-6 text-sm" style={{ background: '#080808', borderTop: '1px solid #111', fontFamily: "'Space Grotesk', sans-serif" }}>
      <Stat
        icon="🔴"
        label="Pixels Sold"
        value={displayed.pixels_sold.toLocaleString()}
        live
      />
      <Stat icon="💰" label="Total Raised" value={`$${displayed.revenue.toLocaleString()}`} accent="#00d4ff" />
      <Stat icon="❤️" label="Charity Pool" value={`$${displayed.charity_pool.toLocaleString()}`} accent="#ff3366" />
      <Stat icon="🌍" label="Advertisers" value={displayed.advertisers.toLocaleString()} />
      <Stat icon="⬜" label="Pixels Left" value={remaining.toLocaleString()} accent="#555" />

      {/* Mini progress */}
      <div className="flex items-center gap-2">
        <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${(displayed.pixels_sold / 1_000_000) * 100}%`, background: 'linear-gradient(90deg, #ff3366, #00d4ff)' }}
          />
        </div>
        <span style={{ color: '#444', fontSize: '11px' }}>{((displayed.pixels_sold / 1_000_000) * 100).toFixed(2)}% full</span>
      </div>
    </div>
  )
}

function Stat({ icon, label, value, accent = '#aaa', live = false }: { icon: string; label: string; value: string; accent?: string; live?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {live && <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#ff3366', flexShrink: 0 }} />}
      <span>{icon}</span>
      <div className="flex flex-col leading-none">
        <span className="text-xs" style={{ color: '#444', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
        <span className="font-bold text-sm" style={{ color: accent }}>{value}</span>
      </div>
    </div>
  )
}
