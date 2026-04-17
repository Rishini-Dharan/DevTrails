'use client';
import { useState, useEffect } from 'react';
import { generateMockUser, PLANS } from '../../../core/data';

export default function PolicyPage() {
  const [user, setUser] = useState(null);
  useEffect(() => setUser(generateMockUser()), []);
  if (!user) return null;
  const activePlan = PLANS.find(p => p.id === user.activePlan);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Active Policy</h1>
        <span className="badge badge-success">Week of Apr 14–20</span>
      </div>

      {/* Policy Summary Card */}
      <div className="card card-glow mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activePlan?.name}</h2>
            <p className="text-muted text-sm">{activePlan?.disruptions.length} disruption types · {activePlan?.coveragePercent}% income coverage</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-primary)' }}>₹{activePlan?.weeklyPremium}</div>
            <div className="text-xs text-muted">per week</div>
          </div>
        </div>

        <div className="grid-3" style={{ gap: '16px' }}>
          <div className="card" style={{ background: 'var(--bg-primary)' }}>
            <div className="stat-card">
              <span className="stat-label">Coverage Limit</span>
              <span className="stat-value" style={{ fontSize: '1.25rem' }}>₹{activePlan?.coverageLimit.toLocaleString()}/week</span>
            </div>
          </div>
          <div className="card" style={{ background: 'var(--bg-primary)' }}>
            <div className="stat-card">
              <span className="stat-label">Payouts This Week</span>
              <span className="stat-value text-success" style={{ fontSize: '1.25rem' }}>₹975</span>
            </div>
          </div>
          <div className="card" style={{ background: 'var(--bg-primary)' }}>
            <div className="stat-card">
              <span className="stat-label">Remaining</span>
              <span className="stat-value text-warning" style={{ fontSize: '1.25rem' }}>₹{(activePlan?.coverageLimit - 975).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Covered Disruptions */}
      <div className="card mb-6">
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '16px' }}>Covered Disruptions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activePlan?.disruptions.map((d, i) => (
            <div key={i} className="flex justify-between items-center" style={{
              padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)'
            }}>
              <span style={{ fontWeight: 500 }}>{d}</span>
              <span className="badge badge-success">Covered ✓</span>
            </div>
          ))}
          {['Curfew/Bandh', 'Local Strike'].filter(d => !activePlan?.disruptions.includes(d)).map((d, i) => (
            <div key={i} className="flex justify-between items-center" style={{
              padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
              opacity: 0.5
            }}>
              <span style={{ fontWeight: 500 }}>{d}</span>
              <span className="badge badge-warning">Upgrade to Premium</span>
            </div>
          ))}
        </div>
      </div>

      {/* Policy History */}
      <div className="card">
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '16px' }}>Policy History</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Week</th><th>Plan</th><th>Premium</th><th>Payouts</th><th>Status</th></tr>
            </thead>
            <tbody>
              {user.policyHistory.map((p, i) => (
                <tr key={i}>
                  <td className="font-mono text-sm">{p.week}</td>
                  <td>{p.plan}</td>
                  <td>₹{p.premium}</td>
                  <td style={{ color: p.payouts > 0 ? 'var(--accent-success)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {p.payouts > 0 ? `+₹${p.payouts.toLocaleString()}` : '—'}
                  </td>
                  <td><span className="badge badge-info">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
