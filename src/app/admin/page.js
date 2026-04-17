'use client';
import { useState, useEffect } from 'react';
import { generateAdminStats, TRIGGER_TYPES } from '../../core/data';

export default function AdminPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats(generateAdminStats());
    const interval = setInterval(() => setStats(generateAdminStats()), 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div>
        <div className="skeleton" style={{ width: '200px', height: '28px', marginBottom: '32px' }}></div>
        <div className="grid-4 mb-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '120px' }}></div>)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Platform Analytics</h1>
          <p className="text-muted text-sm mt-2">Real-time overview of the Lattice Protocol network</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="live-dot"></span>
          <span className="text-sm text-muted">Live Dashboard</span>
        </div>
      </div>

      {/* Top-level KPIs */}
      <div className="grid-4 mb-6">
        {[
          { label: 'Total Workers', value: stats.totalUsers.toLocaleString(), change: '+342 this week', color: 'var(--accent-primary)' },
          { label: 'Active This Week', value: stats.activeThisWeek.toLocaleString(), change: `${Math.round(stats.activeThisWeek / stats.totalUsers * 100)}% retention`, color: 'var(--accent-secondary)' },
          { label: 'Revenue (Month)', value: `₹${(stats.revenueThisMonth / 100000).toFixed(1)}L`, change: 'Premium income', color: 'var(--accent-success)' },
          { label: 'Total Payouts', value: `₹${(stats.totalPayouts / 100000).toFixed(1)}L`, change: `Claim ratio: ${(stats.claimRatio * 100).toFixed(0)}%`, color: 'var(--accent-warning)' },
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

      {/* Zone Risk Heatmap + Trigger Breakdown */}
      <div className="grid-2 mb-6">
        {/* Zone Heatmap */}
        <div className="card">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '16px' }}>Zone Risk Monitor</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stats.zoneHeatmap.map((zone, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '6px' }}>{zone.zone}</div>
                  <div className="progress-bar" style={{ height: '4px' }}>
                    <div style={{
                      height: '100%', borderRadius: 'var(--radius-full)',
                      width: `${zone.risk * 100}%`,
                      background: zone.risk > 0.7 ? 'var(--accent-danger)' : zone.risk > 0.4 ? 'var(--accent-warning)' : 'var(--accent-success)',
                      transition: 'width 0.5s ease',
                    }}></div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: '80px' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{Math.round(zone.risk * 100)}%</div>
                  <div className="text-xs text-muted">{zone.activeNodes} nodes</div>
                </div>
                <span className={`badge ${zone.status === 'critical' ? 'badge-danger' : zone.status === 'high' ? 'badge-warning' : zone.status === 'moderate' ? 'badge-info' : 'badge-success'}`}>
                  {zone.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trigger Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '16px' }}>Trigger Breakdown (All Time)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.topTriggers.map((t, i) => {
              const trigger = TRIGGER_TYPES.find(tr => tr.id === t.type);
              const maxCount = Math.max(...stats.topTriggers.map(x => x.count));
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span>{trigger?.icon}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{trigger?.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono">{t.count} fires</span>
                      <span className="text-sm text-success font-mono">₹{(t.totalPayout / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <div className="progress-bar" style={{ height: '4px' }}>
                    <div className="progress-fill" style={{ width: `${(t.count / maxCount) * 100}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Payouts Feed */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Live Payout Feed</h3>
          <span className="badge badge-info">{stats.triggersFiredToday} triggers today</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Payout ID</th>
                <th>Worker</th>
                <th>Zone</th>
                <th>Trigger</th>
                <th>Amount</th>
                <th>Fraud Score</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentPayouts.map((p, i) => {
                const trigger = TRIGGER_TYPES.find(t => t.id === p.trigger);
                return (
                  <tr key={i}>
                    <td className="font-mono text-sm">{p.id}</td>
                    <td style={{ fontWeight: 500 }}>{p.user}</td>
                    <td className="text-sm text-muted">{p.zone}</td>
                    <td>
                      <span className="flex items-center gap-2">
                        <span>{trigger?.icon}</span>
                        <span className="text-sm">{trigger?.name}</span>
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-success)' }}>₹{p.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${p.fraudScore < 0.15 ? 'badge-success' : p.fraudScore < 0.5 ? 'badge-warning' : 'badge-danger'}`}>
                        {p.fraudScore.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-sm text-muted">{p.time}</td>
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
