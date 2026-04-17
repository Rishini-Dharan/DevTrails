'use client';
import { useState } from 'react';

const FRAUD_CASES = [
  {
    id: 'FRD-001',
    worker: 'User #A7X2K',
    zone: 'Andheri, Mumbai',
    trigger: 'TRG-RAIN',
    claimDate: '2026-04-15',
    amount: 1200,
    fraudScore: 0.92,
    verdict: 'AUTO-REJECTED',
    signals: [
      { signal: 'GPS Location', expected: 'Andheri West', actual: 'Thane (15km away)', match: false },
      { signal: 'Cell Tower', expected: 'Andheri', actual: 'Thane', match: false },
      { signal: 'Wi-Fi BSSID', expected: 'Commercial/Unknown', actual: 'Home network (registered Thane)', match: false },
      { signal: 'Last Order', expected: 'Within 1hr', actual: '6 hours ago', match: false },
      { signal: 'Accelerometer', expected: 'Walking/riding', actual: 'Stationary 3+ hrs', match: false },
      { signal: 'Claim Frequency', expected: '< 2/month', actual: '4 in 30 days', match: false },
      { signal: 'Peer Cluster', expected: 'None', actual: '12 linked accounts with same pattern', match: false },
    ],
    explanation: 'Isolation Forest path length: SHORT (anomaly). Worker\'s device telemetry is inconsistent with being in the affected zone during the disruption window. Strong GPS/Cell tower mismatch plus peer cluster detection.',
  },
  {
    id: 'FRD-002',
    worker: 'Ramesh K.',
    zone: 'Koramangala, BLR',
    trigger: 'TRG-RAIN',
    claimDate: '2026-04-10',
    amount: 975,
    fraudScore: 0.08,
    verdict: 'AUTO-APPROVED',
    signals: [
      { signal: 'GPS Location', expected: 'Koramangala', actual: 'Koramangala', match: true },
      { signal: 'Cell Tower', expected: 'Koramangala', actual: 'Koramangala', match: true },
      { signal: 'Wi-Fi BSSID', expected: 'Commercial/Unknown', actual: 'Commercial area', match: true },
      { signal: 'Last Order', expected: 'Within 1hr', actual: '42 min ago', match: true },
      { signal: 'Accelerometer', expected: 'Walking/riding', actual: 'Walking pattern (seeking shelter)', match: true },
      { signal: 'Claim Frequency', expected: '< 2/month', actual: '1 in 30 days', match: true },
      { signal: 'Peer Cluster', expected: 'None', actual: 'None detected', match: true },
    ],
    explanation: 'Isolation Forest path length: LONG (normal). All device telemetry confirms worker presence in affected zone during disruption window. Clean claim.',
  },
  {
    id: 'FRD-003',
    worker: 'User #M3P8Q',
    zone: 'Bandra, Mumbai',
    trigger: 'TRG-RAIN',
    claimDate: '2026-04-12',
    amount: 850,
    fraudScore: 0.74,
    verdict: 'MANUAL REVIEW',
    signals: [
      { signal: 'GPS Location', expected: 'Bandra', actual: 'Bandra (edge of zone)', match: true },
      { signal: 'Cell Tower', expected: 'Bandra', actual: 'Bandra/Khar overlap', match: true },
      { signal: 'Wi-Fi BSSID', expected: 'Commercial/Unknown', actual: 'Residential', match: false },
      { signal: 'Last Order', expected: 'Within 1hr', actual: '2.5 hrs ago', match: false },
      { signal: 'Accelerometer', expected: 'Walking/riding', actual: 'Mostly stationary', match: false },
      { signal: 'Claim Frequency', expected: '< 2/month', actual: '3 in 30 days', match: false },
      { signal: 'Peer Cluster', expected: 'None', actual: 'None', match: true },
    ],
    explanation: 'Isolation Forest path length: MEDIUM. GPS confirms zone presence but behavioral signals suggest the worker may have already stopped working before the disruption. Flagged for human review.',
  },
];

