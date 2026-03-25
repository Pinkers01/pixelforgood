'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { Pixel } from '@/types'
import { CANVAS_WIDTH, CANVAS_HEIGHT, GOLDEN_ZONE, PRICE_PER_PIXEL, PRICE_GOLDEN_PIXEL } from '@/lib/constants'

interface PixelCanvasProps {
  pixels: Pixel[]
  activeCategory: string
  searchQuery: string
  onPixelSelect: (selection: { x: number; y: number; w: number; h: number } | null) => void
  selectedArea: { x: number; y: number; w: number; h: number } | null
  onOpenBuy: () => void
}

const CAT_COLORS: Record<string, string> = {
  tech: '#00d4ff', business: '#f59e0b', gaming: '#a855f7',
  entertainment: '#ec4899', fashion: '#f97316', food: '#22c55e',
  crypto: '#eab308', sports: '#3b82f6', art: '#e879f9',
  adult: '#ff6b6b', default: '#ff3366',
}

function isGolden(x: number, y: number) {
  return x >= GOLDEN_ZONE.x && x < GOLDEN_ZONE.x + GOLDEN_ZONE.w &&
         y >= GOLDEN_ZONE.y && y < GOLDEN_ZONE.y + GOLDEN_ZONE.h
}

interface PixelInfo {
  x: number; y: number
  screenX: number; screenY: number
  status: 'available' | 'sold'
  pixel?: Pixel
  isGolden: boolean
  price: number
}

