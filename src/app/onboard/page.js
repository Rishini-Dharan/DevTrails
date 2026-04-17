'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { CITIES, PLANS, calculatePremium } from '../../core/data';

const STEPS = ['Phone Verification', 'Link Platform', 'Select Zone', 'Choose Plan', 'Confirm & Pay'];

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    phone: '', otp: '', otpSent: false,
    platform: '', platformId: '',
    city: '', zone: '',
    plan: 'standard',
    weeklyEarnings: 4500,
  });

  const selectedCity = CITIES.find(c => c.id === form.city);
  const premiumData = form.plan && form.zone
    ? calculatePremium(form.plan, form.city, form.zone, form.weeklyEarnings)
    : null;

  const sendOtp = () => setForm(f => ({ ...f, otpSent: true }));

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else router.push('/dashboard');
  };

  const prevStep = () => { if (step > 0) setStep(step - 1); };

  return (
    <div className="page-wrapper">
      <Navbar variant="landing" />

      <div className="container" style={{ maxWidth: '600px', padding: '48px 24px' }}>
        {/* Progress */}
        <div style={{ marginBottom: '40px' }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Step {step + 1} of {STEPS.length}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{STEPS[step]}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}></div>
          </div>
        </div>

        {/* Step 0: Phone */}
        {step === 0 && (
          <div className="card animate-fade-in">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Verify Your Phone</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              We'll send a one-time code to verify your number. No email or Aadhaar needed.
            </p>

            <div className="input-group mb-4">
              <label>Phone Number</label>
              <div className="flex gap-2">
                <span className="input" style={{ width: '60px', textAlign: 'center', background: 'var(--bg-elevated)' }}>+91</span>
                <input
                  type="tel"
                  className="input"
                  placeholder="98765 43210"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            {!form.otpSent ? (
              <button className="btn btn-primary btn-full" onClick={sendOtp} disabled={form.phone.length < 5}>
                Send OTP
              </button>
            ) : (
              <>
                <div className="input-group mb-4">
                  <label>Enter OTP</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter 6-digit code"
                    value={form.otp}
                    onChange={e => setForm(f => ({ ...f, otp: e.target.value }))}
                    maxLength={6}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)' }}>✓ OTP sent to +91 {form.phone}</span>
                </div>
                <button className="btn btn-primary btn-full" onClick={nextStep}>
                  Verify & Continue
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 1: Platform */}
        {step === 1 && (
          <div className="card animate-fade-in">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Link Your Gig Platform</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              This helps us calculate your income and validate coverage claims.
            </p>

            <div className="input-group mb-4">
              <label>Platform</label>
              <div className="flex gap-3">
                {['Swiggy', 'Zomato', 'Other'].map(p => (
                  <button
                    key={p}
                    className={`card ${form.platform === p ? 'card-glow' : ''}`}
                    onClick={() => setForm(f => ({ ...f, platform: p }))}
                    style={{
                      flex: 1, textAlign: 'center', padding: '16px',
                      cursor: 'pointer',
                      border: form.platform === p ? '2px solid var(--accent-primary)' : undefined,
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                      {p === 'Swiggy' ? '🟠' : p === 'Zomato' ? '🔴' : '📦'}
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{p}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group mb-4">
              <label>Partner ID</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. SWG-123456"
                value={form.platformId}
                onChange={e => setForm(f => ({ ...f, platformId: e.target.value }))}
              />
            </div>

            <div className="input-group mb-6">
              <label>Avg. Weekly Earnings (₹)</label>
              <input
                type="number"
                className="input"
                placeholder="4500"
                value={form.weeklyEarnings}
                onChange={e => setForm(f => ({ ...f, weeklyEarnings: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="flex gap-3">
              <button className="btn btn-secondary" onClick={prevStep}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={nextStep}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2: Zone */}
        {step === 2 && (
          <div className="card animate-fade-in">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Select Your Work Zone</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Your zone determines your risk profile and premium. Pick where you deliver most.
            </p>

            <div className="input-group mb-4">
              <label>City</label>
              <select
                className="input"
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value, zone: '' }))}
              >
                <option value="">Select city</option>
                {CITIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}, {c.state}</option>
                ))}
              </select>
            </div>

            {selectedCity && (
              <div className="input-group mb-6">
                <label>Delivery Zone</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {selectedCity.zones.map(z => (
                    <button
                      key={z}
                      className={`card ${form.zone === z ? 'card-glow' : ''}`}
                      onClick={() => setForm(f => ({ ...f, zone: z }))}
                      style={{
                        padding: '12px', cursor: 'pointer', textAlign: 'center',
                        fontSize: '0.875rem', fontWeight: 500,
                        border: form.zone === z ? '2px solid var(--accent-primary)' : undefined,
                      }}
                    >
                      {z}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button className="btn btn-secondary" onClick={prevStep}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={nextStep} disabled={!form.zone}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Plan */}
        {step === 3 && (
          <div className="card animate-fade-in">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Choose Your Plan</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              We recommend <strong>Standard</strong> for most full-time delivery partners.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {PLANS.map(plan => (
                <button
                  key={plan.id}
                  className={`card ${form.plan === plan.id ? 'card-glow' : ''}`}
                  onClick={() => setForm(f => ({ ...f, plan: plan.id }))}
                  style={{
                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    border: form.plan === plan.id ? `2px solid ${plan.color}` : undefined,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: '2px' }}>
                      {plan.name}
                      {plan.popular && <span className="badge badge-primary" style={{ marginLeft: '8px' }}>Recommended</span>}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {plan.disruptions.length} disruption types · {plan.coveragePercent}% coverage
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{plan.weeklyPremium}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/week</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="btn btn-secondary" onClick={prevStep}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={nextStep}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="card animate-fade-in">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Confirm & Pay</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Phone', value: `+91 ${form.phone}` },
                { label: 'Platform', value: `${form.platform} · ${form.platformId}` },
                { label: 'Zone', value: `${form.zone}, ${selectedCity?.name}` },
                { label: 'Plan', value: PLANS.find(p => p.id === form.plan)?.name },
                { label: 'Weekly Earnings', value: `₹${form.weeklyEarnings.toLocaleString()}` },
              ].map((r, i) => (
                <div key={i} className="flex justify-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                  <span style={{ fontWeight: 600 }}>{r.value}</span>
                </div>
              ))}
            </div>

            {premiumData && (
              <div style={{
                background: 'var(--accent-primary-glow)', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '24px'
              }}>
                <div className="flex justify-between items-center mb-2">
                  <span style={{ fontWeight: 600 }}>Your Weekly Premium</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                    ₹{premiumData.finalPremium}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  Base ₹{premiumData.breakdown.baseRate} × Zone {premiumData.breakdown.zoneRiskFactor} × Season {premiumData.breakdown.seasonMultiplier} + Plan surcharge ₹{premiumData.breakdown.planSurcharge}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--accent-success)', marginTop: '8px' }}>
                  Max payout this week: ₹{premiumData.estimatedMaxPayout.toLocaleString()}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button className="btn btn-secondary" onClick={prevStep}>← Back</button>
              <button
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                onClick={() => router.push('/dashboard')}
              >
                Pay ₹{premiumData?.finalPremium || 59} via UPI →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
