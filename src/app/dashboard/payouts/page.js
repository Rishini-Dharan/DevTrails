'use client';
import { useState, useEffect } from 'react';
import { generateMockUser, TRIGGER_TYPES } from '../../../core/data';

export default function PayoutsPage() {
  const [user, setUser] = useState(null);
  useEffect(() => setUser(generateMockUser()), []);
  if (!user) return null;

  const totalPaid = user.claimHistory.reduce((s, c) => s + c.amount, 0);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Payout History</h1>
      </div>

      <div className="grid-3 mb-6">
        <div className="card">
          <div className="stat-card">
            <span className="stat-label">Total Received</span>
            <span className="stat-value text-success">₹{totalPaid.toLocaleString()}</span>
          </div>
        </div>
        <div className="card">
          <div className="stat-card">
            <span className="stat-label">Claims Paid</span>
            <span className="stat-value">{user.claimHistory.length}</span>
          </div>
        </div>
        <div className="card">
          <div className="stat-card">
            <span className="stat-label">Avg Payout</span>
            <span className="stat-value">₹{Math.round(totalPaid / user.claimHistory.length).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Date</th>
                <th>Disruption</th>
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
                    <td className="font-mono text-sm">{claim.id}</td>
                    <td className="font-mono text-sm">{claim.date}</td>
                    <td className="flex items-center gap-2">
                      <span>{trigger?.icon}</span>
                      <span>{trigger?.name}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-success)' }}>+₹{claim.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${claim.fraudScore < 0.2 ? 'badge-success' : 'badge-warning'}`}>
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
