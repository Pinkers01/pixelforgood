import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Payment Cancelled — PixelForGood' }

export default function CancelPage() {
  return (
    <div style={{ background: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ textAlign: 'center', maxWidth: '480px', padding: '40px 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>↩️</div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Payment cancelled</h1>
        <p style={{ color: '#555', fontSize: '15px', marginBottom: '32px' }}>No worries — your pixels are still waiting for you.</p>
        <Link
          href="/"
          style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '12px', background: '#111', border: '1px solid #222', color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}
        >
          Back to Canvas
        </Link>
      </div>
    </div>
  )
}
