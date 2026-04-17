'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Leaflet
const RiskMap = dynamic(() => import('../../../components/RiskMap'), { ssr: false });

const CITIES = ['All', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai'];

export default function MapPage() {
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedZone, setSelectedZone] = useState(null);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>🗺️ Risk Heatmap</h1>
          <p className="text-muted text-sm mt-2">Interactive zone risk visualization across India</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="live-dot"></span>
          <span className="text-sm text-muted">Live risk data</span>
        </div>
      </div>

      {/* City selector */}
      <div className="flex gap-2 mb-6" style={{ flexWrap: 'wrap' }}>
        {CITIES.map(c => (
          <button
            key={c}
            className={`btn ${selectedCity === c ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setSelectedCity(c); setSelectedZone(null); }}
            style={{ fontSize: '0.8125rem' }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Map */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: '520px' }}>
          <RiskMap selectedCity={selectedCity} onZoneSelect={setSelectedZone} />
        </div>

        {/* Zone Detail Panel */}
        <div>
          {selectedZone ? (
            <div className="card card-glow animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{selectedZone.zone}</h3>
                  <p className="text-sm text-muted">{selectedZone.city}</p>
                </div>
                <span className={`badge ${
                  selectedZone.status === 'critical' ? 'badge-danger' :
                  selectedZone.status === 'high' ? 'badge-warning' :
                  selectedZone.status === 'moderate' ? 'badge-info' : 'badge-success'
                }`} style={{ fontSize: '0.8125rem', padding: '4px 12px' }}>
                  {selectedZone.status}
                </span>
              </div>

              <div style={{
                textAlign: 'center', padding: '20px', marginBottom: '16px',
                background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)',
              }}>
                <div className="text-muted text-xs mb-1">Risk Score</div>
                <div style={{
                  fontSize: '3rem', fontWeight: 900, lineHeight: 1,
                  color: selectedZone.risk >= 0.8 ? 'var(--accent-danger)' :
                         selectedZone.risk >= 0.6 ? 'var(--accent-warning)' :
                         selectedZone.risk >= 0.4 ? 'var(--accent-secondary)' : 'var(--accent-success)',
                }}>
                  {Math.round(selectedZone.risk * 100)}%
                </div>
                <div className="progress-bar mt-4" style={{ height: '6px' }}>
                  <div style={{
                    height: '100%', width: `${selectedZone.risk * 100}%`,
                    borderRadius: 'var(--radius-full)',
                    background: selectedZone.risk >= 0.8 ? 'var(--accent-danger)' :
                                selectedZone.risk >= 0.6 ? 'var(--accent-warning)' :
                                selectedZone.risk >= 0.4 ? 'var(--accent-secondary)' : 'var(--accent-success)',
                  }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Active Workers', value: selectedZone.workers },
                  { label: 'Avg Weekly Premium', value: `₹${Math.round(15 * (1 + selectedZone.risk) * 1.1 + 44)}` },
                  { label: 'Triggers (30d)', value: Math.round(selectedZone.risk * 12) },
                  { label: 'Total Payouts (30d)', value: `₹${Math.round(selectedZone.workers * selectedZone.risk * 450).toLocaleString()}` },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between" style={{
                    padding: '8px 0', borderBottom: '1px solid var(--border-subtle)',
                    fontSize: '0.8125rem',
                  }}>
                    <span className="text-muted">{r.label}</span>
                    <span style={{ fontWeight: 600 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: '300px', textAlign: 'center',
            }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📍</div>
                <p className="text-muted text-sm">Click a zone on the map<br />to view details</p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="card mt-4">
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-muted)' }}>Risk Legend</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { color: '#ef4444', label: 'Critical (80%+)', desc: 'Active disruption likely' },
                { color: '#f59e0b', label: 'High (60-80%)', desc: 'Elevated risk this week' },
                { color: '#06b6d4', label: 'Moderate (40-60%)', desc: 'Normal seasonal variance' },
                { color: '#10b981', label: 'Low (<40%)', desc: 'Safe conditions expected' },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-3" style={{ fontSize: '0.8125rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: l.color, flexShrink: 0 }}></div>
                  <div>
                    <span style={{ fontWeight: 600 }}>{l.label}</span>
                    <span className="text-muted"> — {l.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