export default function PixelCanvas({
  pixels, activeCategory, searchQuery,
  onPixelSelect, selectedArea, onOpenBuy
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [tooltip, setTooltip] = useState<{ x: number; y: number; pixel: Pixel } | null>(null)
  const [pixelInfo, setPixelInfo] = useState<PixelInfo | null>(null)
  const [multiSelectMode, setMultiSelectMode] = useState(false)
  const [multiSelected, setMultiSelected] = useState<Set<string>>(new Set())

  const isDragging = useRef(false)
  const hasDragged = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const animFrame = useRef(0)
  const tick = useRef(0)

  const MIN_ZOOM = 0.4
  const MAX_ZOOM = 50

  const screenToGrid = useCallback((sx: number, sy: number, rect: DOMRect) => {
    const cx = (sx - rect.left - pan.x) / zoom
    const cy = (sy - rect.top - pan.y) / zoom
    return {
      px: Math.floor(Math.max(0, Math.min(CANVAS_WIDTH - 1, cx))),
      py: Math.floor(Math.max(0, Math.min(CANVAS_HEIGHT - 1, cy))),
    }
  }, [pan, zoom])

  const getSoldPixel = useCallback((gx: number, gy: number) => {
    return pixels.find(p =>
      p.status === 'sold' &&
      gx >= p.x && gx < p.x + p.w &&
      gy >= p.y && gy < p.y + p.h
    )
  }, [pixels])

  // ─── DRAW ────────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = container.offsetWidth
    const H = container.offsetHeight
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H }

    ctx.clearRect(0, 0, W, H)
    ctx.save()
    ctx.translate(pan.x, pan.y)
    ctx.scale(zoom, zoom)

    // Background
    ctx.fillStyle = '#050505'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // ── PIXEL GRID ─────────────────────────────────────────────────────────────
    // Show grid when each pixel is at least 4 screen px wide
    if (zoom >= 4) {
      // Individual pixel grid (1px)
      ctx.strokeStyle = zoom >= 8 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 0.5 / zoom
      for (let x = 0; x <= CANVAS_WIDTH; x++) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT); ctx.stroke()
      }
      for (let y = 0; y <= CANVAS_HEIGHT; y++) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y); ctx.stroke()
      }
    }

    // 10×10 block grid (always visible when zoomed)
    if (zoom >= 1.5) {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = 1 / zoom
      for (let x = 0; x <= CANVAS_WIDTH; x += 10) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT); ctx.stroke()
      }
      for (let y = 0; y <= CANVAS_HEIGHT; y += 10) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y); ctx.stroke()
      }
    }

    // 100×100 block grid
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.lineWidth = 1.5 / zoom
    for (let x = 0; x <= CANVAS_WIDTH; x += 100) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT); ctx.stroke()
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += 100) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_HEIGHT, y); ctx.stroke()
    }

    // ── GOLDEN ZONE ─────────────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(234,179,8,0.07)'
    ctx.fillRect(GOLDEN_ZONE.x, GOLDEN_ZONE.y, GOLDEN_ZONE.w, GOLDEN_ZONE.h)
    const gz_pulse = 0.3 + 0.15 * Math.sin(tick.current * 0.03)
    ctx.strokeStyle = `rgba(234,179,8,${gz_pulse + 0.2})`
    ctx.lineWidth = 1.5 / zoom
    ctx.strokeRect(GOLDEN_ZONE.x, GOLDEN_ZONE.y, GOLDEN_ZONE.w, GOLDEN_ZONE.h)
    if (zoom >= 1) {
      ctx.fillStyle = `rgba(234,179,8,${gz_pulse + 0.3})`
      ctx.font = `bold ${10 / zoom}px 'Space Grotesk', sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('✦ GOLDEN ZONE · $10/px', GOLDEN_ZONE.x + GOLDEN_ZONE.w / 2, GOLDEN_ZONE.y - 5 / zoom)
    }

    // ── SOLD PIXELS ─────────────────────────────────────────────────────────────
    for (const pixel of pixels) {
      if (pixel.status !== 'sold') continue
      const catMatch = activeCategory === 'all' || pixel.category === activeCategory
      const searchMatch = !searchQuery || pixel.title?.toLowerCase().includes(searchQuery.toLowerCase())
      const visible = catMatch && searchMatch
      const color = CAT_COLORS[pixel.category || 'default'] || CAT_COLORS.default
      const alpha = visible ? 1 : 0.15

      ctx.globalAlpha = alpha

      if (pixel.vfx === 'neon_pulse') {
        const a = 0.5 + 0.5 * Math.sin(tick.current * 0.05 + pixel.x * 0.1)
        ctx.shadowColor = color; ctx.shadowBlur = 8 / zoom * a
      } else if (pixel.vfx === 'fire') {
        ctx.shadowColor = '#ff6600'; ctx.shadowBlur = 10 / zoom * (0.7 + 0.3 * Math.sin(tick.current * 0.1))
      } else if (pixel.vfx === 'diamond_shine') {
        ctx.globalAlpha = alpha * (0.6 + 0.4 * Math.abs(Math.sin(tick.current * 0.03)))
      }

      if (pixel.vfx === 'rainbow_wave') {
        const hue = (tick.current * 2 + pixel.x + pixel.y) % 360
        ctx.fillStyle = `hsl(${hue}, 100%, 60%)`
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`; ctx.shadowBlur = 4 / zoom
      } else if (pixel.vfx === 'cyber_glitch' && Math.random() < 0.015) {
        ctx.fillStyle = '#fff'
        ctx.fillRect(pixel.x + Math.random() * pixel.w * 0.5, pixel.y, pixel.w * 0.3, pixel.h)
        ctx.fillStyle = color
      } else {
        ctx.fillStyle = color
      }

      ctx.fillRect(pixel.x, pixel.y, pixel.w, pixel.h)
      ctx.shadowBlur = 0; ctx.globalAlpha = 1

      // Pixel icon placeholder (at high zoom show label)
      if (zoom >= 12 && pixel.title) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(pixel.x, pixel.y, pixel.w, pixel.h)
        ctx.fillStyle = '#fff'
        ctx.font = `${Math.min(pixel.w, pixel.h) * 0.4}px 'Space Grotesk', sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(pixel.title.substring(0, 3).toUpperCase(), pixel.x + pixel.w / 2, pixel.y + pixel.h * 0.65)
      }
    }

    // ── MULTI-SELECT PIXELS ──────────────────────────────────────────────────────
    if (multiSelected.size > 0) {
      ctx.fillStyle = 'rgba(0,212,255,0.35)'
      ctx.strokeStyle = '#00d4ff'
      ctx.lineWidth = 0.5 / zoom
      for (const key of multiSelected) {
        const [mx, my] = key.split(',').map(Number)
        ctx.fillRect(mx, my, 1, 1)
        ctx.strokeRect(mx, my, 1, 1)
      }
    }

    // ── DRAG SELECTION ──────────────────────────────────────────────────────────
    if (selectedArea && !multiSelectMode) {
      ctx.fillStyle = 'rgba(0,212,255,0.15)'
      ctx.fillRect(selectedArea.x, selectedArea.y, selectedArea.w, selectedArea.h)
      ctx.strokeStyle = '#00d4ff'
      ctx.lineWidth = 2 / zoom
      ctx.strokeRect(selectedArea.x, selectedArea.y, selectedArea.w, selectedArea.h)
      const hs = 4 / zoom
      [[selectedArea.x, selectedArea.y],[selectedArea.x+selectedArea.w-hs, selectedArea.y],
       [selectedArea.x, selectedArea.y+selectedArea.h-hs],[selectedArea.x+selectedArea.w-hs, selectedArea.y+selectedArea.h-hs]]
        .forEach(([cx,cy]) => { ctx.fillStyle='#00d4ff'; ctx.fillRect(cx,cy,hs,hs) })
    }

    // ── PIXEL INFO HIGHLIGHT ─────────────────────────────────────────────────────
    if (pixelInfo && zoom >= 6) {
      const { x, y } = pixelInfo
      ctx.strokeStyle = pixelInfo.status === 'available' ? '#00d4ff' : '#ff3366'
      ctx.lineWidth = 2 / zoom
      ctx.strokeRect(x - 0.1, y - 0.1, 1.2, 1.2)
      ctx.fillStyle = pixelInfo.status === 'available' ? 'rgba(0,212,255,0.25)' : 'rgba(255,51,102,0.25)'
      ctx.fillRect(x, y, 1, 1)
    }

    // ── COORDINATE LABELS ────────────────────────────────────────────────────────
    if (zoom >= 20) {
      // Show x coords on top
      ctx.fillStyle = 'rgba(100,100,100,0.6)'
      ctx.font = `${6 / zoom}px monospace`
      ctx.textAlign = 'center'
      const startX = Math.floor(Math.max(0, -pan.x / zoom))
      const endX = Math.min(CANVAS_WIDTH, startX + Math.ceil(containerRef.current!.offsetWidth / zoom) + 1)
      for (let x = startX; x < endX; x++) {
        ctx.fillText(String(x), x + 0.5, -1 / zoom)
      }
    }

    // ── BORDER ──────────────────────────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(255,51,102,0.4)'
    ctx.lineWidth = 2 / zoom
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.restore()
    tick.current++
    animFrame.current = requestAnimationFrame(draw)
  }, [pixels, activeCategory, searchQuery, zoom, pan, selectedArea, pixelInfo, multiSelected, multiSelectMode])

  useEffect(() => {
    animFrame.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animFrame.current)
  }, [draw])

  // ─── WHEEL ZOOM ────────────────────────────────────────────────────────────
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const delta = e.deltaY > 0 ? 0.85 : 1.18
    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * delta))
    const scale = newZoom / zoom
    setPan(p => ({ x: mx - (mx - p.x) * scale, y: my - (my - p.y) * scale }))
    setZoom(newZoom)
  }, [zoom])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // ─── MOUSE ─────────────────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    isDragging.current = true
    hasDragged.current = false
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()

    if (isDragging.current) {
      const dx = Math.abs(e.clientX - (dragStart.current.x + pan.x))
      const dy = Math.abs(e.clientY - (dragStart.current.y + pan.y))
      if (dx > 3 || dy > 3) {
        hasDragged.current = true
        setPixelInfo(null)
      }
      if (hasDragged.current) {
        setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
        return
      }
    }

    // Hover tooltip on sold pixels (only within grid bounds)
    const rawCx = (e.clientX - rect.left - pan.x) / zoom
    const rawCy = (e.clientY - rect.top - pan.y) / zoom
    if (rawCx < 0 || rawCx >= CANVAS_WIDTH || rawCy < 0 || rawCy >= CANVAS_HEIGHT) {
      setTooltip(null)
      return
    }
    const g = screenToGrid(e.clientX, e.clientY, rect)
    const found = getSoldPixel(g.px, g.py)
    if (found && zoom >= 1.5) {
      setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, pixel: found })
    } else {
      setTooltip(null)
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    isDragging.current = false

    if (hasDragged.current) { hasDragged.current = false; return }

    // CLICK (no drag)
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()

    // Ignore clicks outside the pixel grid
    const rawCx = (e.clientX - rect.left - pan.x) / zoom
    const rawCy = (e.clientY - rect.top - pan.y) / zoom
    if (rawCx < 0 || rawCx >= CANVAS_WIDTH || rawCy < 0 || rawCy >= CANVAS_HEIGHT) {
      setPixelInfo(null)
      return
    }

    const g = screenToGrid(e.clientX, e.clientY, rect)

    if (multiSelectMode) {
      // Toggle individual pixel in/out of multi-select set
      const key = `${g.px},${g.py}`
      setMultiSelected(prev => {
        const next = new Set(prev)
        if (next.has(key)) next.delete(key)
        else next.add(key)
        return next
      })
      return
    }

    // Single pixel info panel
    const sold = getSoldPixel(g.px, g.py)
    const golden = isGolden(g.px, g.py)
    setPixelInfo({
      x: g.px, y: g.py,
      screenX: e.clientX - rect.left,
      screenY: e.clientY - rect.top,
      status: sold ? 'sold' : 'available',
      pixel: sold,
      isGolden: golden,
      price: golden ? PRICE_GOLDEN_PIXEL : PRICE_PER_PIXEL,
    })
  }

  const handleZoomBtn = (direction: 'in' | 'out') => {
    const container = containerRef.current
    if (!container) return
    const cx = container.offsetWidth / 2
    const cy = container.offsetHeight / 2
    const delta = direction === 'in' ? 1.5 : 0.67
    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * delta))
    const scale = newZoom / zoom
    setPan(p => ({ x: cx - (cx - p.x) * scale, y: cy - (cy - p.y) * scale }))
    setZoom(newZoom)
  }

  const handleReset = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const scale = Math.min(container.offsetWidth / CANVAS_WIDTH, container.offsetHeight / CANVAS_HEIGHT) * 0.92
    setZoom(scale)
    setPan({
      x: (container.offsetWidth - CANVAS_WIDTH * scale) / 2,
      y: (container.offsetHeight - CANVAS_HEIGHT * scale) / 2,
    })
  }, [])

  useEffect(() => { setTimeout(handleReset, 100) }, [handleReset])

  // Sync multi-select to parent as bounding box
  useEffect(() => {
    if (multiSelected.size === 0) { onPixelSelect(null); return }
    const coords = [...multiSelected].map(k => { const [x,y] = k.split(',').map(Number); return {x,y} })
    const minX = Math.min(...coords.map(c=>c.x))
    const minY = Math.min(...coords.map(c=>c.y))
    const maxX = Math.max(...coords.map(c=>c.x))
    const maxY = Math.max(...coords.map(c=>c.y))
    onPixelSelect({ x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 })
  }, [multiSelected, onPixelSelect])

  const multiTotal = multiSelected.size
  const multiPrice = [...multiSelected].reduce((sum, key) => {
    const [x, y] = key.split(',').map(Number)
    return sum + (isGolden(x, y) ? PRICE_GOLDEN_PIXEL : PRICE_PER_PIXEL)
  }, 0)

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 138px)', minHeight: '500px' }}>

      {/* Multi-select toolbar */}
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-full"
        style={{ background: 'rgba(5,5,5,0.9)', border: `1px solid ${multiSelectMode ? 'rgba(0,212,255,0.6)' : '#1a1a1a'}`, backdropFilter: 'blur(10px)', fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold">
          <input
            type="checkbox"
            checked={multiSelectMode}
            onChange={e => { setMultiSelectMode(e.target.checked); if (!e.target.checked) setMultiSelected(new Set()) }}
            className="w-4 h-4 rounded cursor-pointer"
            style={{ accentColor: '#00d4ff' }}
          />
          <span style={{ color: multiSelectMode ? '#00d4ff' : '#555' }}>
            {multiSelectMode ? '🖱️ Click pixels to add/remove' : 'Select pixels one by one'}
          </span>
        </label>

        {multiSelectMode && multiTotal > 0 && (
          <>
            <div className="w-px h-4" style={{ background: '#222' }} />
            <span className="text-xs font-bold" style={{ color: '#00d4ff' }}>{multiTotal} px selected</span>
            <span className="text-xs font-black" style={{ color: '#ff3366' }}>${multiPrice.toFixed(0)}</span>
            <button
              onClick={onOpenBuy}
              className="px-3 py-1 rounded-full text-xs font-black uppercase"
              style={{ background: 'linear-gradient(135deg,#ff3366,#cc0044)', color: '#fff', letterSpacing: '0.08em' }}
            >
              Buy →
            </button>
            <button onClick={() => setMultiSelected(new Set())} className="text-xs" style={{ color: '#444' }}>Clear</button>
          </>
        )}

        {!multiSelectMode && (
          <span className="text-xs" style={{ color: '#333' }}>Scroll to zoom · Drag to pan</span>
        )}
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ cursor: hasDragged.current ? 'grabbing' : multiSelectMode ? 'cell' : 'crosshair', background: '#050505', overflow: 'hidden' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { isDragging.current = false; setTooltip(null) }}
      >
        <canvas ref={canvasRef} className="block" />
      </div>

      {/* Hover tooltip */}
      {tooltip && !pixelInfo && (
        <div
          className="absolute pointer-events-none px-3 py-2 rounded-lg text-xs z-20"
          style={{
            left: Math.min(tooltip.x + 14, (containerRef.current?.offsetWidth ?? 800) - 200),
            top: Math.max(tooltip.y - 50, 8),
            background: 'rgba(5,5,5,0.95)',
            border: '1px solid rgba(255,51,102,0.4)',
            fontFamily: "'Space Grotesk', sans-serif",
            boxShadow: '0 4px 20px rgba(255,51,102,0.2)',
            maxWidth: '180px',
          }}
        >
          <div className="font-bold" style={{ color: '#ff3366' }}>{tooltip.pixel.title}</div>
          <div className="truncate" style={{ color: '#666' }}>{tooltip.pixel.url}</div>
          <div className="mt-1 text-[10px]" style={{ color: '#444' }}>{tooltip.pixel.w * tooltip.pixel.h}px · click for details</div>
        </div>
      )}

      {/* Pixel info panel (click) */}
      {pixelInfo && (
        <div
          className="absolute z-30 rounded-2xl overflow-hidden"
          style={{
            left: Math.min(pixelInfo.screenX + 16, (containerRef.current?.offsetWidth ?? 800) - 260),
            top: Math.max(pixelInfo.screenY - 20, 8),
            width: '240px',
            background: 'rgba(8,8,8,0.98)',
            border: `1px solid ${pixelInfo.status === 'available' ? 'rgba(0,212,255,0.5)' : 'rgba(255,51,102,0.5)'}`,
            boxShadow: `0 8px 40px ${pixelInfo.status === 'available' ? 'rgba(0,212,255,0.15)' : 'rgba(255,51,102,0.15)'}`,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #111' }}>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#444', letterSpacing: '0.1em' }}>
                Pixel ({pixelInfo.x}, {pixelInfo.y})
              </div>
              <div className="font-black text-sm mt-0.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: pixelInfo.status === 'available' ? '#00d4ff' : '#ff3366' }} />
                <span style={{ color: pixelInfo.status === 'available' ? '#00d4ff' : '#ff3366' }}>
                  {pixelInfo.status === 'available' ? 'Available' : 'Sold'}
                </span>
                {pixelInfo.isGolden && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(234,179,8,0.2)', color: '#eab308' }}>✦ GOLDEN</span>
                )}
              </div>
            </div>
            <button onClick={() => setPixelInfo(null)} className="text-sm" style={{ color: '#333' }}>✕</button>
          </div>

          <div className="p-4 space-y-3">
            {pixelInfo.status === 'sold' && pixelInfo.pixel ? (
              <>
                <div>
                  <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#444' }}>Owner</div>
                  <div className="font-bold text-sm" style={{ color: '#fff' }}>{pixelInfo.pixel.title}</div>
                  <a href={pixelInfo.pixel.url || '#'} target="_blank" rel="noopener" className="text-xs truncate block" style={{ color: '#00d4ff' }}>{pixelInfo.pixel.url}</a>
                </div>
                <div className="text-xs px-3 py-2 rounded-lg" style={{ background: '#111', color: '#555' }}>
                  This pixel is taken. Adjacent pixels may be available.
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div className="text-[10px] uppercase tracking-widest" style={{ color: '#444' }}>Price</div>
                  <div className="font-black" style={{ color: '#ff3366' }}>${pixelInfo.price}/px</div>
                </div>

                {/* Add more checkbox */}
                <div className="p-3 rounded-xl" style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 cursor-pointer"
                      style={{ accentColor: '#00d4ff' }}
                      checked={multiSelectMode}
                      onChange={e => {
                        setMultiSelectMode(e.target.checked)
                        if (e.target.checked) {
                          // Add current pixel to multi-select
                          setMultiSelected(new Set([`${pixelInfo.x},${pixelInfo.y}`]))
                          setPixelInfo(null)
                        }
                      }}
                    />
                    <div>
                      <div className="text-xs font-bold" style={{ color: '#fff' }}>Want to buy more pixels?</div>
                      <div className="text-[10px] mt-0.5" style={{ color: '#555' }}>Check this to keep clicking pixels and add them all to one order</div>
                    </div>
                  </label>
                </div>

                <button
                  onClick={() => { onPixelSelect({ x: pixelInfo.x, y: pixelInfo.y, w: 1, h: 1 }); onOpenBuy(); setPixelInfo(null) }}
                  className="w-full py-3 rounded-xl font-black uppercase text-sm transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #ff3366, #cc0044)',
                    color: '#fff',
                    letterSpacing: '0.1em',
                    boxShadow: '0 0 20px rgba(255,51,102,0.3)',
                  }}
                >
                  Buy this pixel — ${pixelInfo.price}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-10">
        <button onClick={() => handleZoomBtn('in')} className="w-9 h-9 rounded-lg font-bold text-lg flex items-center justify-center transition-all hover:scale-110" style={{ background: '#111', border: '1px solid #222', color: '#fff' }}>+</button>
        <button onClick={handleReset} className="w-9 h-9 rounded-lg text-base flex items-center justify-center transition-all hover:scale-110" style={{ background: '#111', border: '1px solid #222', color: '#666' }}>⊡</button>
        <button onClick={() => handleZoomBtn('out')} className="w-9 h-9 rounded-lg font-bold text-lg flex items-center justify-center transition-all hover:scale-110" style={{ background: '#111', border: '1px solid #222', color: '#fff' }}>−</button>
      </div>

      {/* Zoom level */}
      <div className="absolute bottom-4 left-4 px-2 py-1 rounded text-xs z-10" style={{ background: '#111', border: '1px solid #1a1a1a', color: '#444', fontFamily: "'Space Grotesk', sans-serif" }}>
        {zoom >= 4 ? `${Math.round(zoom)}×` : `${Math.round(zoom * 100)}%`}
        {zoom >= 4 && <span className="ml-1 text-[10px]" style={{ color: '#00d4ff' }}>grid on</span>}
      </div>
    </div>
  )
}
