'use client';
import { useState, useEffect } from 'react';
import { CITIES, PLANS } from '../../../core/data';

export default function ExplainabilityPage() {
  const [zone, setZone] = useState('Andheri');
  const [city, setCity] = useState('MUM');
  const [plan, setPlan] = useState('standard');
  const [shapData, setShapData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchExplanation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, city, zone, weeklyEarnings: 4500 }),
      });
      const data = await res.json();
      setShapData(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchExplanation(); }, [zone, city, plan]);

  const selectedCity = CITIES.find(c => c.id === city);
  const selectedPlan = PLANS.find(p => p.id === plan);

  // Calculate cumulative SHAP for waterfall
  const getWaterfallData = () => {
    if (!shapData?.shapExplanation) return [];
    const features = shapData.shapExplanation.features;
    let cumulative = shapData.shapExplanation.baseValue;
    return features.map(f => {
      const start = cumulative;
      cumulative += f.shapValue * shapData.shapExplanation.baseValue;
      return { ...f, start, end: cumulative };
    });
  };

  const waterfallData = getWaterfallData();
  const maxVal = Math.max(...waterfallData.map(w => Math.max(w.start, w.end)), 100);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>🧠 AI Premium Explainability</h1>
          <p className="text-muted text-sm mt-2">
            SHAP-powered transparent breakdown of how your premium is calculated — no black boxes
          </p>
        </div>
        <span className="badge badge-primary" style={{ padding: '6px 16px', fontSize: '0.8125rem' }}>
          XGBoost v2.3
        </span>
      </div>

      {/* Controls */}
      <div className="grid-3 mb-6">
        <div className="input-group">
          <label>City</label>
          <select className="input" value={city} onChange={e => { setCity(e.target.value); setZone(CITIES.find(c => c.id === e.target.value)?.zones[0]); }}>
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>Zone</label>
          <select className="input" value={zone} onChange={e => setZone(e.target.value)}>
            {selectedCity?.zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>Plan</label>
          <select className="input" value={plan} onChange={e => setPlan(e.target.value)}>
            {PLANS.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.weeklyPremium}/wk)</option>)}
          </select>
        </div>
      </div>

      {shapData && (
        <div className="grid-2" style={{ gridTemplateColumns: '1fr 1.2fr' }}>
          {/* Premium Summary */}
          <div>
            <div className="card card-glow mb-6">
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div className="text-muted text-sm">Your Weekly Premium</div>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent-primary)', lineHeight: 1.1, margin: '8px 0' }}>
                  ₹{shapData.finalPremium}
                </div>
                <div className="text-muted text-sm">
                  ₹{(shapData.finalPremium / 7).toFixed(1)}/day · {selectedPlan?.name}
                </div>
              </div>
            </div>

            <div className="card mb-6">
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '16px' }}>Formula Breakdown</h3>
              <code style={{
                display: 'block', padding: '16px', background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem', color: 'var(--accent-secondary)', lineHeight: 2,
              }}>
                Base Rate = ₹{shapData.breakdown.baseRate}<br />
                × Zone Risk = {shapData.breakdown.zoneRiskFactor}<br />
                × Season = {shapData.breakdown.seasonMultiplier}<br />
                + Plan Surcharge = ₹{shapData.breakdown.planSurcharge}<br />
                <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                  = ₹{shapData.finalPremium}
                </span>
              </code>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '12px' }}>Coverage Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="flex justify-between text-sm" style={{ padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="text-muted">Coverage %</span>
                  <span style={{ fontWeight: 600 }}>{shapData.coveragePercent}% of daily income</span>
                </div>
                <div className="flex justify-between text-sm" style={{ padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="text-muted">Weekly Limit</span>
                  <span style={{ fontWeight: 600 }}>₹{shapData.coverageLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ padding: '6px 0' }}>
                  <span className="text-muted">Max Payout</span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-success)' }}>₹{shapData.estimatedMaxPayout.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SHAP Waterfall Chart */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>SHAP Feature Impact (Waterfall)</h3>
              <span className="text-xs text-muted font-mono">{shapData.shapExplanation?.modelVersion}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* Base value */}
              <div style={{
                display: 'grid', gridTemplateColumns: '200px 1fr 80px',
                gap: '12px', alignItems: 'center', padding: '8px 0',
              }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Base Value</span>
                <div style={{ position: 'relative', height: '28px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, height: '100%',
                    width: `${(15 / maxVal) * 100}%`,
                    background: 'var(--border-emphasis)',
                    borderRadius: 'var(--radius-sm)',
                  }}></div>
                </div>
                <span className="font-mono text-sm" style={{ textAlign: 'right' }}>₹15.00</span>
              </div>

              {/* Feature contributions */}
              {shapData.shapExplanation?.features.map((f, i) => {
                const absValue = Math.abs(f.shapValue);
                const isPositive = f.shapValue > 0;
                const barWidth = (absValue / 0.5) * 100; // Normalize to max SHAP ~0.5

                return (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '200px 1fr 80px',
                    gap: '12px', alignItems: 'center', padding: '8px 0',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{f.name}</div>
                      <div className="text-xs text-muted" style={{ marginTop: '2px' }}>{f.explanation}</div>
                    </div>
                    <div style={{ position: 'relative', height: '28px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute',
                        left: isPositive ? '50%' : `${50 - Math.min(barWidth, 50)}%`,
                        top: '2px',  height: 'calc(100% - 4px)',
                        width: `${Math.min(barWidth, 50)}%`,
                        background: isPositive
                          ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.7))'
                          : 'linear-gradient(90deg, rgba(16, 185, 129, 0.7), rgba(16, 185, 129, 0.3))',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all 0.5s ease',
                      }}></div>
                      {/* Center line */}
                      <div style={{
                        position: 'absolute', left: '50%', top: 0, width: '1px', height: '100%',
                        background: 'var(--border-emphasis)',
                      }}></div>
                    </div>
                    <span className="font-mono text-sm" style={{
                      textAlign: 'right',
                      color: isPositive ? 'var(--accent-danger)' : 'var(--accent-success)',
                      fontWeight: 600,
                    }}>
                      {isPositive ? '+' : ''}{(f.shapValue * 15).toFixed(1)}
                    </span>
                  </div>
                );
              })}

              {/* Final prediction */}
              <div style={{
                display: 'grid', gridTemplateColumns: '200px 1fr 80px',
                gap: '12px', alignItems: 'center', padding: '12px 0',
                borderTop: '2px solid var(--accent-primary)',
                marginTop: '8px',
              }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  Final Premium
                </span>
                <div style={{ position: 'relative', height: '28px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, height: '100%',
                    width: `${Math.min((shapData.finalPremium / maxVal) * 100, 100)}%`,
                    background: 'var(--gradient-hero)',
                    borderRadius: 'var(--radius-sm)',
                  }}></div>
                </div>
                <span className="font-mono" style={{ textAlign: 'right', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  ₹{shapData.finalPremium}
                </span>
              </div>
            </div>

            {/* Worker-facing explanation */}
            <div style={{
              marginTop: '24px', padding: '16px', background: 'var(--accent-primary-glow)',
              borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-primary)',
            }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                💬 What the worker sees:
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                "Your premium is ₹{shapData.finalPremium} this week because {zone} has {
                  shapData.shapExplanation?.features[0]?.shapValue > 0.3
                    ? 'heavy monsoon history — that\'s the main driver.'
                    : 'moderate seasonal risk. Your zone is relatively safe this week.'
                }"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
