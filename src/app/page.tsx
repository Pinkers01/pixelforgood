'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import PixelCanvas from '@/components/PixelCanvas'
import StatsBar from '@/components/StatsBar'
import BuyModal from '@/components/BuyModal'
import Sidebar from '@/components/Sidebar'
import { Category } from '@/types'
import { MOCK_PIXELS, MOCK_STATS } from '@/lib/mock-data'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [buyModalOpen, setBuyModalOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState<{ x: number; y: number; w: number; h: number } | null>(null)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onBuyClick={() => setBuyModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        pixelsSold={MOCK_STATS.pixels_sold}
        revenue={MOCK_STATS.revenue}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 overflow-hidden">
          <PixelCanvas
            pixels={MOCK_PIXELS}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            onPixelSelect={setSelectedArea}
            selectedArea={selectedArea}
            onOpenBuy={() => setBuyModalOpen(true)}
          />
        </main>
        <div className="hidden lg:flex">
          <Sidebar />
        </div>

        {/* Floating buy bar when pixels selected */}
        {selectedArea && (
          <div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-4 px-5 py-3 rounded-2xl z-20"
            style={{
              background: 'rgba(10,10,10,0.95)',
              border: '1px solid rgba(255,51,102,0.5)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 40px rgba(255,51,102,0.2)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <div>
              <div className="text-xs" style={{ color: '#555' }}>Selected</div>
              <div className="font-bold text-sm" style={{ color: '#fff' }}>
                {selectedArea.w}×{selectedArea.h} = {(selectedArea.w * selectedArea.h).toLocaleString()}px
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: '#555' }}>Price</div>
              <div className="font-black text-lg" style={{ color: '#ff3366' }}>
                ${selectedArea.w * selectedArea.h}
              </div>
            </div>
            <button
              onClick={() => setBuyModalOpen(true)}
              className="px-5 py-2 rounded-xl font-black uppercase text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #ff3366, #cc0044)', color: '#fff', letterSpacing: '0.1em', boxShadow: '0 0 20px rgba(255,51,102,0.5)' }}
            >
              Buy Now →
            </button>
            <button onClick={() => setSelectedArea(null)} className="text-xs" style={{ color: '#444' }}>✕</button>
          </div>
        )}
      </div>

      <StatsBar stats={MOCK_STATS} />

      <BuyModal
        open={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        selectedArea={selectedArea}
      />
    </div>
  )
}
