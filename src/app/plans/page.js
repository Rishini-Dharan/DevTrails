'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { PLANS } from '../../core/data';

export default function PlansPage() {
  const [billing, setBilling] = useState('weekly');

  return (
    <div className="page-wrapper">
      <Navbar variant="landing" />

      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="hero-badge" style={{ marginBottom: '24px' }}>
              Simple, transparent pricing
            </span>
            <h2 style={{ fontSize: '2.5rem' }}>Choose Your Shield</h2>
            <p>All plans include automatic triggers, zero paperwork, and instant UPI payouts</p>
          </div>

          <div className="grid-3" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {PLANS.map((plan, i) => (
              <div
                key={plan.id}
                className="card animate-slide-up"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0,
                  position: 'relative',
                  border: plan.popular ? `2px solid ${plan.color}` : undefined,
                  overflow: 'visible',
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                    background: plan.color, color: '#fff', padding: '4px 16px',
                    borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700,
                    letterSpacing: '0.04em', whiteSpace: 'nowrap'
                  }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '4px' }}>{plan.name}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Up to ₹{plan.coverageLimit.toLocaleString()}/week
                  </p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
                    ₹{plan.weeklyPremium}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>/week</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                    = ₹{(plan.weeklyPremium / 7).toFixed(1)}/day — less than a chai
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px'
                  }}>
                    Disruptions Covered
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {plan.disruptions.map((d, j) => (
                      <span key={j} className="badge badge-info" style={{ fontSize: '0.6875rem' }}>{d}</span>
                    ))}
                  </div>
                </div>

                <ul style={{
                  listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px',
                  marginBottom: '24px', flex: 1
                }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ color: plan.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/onboard"
                  className={`btn btn-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                  style={plan.popular ? { background: plan.color } : {}}
                >
                  Choose {plan.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Premium Formula */}
          <div className="card card-glow" style={{ maxWidth: '800px', margin: '64px auto 0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
              🧮 How Your Premium Is Calculated
            </h3>
            <code style={{
              display: 'block', padding: '16px', background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem', color: 'var(--accent-secondary)', lineHeight: 1.8,
              overflow: 'auto',
            }}>
              Weekly Premium = Base Rate × Zone Risk Factor × Season Multiplier<br />
              <br />
              <span style={{ color: 'var(--text-muted)' }}>Where:</span><br />
              &nbsp;&nbsp;Base Rate &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ₹15 (actuarial baseline)<br />
              &nbsp;&nbsp;Zone Risk Factor &nbsp;= 0.8 – 2.5 (ML-derived from history)<br />
              &nbsp;&nbsp;Season Multiplier = 0.9 – 1.8 (monsoon/winter peaks)<br />
            </code>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
              Our XGBoost model uses SHAP explainability to show you exactly why your premium is what it is — no black boxes.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© 2026 Lattice Protocol. Built for India's gig economy.</p>
        </div>
      </footer>
    </div>
  );
}
