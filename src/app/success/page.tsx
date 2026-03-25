import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Payment Successful — PixelForGood' }

export default function SuccessPage() {
  return (
    <div style={{ background: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ textAlign: 'center', maxWidth: '480px', padding: '40px 24px' }}>

        {/* Pixel heart */}
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>

        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px', color: '#ff3366', letterSpacing: '0.1em', marginBottom: '16px' }}>
          PAYMENT SUCCESSFUL
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '16px', lineHeight: 1.2 }}>
          Your pixels are live!
        </h1>

        <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.7, marginBottom: '12px' }}>
          Welcome to PixelForGood. Your advertising space is now active on the canvas.
        </p>

        <p style={{ color: '#ff3366', fontSize: '15px', fontWeight: 700, marginBottom: '32px' }}>
          50% of your payment is already in the charity fund. Thank you.
        </p>

        <div style={{ padding: '20px', borderRadius: '16px', background: '#0a0a0a', border: '1px solid rgba(255,51,102,0.2)', marginBottom: '32px', fontSize: '14px', color: '#555', lineHeight: 1.6 }}>
          You will receive a confirmation email shortly. Once the canvas database is live, your pixels will appear automatically.
        </div>

        <Link
          href="/"
          style={{ display: 'inline-block', padding: '14px 36px', borderRadius: '12px', background: 'linear-gradient(135deg, #ff3366, #cc0044)', color: '#fff', fontWeight: 800, fontSize: '15px', textDecoration: 'none', letterSpacing: '0.05em', boxShadow: '0 0 30px rgba(255,51,102,0.4)' }}
        >
          Back to Canvas →
        </Link>
      </div>
    </div>
  )
}
