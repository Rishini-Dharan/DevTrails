'use client';
import { useState, useEffect } from 'react';
import { generateMockUser, PLANS, TRIGGER_TYPES, generateMockWeather } from '../../core/data';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    setUser(generateMockUser());
    setWeather(generateMockWeather('BLR'));
  }, []);

  if (!user) {
    return (
      <div style={{ padding: '40px' }}>
        <div className="skeleton" style={{ width: '200px', height: '24px', marginBottom: '32px' }}></div>
        <div className="grid-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '120px' }}></div>)}
        </div>
      </div>
    );
  }

  const activePlan = PLANS.find(p => p.id === user.activePlan);

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Good morning, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-muted text-sm mt-2">Your income is protected this week. Here's your overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="live-dot"></div>
          <span className="text-sm text-muted">Coverage Active</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6">
        {[
          { label: 'Wallet Balance', value: `₹${user.walletBalance.toLocaleString()}`, change: '+₹975 this week', color: 'var(--accent-success)', positive: true },
          { label: 'Active Plan', value: activePlan?.name, change: `₹${activePlan?.weeklyPremium}/week`, color: 'var(--accent-primary)' },
          { label: 'Total Payouts', value: `₹${user.totalPayoutsReceived.toLocaleString()}`, change: `${user.claimHistory.length} claims paid`, color: 'var(--accent-secondary)' },
          { label: 'Coverage Left', value: `₹${(activePlan?.coverageLimit - 975).toLocaleString()}`, change: `of ₹${activePlan?.coverageLimit.toLocaleString()} this week`, color: 'var(--accent-warning)' },
        ].map((stat, i) => (
          <div key={i} className="card animate-fade-in" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
            <div className="stat-card">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value" style={{ color: stat.color }}>{stat.value}</span>
              <span className="stat-change text-muted">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Weather + Active Policy */}
      <div className="grid-2 mb-6">
        {/* Weather */}
        <div className="card card-glow">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Live Conditions — {user.zone}</h3>
            <span className="badge badge-success">
              <span className="live-dot" style={{ width: '6px', height: '6px' }}></span>
              Live
            </span>
          </div>
          {weather && (
            <div className="grid-2" style={{ gap: '16px' }}>
              <div>
                <div className="text-muted text-xs">Temperature</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{weather.temperature}°C</div>
              </div>
              <div>
                <div className="text-muted text-xs">Precipitation</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{weather.precipitation} mm/hr</div>
              </div>
              <div>
                <div className="text-muted text-xs">AQI</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{weather.aqi}</div>
              </div>
              <div>
                <div className="text-muted text-xs">Condition</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{weather.condition}</div>
              </div>
            </div>
          )}
          <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem' }}>
            <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>✓ No triggers active</span>
            <span className="text-muted"> — All parameters within safe thresholds</span>
          </div>
        </div>

        {/* Active Policy */}
        <div className="card">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '16px' }}>Active Policy</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Plan', value: activePlan?.name },
              { label: 'Week', value: 'Apr 14–20, 2026' },
              { label: 'Premium Paid', value: `₹${activePlan?.weeklyPremium}` },
              { label: 'Coverage', value: `${activePlan?.coveragePercent}% of daily income` },
              { label: 'Max Payout', value: `₹${activePlan?.coverageLimit.toLocaleString()}/week` },
            ].map((r, i) => (
              <div key={i} className="flex justify-between" style={{ padding: '4px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.8125rem' }}>
                <span className="text-muted">{r.label}</span>
                <span style={{ fontWeight: 600 }}>{r.value}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px' }}>
            <div className="text-xs text-muted mb-2">Coverage Used This Week</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '32%' }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted">
              <span>₹975 used</span>
              <span>₹{activePlan?.coverageLimit.toLocaleString()} limit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payouts */}
      <div className="card">
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '16px' }}>Recent Payouts</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Trigger</th>
                <th>Amount</th>
                <th>Fraud Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {user.claimHistory.map((claim, i) => {
                const trigger = TRIGGER_TYPES.find(t => t.id === claim.trigger);
                return (
                  <tr key={i}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>{claim.date}</td>
                    <td>
                      <span className="flex items-center gap-2">
                        <span>{trigger?.icon}</span>
                        <span>{trigger?.name}</span>
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-success)' }}>+₹{claim.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${claim.fraudScore < 0.2 ? 'badge-success' : claim.fraudScore < 0.5 ? 'badge-warning' : 'badge-danger'}`}>
                        {claim.fraudScore.toFixed(2)}
                      </span>
                    </td>
                    <td><span className="badge badge-success">Paid ✓</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
