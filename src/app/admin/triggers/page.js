'use client';
import { useState, useEffect } from 'react';
import { TRIGGER_TYPES, CITIES, generateMockWeather } from '../../../core/data';

export default function TriggerMonitorPage() {
  const [activeTriggers, setActiveTriggers] = useState([]);
  const [triggerLog, setTriggerLog] = useState([]);

  useEffect(() => {
    // Simulate real trigger evaluations
    const evaluate = () => {
      const active = [];
      const log = [];

      CITIES.forEach(city => {
        const w = generateMockWeather(city.id);
        city.zones.forEach(zone => {
          if (w.precipitation > 30) {
            const entry = {
              id: `EVT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
              trigger: 'TRG-RAIN',
              city: city.name,
              zone,
              value: `${w.precipitation} mm/hr`,
              threshold: '> 30 mm/hr',
              status: 'ACTIVE',
              timestamp: new Date().toLocaleTimeString(),
              affectedWorkers: Math.floor(Math.random() * 200 + 50),
            };
            active.push(entry);
            log.push(entry);
          }
          if (w.temperature > 44) {
            const entry = {
              id: `EVT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
              trigger: 'TRG-HEAT',
              city: city.name,
              zone,
              value: `${w.temperature}°C`,
              threshold: '> 44°C',
              status: 'ACTIVE',
              timestamp: new Date().toLocaleTimeString(),
              affectedWorkers: Math.floor(Math.random() * 150 + 30),
            };
            active.push(entry);
            log.push(entry);
          }
          if (w.aqi > 400) {
            const entry = {
              id: `EVT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
              trigger: 'TRG-AQI',
              city: city.name,
              zone,
              value: `AQI ${w.aqi}`,
              threshold: '> 400',
              status: 'ACTIVE',
              timestamp: new Date().toLocaleTimeString(),
              affectedWorkers: Math.floor(Math.random() * 180 + 40),
            };
            active.push(entry);
            log.push(entry);
          }
        });
      });

      // Add some resolved entries for realism
      log.push(
        { id: 'EVT-R1Z4K9', trigger: 'TRG-RAIN', city: 'Mumbai', zone: 'Bandra', value: '42 mm/hr', threshold: '> 30 mm/hr', status: 'RESOLVED', timestamp: '11:23 AM', affectedWorkers: 187, payoutTotal: 92350 },
        { id: 'EVT-H8M2P1', trigger: 'TRG-HEAT', city: 'Delhi NCR', zone: 'Dwarka', value: '46°C', threshold: '> 44°C', status: 'RESOLVED', timestamp: '10:45 AM', affectedWorkers: 134, payoutTotal: 67000 },
        { id: 'EVT-A3N7Q6', trigger: 'TRG-AQI', city: 'Delhi NCR', zone: 'Rohini', value: 'AQI 452', threshold: '> 400', status: 'RESOLVED', timestamp: '09:30 AM', affectedWorkers: 92, payoutTotal: 41400 },
      );

      setActiveTriggers(active);
      setTriggerLog(log);
    };

    evaluate();
    const interval = setInterval(evaluate, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Trigger Monitor</h1>
          <p className="text-muted text-sm mt-2">Real-time parametric trigger evaluation engine</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="badge badge-danger" style={{ fontSize: '0.8125rem', padding: '4px 12px' }}>
            {activeTriggers.length} Active Triggers
          </span>
          <div className="flex items-center gap-2">
            <span className="live-dot"></span>
            <span className="text-sm text-muted">Polling every 10s</span>
          </div>
        </div>
      </div>

      {/* Active Triggers */}
      {activeTriggers.length > 0 && (
        <div className="mb-6">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-danger)' }}>
            🔴 Active Triggers
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeTriggers.slice(0, 8).map((t, i) => {
              const trigger = TRIGGER_TYPES.find(tr => tr.id === t.trigger);
              return (
                <div key={i} className="card" style={{
                  background: 'var(--accent-danger-glow)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 20px',
                  animation: `fadeIn 0.3s ease-out ${i * 0.05}s forwards`,
                  opacity: 0,
                }}>
                  <div className="flex items-center gap-4">
                    <span style={{ fontSize: '1.5rem' }}>{trigger?.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                        {trigger?.name} — {t.zone}, {t.city}
                      </div>
                      <div className="text-sm text-muted font-mono">
                        Measured: <span className="text-danger">{t.value}</span> | Threshold: {t.threshold}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>{t.affectedWorkers} workers</div>
                    <div className="text-xs text-muted">{t.timestamp}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trigger Evaluation Pipeline */}
      <div className="card card-glow mb-6">
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '16px' }}>Evaluation Pipeline</h3>
        <div className="flex gap-4" style={{ overflowX: 'auto' }}>
          {[
            { step: '1', name: 'Data Ingestion', detail: 'Weather, AQI, News APIs', status: 'active' },
            { step: '2', name: 'Normalization', detail: 'Zone-level aggregation', status: 'active' },
            { step: '3', name: 'Threshold Engine', detail: 'Compare against rules', status: 'active' },
            { step: '4', name: 'Geo-Fence Match', detail: 'Identify affected workers', status: 'active' },
            { step: '5', name: 'Fraud Detection', detail: 'Isolation Forest scoring', status: 'active' },
            { step: '6', name: 'Payout Calc', detail: 'Formula × plan tier', status: 'active' },
            { step: '7', name: 'UPI Disbursement', detail: 'Razorpay → worker wallet', status: 'active' },
          ].map((s, i) => (
            <div key={i} style={{
              minWidth: '140px', textAlign: 'center',
              padding: '16px 12px', background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)', position: 'relative',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: 'var(--radius-full)',
                background: 'var(--accent-primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, margin: '0 auto 8px'
              }}>{s.step}</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>{s.name}</div>
              <div className="text-xs text-muted">{s.detail}</div>
              {i < 6 && (
                <div style={{
                  position: 'absolute', right: '-16px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--accent-primary)', fontSize: '1.25rem', fontWeight: 700
                }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trigger Event Log */}
      <div className="card">
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '16px' }}>Trigger Event Log</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Trigger</th>
                <th>Location</th>
                <th>Value</th>
                <th>Workers</th>
                <th>Payouts</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {triggerLog.map((t, i) => {
                const trigger = TRIGGER_TYPES.find(tr => tr.id === t.trigger);
                return (
                  <tr key={i}>
                    <td className="font-mono text-sm">{t.id}</td>
                    <td>
                      <span className="flex items-center gap-2">
                        <span>{trigger?.icon}</span>
                        <span className="text-sm">{trigger?.name}</span>
                      </span>
                    </td>
                    <td className="text-sm">{t.zone}, {t.city}</td>
                    <td className="font-mono text-sm" style={{ color: 'var(--accent-danger)' }}>{t.value}</td>
                    <td>{t.affectedWorkers}</td>
                    <td className="text-success font-mono text-sm">
                      {t.payoutTotal ? `₹${t.payoutTotal.toLocaleString()}` : 'Processing...'}
                    </td>
                    <td>
                      <span className={`badge ${t.status === 'ACTIVE' ? 'badge-danger' : 'badge-success'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="text-sm text-muted">{t.timestamp}</td>
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
