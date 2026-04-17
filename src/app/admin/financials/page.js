'use client';

export default function FinancialsPage() {
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const revenue =  [82000, 124000, 198000, 312000, 425000, 527340];
  const payouts =  [45000, 78000, 132000, 198000, 287000, 385000];
  const users =    [1200, 2800, 5100, 7600, 10200, 12847];
  const maxRev = Math.max(...revenue);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>📈 Financial Projections</h1>
          <p className="text-muted text-sm mt-2">Revenue, loss ratio, and unit economics analysis</p>
        </div>
        <span className="badge badge-success" style={{ padding: '6px 16px' }}>Break-even at 50K policies</span>
      </div>

      {/* KPIs */}
      <div className="grid-4 mb-6">
        {[
          { label: 'Monthly Revenue', value: '₹5.27L', sub: '+24% MoM', color: 'var(--accent-success)' },
          { label: 'Loss Ratio', value: '62%', sub: 'Target: 55-65%', color: 'var(--accent-secondary)' },
          { label: 'ARPU', value: '₹59/wk', sub: 'Per active worker', color: 'var(--accent-primary)' },
          { label: 'Runway', value: '18 mo', sub: 'At current burn rate', color: 'var(--accent-warning)' },
        ].map((s, i) => (
          <div key={i} className="card">
            <div className="stat-card">
              <span className="stat-label">{s.label}</span>
              <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
              <span className="stat-change text-muted">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue vs Payouts Chart (CSS-only bar chart) */}
      <div className="grid-2 mb-6">
        <div className="card">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '24px' }}>Revenue vs Payouts (6 Months)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '220px', padding: '0 8px' }}>
            {months.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', display: 'flex', gap: '3px', alignItems: 'flex-end', justifyContent: 'center' }}>
                  {/* Revenue bar */}
                  <div style={{
                    width: '45%', background: 'var(--accent-primary)',
                    height: `${(revenue[i] / maxRev) * 180}px`,
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.5s ease',
                    opacity: 0.8,
                  }}></div>
                  {/* Payout bar */}
                  <div style={{
                    width: '45%', background: 'var(--accent-danger)',
                    height: `${(payouts[i] / maxRev) * 180}px`,
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.5s ease',
                    opacity: 0.6,
                  }}></div>
                </div>
                <span className="text-xs text-muted">{m}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-6 mt-4 justify-between">
            <div className="flex items-center gap-2 text-xs">
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent-primary)', opacity: 0.8 }}></div>
              <span className="text-muted">Premium Revenue</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent-danger)', opacity: 0.6 }}></div>
              <span className="text-muted">Claim Payouts</span>
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className="card">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '24px' }}>User Growth</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '220px', padding: '0 8px' }}>
            {months.map((m, i) => {
              const maxU = Math.max(...users);
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <span className="text-xs font-mono" style={{ color: 'var(--accent-success)' }}>
                    {(users[i] / 1000).toFixed(1)}K
                  </span>
                  <div style={{
                    width: '70%',
                    background: 'linear-gradient(to top, var(--accent-success), rgba(16, 185, 129, 0.3))',
                    height: `${(users[i] / maxU) * 170}px`,
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.5s ease',
                  }}></div>
                  <span className="text-xs text-muted">{m}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Unit Economics */}
      <div className="card mb-6">
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '16px' }}>Unit Economics</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Current</th>
                <th>Target (6 mo)</th>
                <th>At Scale (50K)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Avg Premium ARPU', current: '₹59/wk', target: '₹65/wk', scale: '₹62/wk', status: 'on-track' },
                { metric: 'Loss Ratio', current: '62%', target: '58%', scale: '55%', status: 'on-track' },
                { metric: 'Fraud Savings (AI)', current: '12%', target: '15%', scale: '18%', status: 'on-track' },
                { metric: 'CAC (Customer Acq.)', current: '₹45', target: '₹30', scale: '₹15', status: 'improving' },
                { metric: 'LTV (6-month)', current: '₹1,416', target: '₹1,560', scale: '₹1,488', status: 'on-track' },
                { metric: 'LTV/CAC Ratio', current: '31.5x', target: '52x', scale: '99x', status: 'strong' },
                { metric: 'Weekly Churn', current: '8%', target: '5%', scale: '3%', status: 'improving' },
                { metric: 'Monthly Burn', current: '₹2.1L', target: '₹3.5L', scale: '₹8L', status: 'on-track' },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{r.metric}</td>
                  <td className="font-mono">{r.current}</td>
                  <td className="font-mono text-muted">{r.target}</td>
                  <td className="font-mono">{r.scale}</td>
                  <td>
                    <span className={`badge ${r.status === 'strong' ? 'badge-success' : r.status === 'on-track' ? 'badge-info' : 'badge-warning'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Model */}
      <div className="card card-glow">
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '12px' }}>💰 Revenue Streams</h3>
        <div className="grid-3">
          {[
            { name: 'Premium Income', share: '78%', desc: 'Weekly premium payments from workers', amount: '₹4.1L/mo' },
            { name: 'Data Insights', share: '15%', desc: 'Anonymised disruption data licensing to platforms', amount: '₹79K/mo' },
            { name: 'API Partnerships', share: '7%', desc: 'White-label risk scoring for logistics companies', amount: '₹37K/mo' },
          ].map((r, i) => (
            <div key={i} style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
              <div className="flex justify-between items-center mb-2">
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{r.name}</span>
                <span className="badge badge-primary">{r.share}</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-success)', marginBottom: '4px' }}>{r.amount}</div>
              <div className="text-xs text-muted">{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
