'use client'

interface LogoProps {
  size?: number
  showText?: boolean
}

// Pixel heart mascot — 16×13 grid
// 1=red heart  2=dark outline  3=eye white  4=pupil  5=pink cheek  6=mouth
const MASK = [
  [0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0],
  [0,0,2,1,1,2,0,0,2,1,1,2,0,0,0,0],
  [0,2,1,1,1,1,2,2,1,1,1,1,2,0,0,0],
  [2,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0],
  [2,1,1,3,4,1,1,1,3,4,1,1,1,2,0,0],
  [2,1,1,3,1,1,1,1,3,1,1,1,1,2,0,0],
  [2,1,1,1,5,1,1,1,1,5,1,1,1,2,0,0],
  [0,2,1,1,1,6,1,1,6,1,1,1,2,0,0,0],
  [0,0,2,1,1,1,6,6,1,1,1,2,0,0,0,0],
  [0,0,0,2,1,1,1,1,1,1,2,0,0,0,0,0],
  [0,0,0,0,2,1,1,1,1,2,0,0,0,0,0,0],
  [0,0,0,0,0,2,1,1,2,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0],
]

const COLOR: Record<number, string> = {
  1: '#ff3366',
  2: '#1a0010',
  3: '#ffffff',
  4: '#1a0010',
  5: '#ff6b99',
  6: '#aa0033',
}

export default function Logo({ size = 44, showText = true }: LogoProps) {
  const cols = MASK[0].length
  const rows = MASK.length
  const px = size / Math.max(cols, rows)

  return (
    <div className="flex items-center gap-3 select-none">
      <svg
        width={Math.round(cols * px)}
        height={Math.round(rows * px)}
        viewBox={`0 0 ${cols} ${rows}`}
        style={{ imageRendering: 'pixelated', flexShrink: 0 }}
      >
        {MASK.map((row, y) =>
          row.map((cell, x) =>
            cell !== 0 ? (
              <rect
                key={`${x}-${y}`}
                x={x} y={y} width={1} height={1}
                fill={COLOR[cell]}
              />
            ) : null
          )
        )}
      </svg>

      {showText && (
        <div className="flex flex-col gap-1 leading-none">
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '11px',
              color: '#ffffff',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            PIXEL<span style={{ color: '#ff3366' }}>FOR</span>GOOD
          </span>
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '6px',
              color: '#00d4ff',
              letterSpacing: '0.06em',
              lineHeight: 1,
            }}
          >
            BUY A PIXEL · FUND THE FUTURE
          </span>
        </div>
      )}
    </div>
  )
}
