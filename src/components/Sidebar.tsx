'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, TrendingUp, Clock, Heart } from 'lucide-react'
import { MOCK_RECENT } from '@/lib/mock-data'

const CAT_COLORS: Record<string, string> = {
  tech: '#00d4ff', gaming: '#a855f7', crypto: '#eab308',
  art: '#e879f9', food: '#22c55e', business: '#f59e0b',
  sports: '#3b82f6', fashion: '#f97316', entertainment: '#ec4899',
}

const TOP_CHARITIES = [
  { name: 'Red Cross',         votes: 4821, pct: 38 },
  { name: 'Doctors w/o Borders', votes: 3104, pct: 24 },
  { name: 'Ocean Cleanup',     votes: 2890, pct: 22 },
  { name: 'Local Food Banks',  votes: 2103, pct: 16 },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="flex items-center justify-center w-7 h-full transition-all"
        style={{ background: '#080808', borderLeft: '1px solid #111', color: '#444' }}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    )
  }

  return (
    <aside className="w-64 shrink-0 flex flex-col overflow-y-auto" style={{ background: '#080808', borderLeft: '1px solid #111', fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* Collapse btn */}
      <button
        onClick={() => setCollapsed(true)}
        className="flex items-center justify-end px-3 py-2 transition-colors"
        style={{ color: '#333', borderBottom: '1px solid #111' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = '#333')}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Recent purchases */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-3.5 h-3.5" style={{ color: '#ff3366' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#666', letterSpacing: '0.1em' }}>Recent Purchases</span>
          <span className="w-2 h-2 rounded-full animate-pulse ml-auto" style={{ background: '#ff3366' }} />
        </div>
        <div className="space-y-2">
          {MOCK_RECENT.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg" style={{ background: '#0d0d0d' }}>
              <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: CAT_COLORS[item.category] || '#ff3366' }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: '#ccc' }}>{item.title}</div>
                <div className="text-[10px]" style={{ color: '#444' }}>{item.pixels}px · {item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #111' }} />

      {/* Charity milestone tracker */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-3.5 h-3.5" style={{ color: '#ff3366', fill: '#ff3366' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#666', letterSpacing: '0.1em' }}>Charity Fund</span>
        </div>
        <p className="text-[10px] mb-3 leading-relaxed" style={{ color: '#444' }}>
          50% of every pixel goes to charity — distributed when we hit a milestone, chosen by the community.
        </p>

        {/* Milestones */}
        {[
          { label: '$100k', target: 100_000, vote: true },
          { label: '$200k', target: 200_000 },
          { label: '$300k', target: 300_000 },
          { label: '$500k', target: 500_000 },
          { label: '$1M',   target: 1_000_000 },
        ].map(({ label, target, vote }, i) => {
          // Mock: charity pool is ~$173k (50% of $347k sold)
          const charityPool = 173_914
          const reached = charityPool >= target
          const current = reached ? 100 : Math.round((charityPool / target) * 100)
          return (
            <div key={i} className="mb-2.5">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold" style={{ color: reached ? '#ff3366' : '#444' }}>{label}</span>
                  {vote && reached && (
                    <span className="text-[9px] px-1 rounded" style={{ background: 'rgba(255,51,102,0.15)', color: '#ff3366' }}>VOTE OPEN</span>
                  )}
                </div>
                <span className="text-[10px]" style={{ color: reached ? '#ff3366' : '#333' }}>
                  {reached ? '✓ reached' : `${current}%`}
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: '#111' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, current)}%`,
                    background: reached ? 'linear-gradient(90deg,#ff3366,#cc0044)' : '#1f1f1f',
                    transition: 'width 1s ease',
                  }}
                />
              </div>
            </div>
          )
        })}

        <div className="mt-3 p-2.5 rounded-lg text-[10px] leading-relaxed" style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', color: '#555' }}>
          🗳️ First vote unlocks at <span style={{ color: '#ff3366' }}>$100k raised</span> — community decides the payout schedule.
        </div>
      </div>

      <div style={{ borderTop: '1px solid #111' }} />

      {/* Top advertisers */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-3.5 h-3.5" style={{ color: '#00d4ff' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#666', letterSpacing: '0.1em' }}>Top Advertisers</span>
        </div>
        <div className="space-y-1.5">
          {['GitHub', 'Steam', 'Coinbase', 'Vercel', 'Twitch'].map((name, i) => (
            <div key={i} className="flex items-center gap-2 text-xs" style={{ color: '#555' }}>
              <span style={{ color: '#333', width: '16px', textAlign: 'right' }}>#{i + 1}</span>
              <span style={{ color: i === 0 ? '#00d4ff' : '#555' }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
