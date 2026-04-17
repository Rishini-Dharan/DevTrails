'use client';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import CountUpStat from '../components/CountUp';
import WhatsAppPreview from '../components/WhatsAppPreview';

export default function LandingPage() {
  return (
    <div className="page-wrapper">
      <Navbar variant="landing" />

      {/* ═══ Hero ═══ */}
      <section className="hero">
        <div className="container">
          <div className="animate-fade-in stagger-1">
            <span className="hero-badge">
              <span className="live-dot"></span>
              Live in 5 Indian cities
            </span>
          </div>

          <h1 className="animate-fade-in stagger-2">
            Income Protection<br />for India's Gig Workers
          </h1>

          <p className="hero-subtitle animate-fade-in stagger-3">
            When rain halts deliveries, when heat waves shut down your zone, when a bandh steals your workday — 
            Lattice Protocol detects it automatically and streams money into your wallet. 
            No claims. No forms. No waiting.
          </p>

          <div className="hero-actions animate-fade-in stagger-4">
            <Link href="/onboard" className="btn btn-primary btn-lg">
              Start Protection — ₹29/week →
            </Link>
            <Link href="/plans" className="btn btn-secondary btn-lg">
              View Plans
            </Link>
          </div>

          {/* Trust strip — animated count-up on scroll */}
          <div className="animate-fade-in stagger-5" style={{
            marginTop: '64px',
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            flexWrap: 'wrap'
          }}>
            <CountUpStat target={12800} suffix="+" label="Workers Protected" />
            <CountUpStat target={48} prefix="₹" suffix="L+" label="Payouts Delivered" />
            <CountUpStat target={90} prefix="< " suffix=" min" label="Avg Payout Time" />
            <CountUpStat target={0} label="Forms to File" />
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2>How It Actually Works</h2>
            <p>From disruption to payout in under 90 minutes — fully automated, zero paperwork</p>
          </div>

          <div className="grid-4" style={{ counterReset: 'step' }}>
            {[
              {
                icon: '📱',
                title: 'Sign Up in 3 Minutes',
                desc: 'Phone + OTP. Link your Swiggy/Zomato partner ID. Pick your delivery zone. Done.',
              },
              {
                icon: '🛡️',
                title: 'Pay Weekly Premium',
                desc: 'Choose Basic (₹29), Standard (₹59), or Premium (₹99). Pay via UPI — same as sending ₹30 to a friend.',
              },
              {
                icon: '🌧️',
                title: 'Disruption Detected',
                desc: 'Our AI monitors weather, AQI, news, and platform data 24/7. When a threshold is breached in your zone, a trigger fires automatically.',
              },
              {
                icon: '💰',
                title: 'Money Hits Your Wallet',
                desc: 'Fraud check runs in 30 seconds. Payout streams to your UPI within 90 minutes. You never filed a single claim.',
              },
            ].map((step, i) => (
              <div key={i} className="card card-glow animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                <div style={{
                  fontSize: '2rem', marginBottom: '16px',
                  width: '48px', height: '48px',
                  background: 'var(--accent-primary-glow)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{step.icon}</div>
                <div style={{
                  fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)',
                  marginBottom: '8px', fontFamily: 'var(--font-mono)'
                }}>STEP {i + 1}</div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ What We Cover ═══ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Every Disruption That Steals Your Income</h2>
            <p>We monitor six categories of events that can stop you from earning</p>
          </div>

          <div className="grid-3">
            {[
              { icon: '🌧️', name: 'Heavy Rainfall', threshold: '> 30mm/hr for 2+ hours', example: 'Mumbai monsoon waterlogging' },
              { icon: '🌡️', name: 'Extreme Heat', threshold: '> 44°C for 4+ hours', example: 'Delhi May heatwave advisory' },
              { icon: '🌫️', name: 'Severe Pollution', threshold: 'AQI > 400 for 6+ hours', example: 'Delhi NCR winter smog' },
              { icon: '🌊', name: 'Urban Flooding', threshold: 'Official flood alert', example: 'Bengaluru arterial road flooding' },
              { icon: '🚫', name: 'Curfew / Bandh', threshold: 'Govt order + activity drop > 80%', example: 'Sudden local bandh call' },
              { icon: '📱', name: 'Platform Outage', threshold: 'App down > 2 hours', example: 'Swiggy/Zomato server crash' },
            ].map((t, i) => (
              <div key={i} className="card animate-slide-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '12px' }}>{t.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{t.name}</h3>
                <p style={{
                  fontSize: '0.8125rem', color: 'var(--accent-primary)',
                  fontFamily: 'var(--font-mono)', marginBottom: '8px'
                }}>Threshold: {t.threshold}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>e.g., {t.example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Real Scenario ═══ */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <h2>A Real Week with Lattice Protocol</h2>
            <p>Follow Ramesh, a Swiggy partner in Mumbai, through a monsoon week</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { day: 'Monday', time: '9:00 AM', event: 'Ramesh pays ₹59 weekly premium via UPI. Coverage activates instantly.', type: 'neutral' },
              { day: 'Tuesday', time: '2:00 PM', event: 'IMD issues orange alert — 80mm rainfall in western suburbs. System ingests. No trigger yet.', type: 'warning' },
              { day: 'Tuesday', time: '6:00 PM', event: 'Rainfall > 65mm in Andheri for 3 hours. TRG-RAIN fires. Fraud score: 0.08 (clean).', type: 'danger' },
              { day: 'Tuesday', time: '7:45 PM', event: '₹490 deposited in Ramesh\'s UPI — 1hr 45min after trigger. No form filed.', type: 'success' },
              { day: 'Wednesday', time: '10:00 AM', event: 'Second trigger window fires. ₹585 deposited. Ramesh shares screenshot in rider WhatsApp group.', type: 'success' },
              { day: 'Thursday', time: '11:00 AM', event: 'BMC reports road closures. TRG-FLOOD fires. ₹975 deposited. Week total: ₹2,050.', type: 'success' },
              { day: 'Next Monday', time: '8:00 AM', event: '"Last week we protected ₹2,050 of your income. Renew for ₹59?" → Ramesh renews in one tap.', type: 'neutral' },
            ].map((e, i) => (
              <div key={i} className="card" style={{
                display: 'flex', gap: '20px', alignItems: 'flex-start',
                borderLeft: `3px solid ${e.type === 'success' ? 'var(--accent-success)' : e.type === 'danger' ? 'var(--accent-danger)' : e.type === 'warning' ? 'var(--accent-warning)' : 'var(--border-default)'}`,
                borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                animation: `fadeIn 0.5s ease-out ${i * 0.1}s forwards`,
                opacity: 0
              }}>
                <div style={{ minWidth: '100px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{e.day}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{e.time}</div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{e.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WhatsApp Preview ═══ */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '64px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: '440px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
                What Ramesh Actually Sees
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '16px' }}>
                No app to download. No forms to fill. Just a WhatsApp message with money already in his wallet.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                That's the whole product. Our AI detects the disruption. Our fraud engine validates it.
                Our pipeline pays him. He shares the receipt in his rider WhatsApp group.
                <strong style={{ color: 'var(--accent-success)' }}> Next week, 12 more riders sign up.</strong>
              </p>
            </div>
            <WhatsAppPreview workerName="Ramesh" amount={975} reason="Heavy rainfall in Andheri zone (65mm/hr for 3hrs)" time="7:45 PM" />
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section" style={{ textAlign: 'center', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Don't Let Rain Steal ₹1,200 From Your Pocket This Week
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 32px', fontSize: '1.0625rem' }}>
            Protection costs less than one chai per day. Start at ₹29/week.
          </p>
          <Link href="/onboard" className="btn btn-primary btn-lg">
            Get Protected Now →
          </Link>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="footer">
        <div className="container">
          <p>© 2026 Lattice Protocol. Built for India's gig economy.</p>
        </div>
      </footer>
    </div>
  );
}
