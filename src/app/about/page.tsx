import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About PixelForGood — Buy a Pixel. Fund the Future.',
  description: 'Learn how PixelForGood works: 1,000,000 pixels at $1/pixel, 50% of all revenue donated to community-voted charities.',
}

export default function AboutPage() {
  return (
    <div style={{ background: '#050505', minHeight: '100vh', fontFamily: "'Space Grotesk', sans-serif", color: '#fff' }}>

      {/* Nav */}
      <nav style={{ background: 'rgba(5,5,5,0.95)', borderBottom: '1px solid rgba(255,51,102,0.2)', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(20px)' }}>
        <Link href="/" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '11px', color: '#fff', textDecoration: 'none' }}>
          PIXEL<span style={{ color: '#ff3366' }}>FOR</span>GOOD
        </Link>
        <Link
          href="/"
          style={{ fontSize: '13px', color: '#666', textDecoration: 'none', fontWeight: 600 }}
        >
          ← Back to Canvas
        </Link>
      </nav>

      <main style={{ maxWidth: '840px', margin: '0 auto', padding: '64px 24px' }}>

        {/* Hero */}
        <section style={{ marginBottom: '80px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px', color: '#ff3366', letterSpacing: '0.1em', marginBottom: '16px' }}>
            ABOUT THE PROJECT
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, lineHeight: 1.15, marginBottom: '24px', letterSpacing: '-0.02em' }}>
            One canvas.<br />
            <span style={{ color: '#ff3366' }}>One million pixels.</span><br />
            Real impact.
          </h1>
          <p style={{ fontSize: '18px', color: '#888', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }}>
            PixelForGood is a digital billboard where every pixel you buy places your brand in front of the world —
            and sends 50% of your payment straight to charity, chosen by the community.
          </p>
        </section>

        {/* Origin story */}
        <section style={{ marginBottom: '72px' }}>
          <SectionLabel>THE STORY</SectionLabel>
          <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '20px' }}>
            Inspired by a legend
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <Card>
              <CardTitle>2005 — The Original</CardTitle>
              <p style={{ color: '#777', lineHeight: 1.7, fontSize: '15px' }}>
                Alex Tew, a 21-year-old student in England, created the <strong style={{ color: '#fff' }}>Million Dollar Homepage</strong>.
                He sold 1,000,000 pixels at $1 each to pay for university. It became a global phenomenon,
                selling out in just a few months and generating worldwide media coverage.
              </p>
            </Card>
            <Card>
              <CardTitle>2026 — PixelForGood</CardTitle>
              <p style={{ color: '#777', lineHeight: 1.7, fontSize: '15px' }}>
                We&apos;re bringing the concept back — but with a twist. Instead of one person keeping the money,
                <strong style={{ color: '#ff3366' }}> 50% of every dollar goes to charity</strong>.
                Your pixel isn&apos;t just an ad. It&apos;s a donation receipt.
              </p>
            </Card>
          </div>
        </section>

        {/* How it works */}
        <section style={{ marginBottom: '72px' }}>
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '32px' }}>
            Four simple steps
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {[
              { step: '01', title: 'Choose your pixels', desc: 'Browse the 1,000,000 pixel canvas. Click any free area to see the price. Standard pixels: $1/px. Golden Zone (center): $10/px.', color: '#ff3366' },
              { step: '02', title: 'Upload your brand', desc: 'Add your logo, link, and a short description. Our AI reviews every image to ensure it meets community standards before going live.', color: '#00d4ff' },
              { step: '03', title: 'Go live instantly', desc: 'After payment, your pixels appear on the canvas immediately. Millions of visitors will see your brand — forever, or until you resell.', color: '#a855f7' },
              { step: '04', title: 'Vote & give back', desc: 'Every advertiser gets a vote in our monthly charity poll. You decide where the funds go — real causes, suggested by real people.', color: '#eab308' },
            ].map(({ step, title, desc, color }) => (
              <div key={step} style={{ padding: '28px', borderRadius: '16px', background: '#0a0a0a', border: '1px solid #1a1a1a', display: 'flex', gap: '16px' }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '20px', color, flexShrink: 0, lineHeight: 1 }}>{step}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{title}</div>
                  <div style={{ color: '#666', fontSize: '14px', lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Charity mechanism */}
        <section style={{ marginBottom: '72px' }}>
          <SectionLabel>THE CHARITY FUND</SectionLabel>
          <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '20px' }}>
            Big impact, not small change
          </h2>
          <p style={{ color: '#777', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
            Charity done right means meaningful sums — not $2 scattered to the wind.
            That&apos;s why we don&apos;t distribute monthly. We wait until the fund is large enough to
            actually change lives, then let the community decide everything.
          </p>

          {/* Milestones visual */}
          <div style={{ padding: '32px', borderRadius: '20px', background: '#0a0a0a', border: '1px solid #1a1a1a', marginBottom: '32px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#555', letterSpacing: '0.1em', marginBottom: '20px' }}>
              CHARITY FUND MILESTONES — COMMUNITY VOTE TRIGGERS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: '$100,000 raised', desc: 'First community vote opens — you choose the payout schedule', highlight: true },
                { label: '$200,000 raised', desc: 'Second distribution milestone — community votes on causes' },
                { label: '$300,000 raised', desc: 'Third distribution — new nominations accepted' },
                { label: '$500,000 raised', desc: 'Major milestone — platform also plans to create jobs from its share' },
                { label: '$1,000,000 raised', desc: 'Full canvas sold — grand finale charity event' },
              ].map(({ label, desc, highlight }, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: highlight ? '#ff3366' : '#1a1a1a', border: `1px solid ${highlight ? '#ff3366' : '#222'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', fontWeight: 800, color: highlight ? '#fff' : '#333' }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: highlight ? '#ff3366' : '#ccc', marginBottom: '2px' }}>{label}</div>
                    <div style={{ fontSize: '13px', color: '#555' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,51,102,0.06)', border: '1px solid rgba(255,51,102,0.15)', fontSize: '13px', color: '#888', lineHeight: 1.6 }}>
              🗳️ <strong style={{ color: '#fff' }}>First vote:</strong> Once we hit $100k raised, every advertiser votes on whether the first payout happens at $100k, $200k, $300k, $500k, or $1M. Democracy decides.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Card>
              <CardTitle>You nominate</CardTitle>
              <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.6 }}>
                After buying pixels, nominate any cause you care about — a sick child, animal shelter,
                environmental org, or platform like Pomagam.pl, GoFundMe, or Zrzutka.pl.
                Your nomination enters the ballot.
              </p>
            </Card>
            <Card>
              <CardTitle>Community votes</CardTitle>
              <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.6 }}>
                Every advertiser gets one vote per milestone. The top causes receive the
                charity fund — split proportionally based on votes received.
              </p>
            </Card>
            <Card>
              <CardTitle>Real causes, real people</CardTitle>
              <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.6 }}>
                A child needing surgery. Dog shelters. Climate projects. If enough people
                rally around a cause, it wins the fund. No board of directors, no gatekeeping — pure democracy.
              </p>
            </Card>
            <Card>
              <CardTitle>Full transparency</CardTitle>
              <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.6 }}>
                Every vote result, every bank transfer confirmation, every charity receipt is published
                here publicly. We operate like a glass box. Always.
              </p>
            </Card>
          </div>
        </section>

        {/* Pricing */}
        <section style={{ marginBottom: '72px' }}>
          <SectionLabel>PRICING</SectionLabel>
          <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '24px' }}>
            Transparent pricing
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { name: 'Standard', price: '$1', unit: 'per pixel', desc: 'Any free area on the canvas outside the Golden Zone. Minimum 1 pixel, no maximum.', color: '#ffffff', glow: 'rgba(255,255,255,0.1)' },
              { name: 'Golden Zone', price: '$10', unit: 'per pixel', desc: 'The center 250×100 block — prime real estate, highest traffic, maximum visibility.', color: '#eab308', glow: 'rgba(234,179,8,0.2)', badge: '★ PREMIUM' },
              { name: 'VFX Add-ons', price: '$15–50', unit: 'one-time', desc: 'Make your pixels glow, pulse, shimmer, or burn. 5 animation effects available at checkout.', color: '#a855f7', glow: 'rgba(168,85,247,0.1)' },
            ].map(({ name, price, unit, desc, color, glow, badge }) => (
              <div key={name} style={{ padding: '28px 24px', borderRadius: '16px', background: '#0a0a0a', border: `1px solid ${glow}`, boxShadow: `0 0 30px ${glow}`, position: 'relative' }}>
                {badge && (
                  <div style={{ position: 'absolute', top: '-1px', right: '16px', background: '#eab308', color: '#000', fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: '0 0 6px 6px', letterSpacing: '0.05em' }}>{badge}</div>
                )}
                <div style={{ fontSize: '13px', color: '#555', fontWeight: 600, marginBottom: '8px' }}>{name}</div>
                <div style={{ fontSize: '36px', fontWeight: 900, color, marginBottom: '4px' }}>{price}</div>
                <div style={{ fontSize: '12px', color: '#444', marginBottom: '16px' }}>{unit}</div>
                <p style={{ color: '#666', fontSize: '13px', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
          <p style={{ color: '#555', fontSize: '13px', marginTop: '16px', textAlign: 'center' }}>
            All prices exclude local sales tax, which is calculated automatically at checkout based on your country.
          </p>
        </section>

        {/* Rules */}
        <section style={{ marginBottom: '72px' }}>
          <SectionLabel>RULES &amp; MODERATION</SectionLabel>
          <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '20px' }}>
            Safe, fair, and permanent
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { title: 'AI moderation', desc: 'Every uploaded image is screened by AI before going live. Hate speech, illegal content, and scams are rejected instantly.' },
              { title: 'Human review', desc: 'Edge cases and flagged content come to us for manual review. We respond within 24h. Borderline ads may be approved with a content warning.' },
              { title: 'Permanent pixels', desc: 'Once purchased, your pixels are yours as long as the site exists. No subscription, no renewal fee. Pay once, advertise forever.' },
              { title: 'Resale policy', desc: 'You may sell your pixel space to another buyer through our support team. A 20% Impact Fee applies (10% platform + 10% charity fund).' },
              { title: '18+ content', desc: 'Adult-content advertisers are placed in a dedicated section. Visitors must confirm their age before viewing. No adult content on the main canvas.' },
              { title: 'No refunds', desc: 'Pixels are digital goods delivered instantly. All sales are final. If we reject your content, we will refund within 7 days — no questions asked.' },
            ].map(({ title, desc }) => (
              <div key={title} style={{ padding: '20px', borderRadius: '12px', background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '8px', color: '#ff3366' }}>→ {title}</div>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: '72px' }}>
          <SectionLabel>FAQ</SectionLabel>
          <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '32px' }}>
            Honest answers
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              {
                q: 'What do you do with your 50%?',
                a: "Great question — and a fair one. I'm one person, not a corporation. My 50% covers taxes, running costs, and my time. But here's what I genuinely plan to do: once I reach roughly $500,000 in personal earnings from this project, I want to use a significant portion to create jobs for people in difficult situations — whether that's building a small agency, supporting a social enterprise, or something the community helps shape. That plan will be put to a public vote too. This project is built on transparency, and that includes me."
              },
              {
                q: 'Is this a company or a person?',
                a: "Right now, it's just me — a private individual running a community project. There's no corporation, no investors, no board. As the project grows, I'll handle taxes as required by law and keep the books public. If this scales significantly, forming a proper legal entity (foundation or social enterprise) is on the table — again, something the community will have input on."
              },
              {
                q: 'What if you never reach $100,000?',
                a: "Smaller amounts go into a holding fund — they don't disappear. If, after a reasonable period, the project hasn't reached $100k, we'll vote on a lower threshold. The goal is meaningful impact, not letting money sit unused. In that scenario, the community will still decide what happens."
              },
              {
                q: 'Who verifies the charities?',
                a: "We manually verify every nominated organization before it appears on a ballot. Registered charities and verified crowdfunding campaigns (GoFundMe, Zrzutka.pl, Pomagam.pl) are accepted. Individual nominations for specific people (e.g. a child needing surgery) require verifiable proof — a campaign link with documentation."
              },
              {
                q: 'Can companies partner with PixelForGood?',
                a: "Yes, and we welcome it. If your brand wants to be more than just an advertiser — co-sponsor a charity vote, feature your logo on a milestone announcement, or collaborate on a cause campaign — reach out. We're open to ethical partnerships that align with the project's mission."
              },
              {
                q: 'What happens to pixels after the canvas is full?',
                a: "Pixels remain yours permanently. You can resell through us (20% Impact Fee: 10% platform + 10% charity). The canvas becomes a permanent digital monument — a record of every brand that helped fund something real. We plan to keep the site alive as a historical artifact."
              },
            ].map(({ q, a }, i) => (
              <details
                key={i}
                style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '4px' }}
              >
                <summary style={{ padding: '18px 20px', background: '#0a0a0a', cursor: 'pointer', fontWeight: 700, fontSize: '15px', color: '#ddd', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none', border: '1px solid #1a1a1a', borderRadius: '12px' }}>
                  {q}
                  <span style={{ color: '#ff3366', fontSize: '18px', lineHeight: 1 }}>+</span>
                </summary>
                <div style={{ padding: '20px', background: '#080808', border: '1px solid #1a1a1a', borderTop: 'none', fontSize: '14px', color: '#777', lineHeight: 1.7, borderRadius: '0 0 12px 12px', marginTop: '-12px' }}>
                  {a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', padding: '48px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(255,51,102,0.1), rgba(0,212,255,0.05))', border: '1px solid rgba(255,51,102,0.25)' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '12px' }}>
            Ready to own your pixel?
          </h2>
          <p style={{ color: '#666', marginBottom: '28px', fontSize: '16px' }}>
            Join thousands of advertisers. Leave your mark. Fund something real.
          </p>
          <Link
            href="/"
            style={{ display: 'inline-block', padding: '14px 36px', borderRadius: '12px', background: 'linear-gradient(135deg, #ff3366, #cc0044)', color: '#fff', fontWeight: 800, fontSize: '15px', textDecoration: 'none', letterSpacing: '0.05em', boxShadow: '0 0 30px rgba(255,51,102,0.4)' }}
          >
            Go to Canvas →
          </Link>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid #111', padding: '32px 24px', textAlign: 'center', color: '#333', fontSize: '13px' }}>
        © 2026 PixelForGood · <a href="mailto:hello@pixelforgood.com" style={{ color: '#555', textDecoration: 'none' }}>hello@pixelforgood.com</a>
      </footer>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: '#333', letterSpacing: '0.15em', marginBottom: '12px' }}>
      {children}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '24px', borderRadius: '14px', background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
      {children}
    </div>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px', color: '#fff' }}>
      {children}
    </div>
  )
}