export default function FraudPage() {
  const [selectedCase, setSelectedCase] = useState(null);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Fraud Detection</h1>
          <p className="text-muted text-sm mt-2">Isolation Forest anomaly detection engine — real-time claim validation</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="badge badge-success" style={{ padding: '4px 12px' }}>False Positive Rate: 1.8%</span>
          <span className="badge badge-info" style={{ padding: '4px 12px' }}>Model v2.3 (Champion)</span>
        </div>
      </div>

      {/* Model Performance Stats */}
      <div className="grid-4 mb-6">
        {[
          { label: 'Claims Evaluated', value: '2,847', color: 'var(--text-primary)' },
          { label: 'Auto-Approved', value: '2,614', color: 'var(--accent-success)' },
          { label: 'Auto-Rejected', value: '156', color: 'var(--accent-danger)' },
          { label: 'Manual Review', value: '77', color: 'var(--accent-warning)' },
        ].map((s, i) => (
          <div key={i} className="card">
            <div className="stat-card">
              <span className="stat-label">{s.label}</span>
              <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1.2fr' }}>
        {/* Case List */}
        <div className="card">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '16px' }}>Recent Evaluations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FRAUD_CASES.map((c, i) => (
              <button
                key={i}
                onClick={() => setSelectedCase(c)}
                className="card"
                style={{
                  cursor: 'pointer', textAlign: 'left',
                  border: selectedCase?.id === c.id ? '2px solid var(--accent-primary)' : undefined,
                  padding: '14px',
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-sm">{c.id}</span>
                  <span className={`badge ${c.fraudScore < 0.3 ? 'badge-success' : c.fraudScore < 0.7 ? 'badge-warning' : 'badge-danger'}`}>
                    Score: {c.fraudScore.toFixed(2)}
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '2px' }}>{c.worker}</div>
                <div className="text-xs text-muted">{c.zone} · {c.claimDate}</div>
                <div className="mt-2">
                  <span className={`badge ${c.verdict === 'AUTO-APPROVED' ? 'badge-success' : c.verdict === 'AUTO-REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                    {c.verdict}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail View */}
        <div className="card">
          {selectedCase ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{selectedCase.worker}</h3>
                  <p className="text-sm text-muted">{selectedCase.zone} · Claim ₹{selectedCase.amount.toLocaleString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '2rem', fontWeight: 900,
                    color: selectedCase.fraudScore < 0.3 ? 'var(--accent-success)' : selectedCase.fraudScore < 0.7 ? 'var(--accent-warning)' : 'var(--accent-danger)'
                  }}>{selectedCase.fraudScore.toFixed(2)}</div>
                  <div className="text-xs text-muted">Fraud Score</div>
                </div>
              </div>

              <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Signal Analysis
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                {selectedCase.signals.map((s, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '120px 1fr 1fr 40px',
                    gap: '8px', padding: '8px 12px',
                    background: s.match ? 'var(--accent-success-glow)' : 'var(--accent-danger-glow)',
                    borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', alignItems: 'center',
                  }}>
                    <span style={{ fontWeight: 600 }}>{s.signal}</span>
                    <span className="text-muted">Expected: {s.expected}</span>
                    <span style={{ color: s.match ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                      Actual: {s.actual}
                    </span>
                    <span style={{ textAlign: 'center', fontSize: '1rem' }}>{s.match ? '✅' : '❌'}</span>
                  </div>
                ))}
              </div>

              <div style={{
                padding: '16px', background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)', fontSize: '0.8125rem',
                borderLeft: `3px solid ${selectedCase.fraudScore < 0.3 ? 'var(--accent-success)' : selectedCase.fraudScore < 0.7 ? 'var(--accent-warning)' : 'var(--accent-danger)'}`,
              }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>AI Analysis</div>
                <p className="text-muted">{selectedCase.explanation}</p>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px' }}>
              <p className="text-muted">Select a case to view fraud analysis details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
