'use client';
import { useState, useEffect, useRef } from 'react';
import { TRIGGER_TYPES, CITIES } from '../../../core/data';

export default function SimulationPage() {
  const [selectedTrigger, setSelectedTrigger] = useState('TRG-RAIN');
  const [selectedCity, setSelectedCity] = useState('MUM');
  const [selectedZone, setSelectedZone] = useState('Andheri');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const intervalRef = useRef(null);

  const city = CITIES.find(c => c.id === selectedCity);
  const trigger = TRIGGER_TYPES.find(t => t.id === selectedTrigger);

  const PIPELINE_STEPS = [
    { name: 'Data Ingestion', icon: '📡', duration: 800 },
    { name: 'Normalization', icon: '🔄', duration: 600 },
    { name: 'Threshold Engine', icon: '⚡', duration: 400 },
    { name: 'Geo-Fence Match', icon: '📍', duration: 1000 },
    { name: 'Fraud Detection (AI)', icon: '🛡️', duration: 2500 },
    { name: 'Payout Calculation', icon: '🧮', duration: 600 },
    { name: 'UPI Disbursement', icon: '💸', duration: 1500 },
  ];

  const runSimulation = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setResult(null);
    setNotifications([]);

    // Animate through pipeline steps
    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, PIPELINE_STEPS[i].duration));
    }

    // Call API
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trigger: selectedTrigger,
          city: city?.name,
          zone: selectedZone,
          severity: 'high',
        }),
      });
      const data = await res.json();
      setResult(data);
      setCurrentStep(PIPELINE_STEPS.length);

      // Fire off payout notifications one by one
      const workerNames = ['Ramesh K.', 'Priya S.', 'Arun D.', 'Sunil P.', 'Meena R.', 'Vijay M.', 'Anita G.', 'Deepak T.'];
      for (let i = 0; i < Math.min(workerNames.length, 6); i++) {
        await new Promise(r => setTimeout(r, 800));
        const amt = Math.floor(Math.random() * 600 + 300);
        setNotifications(prev => [{
          id: Date.now(),
          worker: workerNames[i],
          amount: amt,
          time: new Date().toLocaleTimeString(),
        }, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }

    setIsRunning(false);
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>🎯 Live Trigger Simulation</h1>
          <p className="text-muted text-sm mt-2">
            Run the complete detection → fraud check → payout pipeline in real-time
          </p>
        </div>
        <span className="badge badge-warning" style={{ padding: '6px 16px', fontSize: '0.8125rem' }}>
          Demo Mode
        </span>
      </div>

      {/* Configuration */}
      <div className="grid-3 mb-6">
        <div className="card">
          <label className="stat-label mb-2" style={{ display: 'block' }}>Disruption Type</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {TRIGGER_TYPES.slice(0, 5).map(t => (
              <button
                key={t.id}
                onClick={() => !isRunning && setSelectedTrigger(t.id)}
                className="card"
                style={{
                  padding: '10px 14px', cursor: isRunning ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  border: selectedTrigger === t.id ? '2px solid var(--accent-primary)' : undefined,
                  background: selectedTrigger === t.id ? 'var(--accent-primary-glow)' : undefined,
                  opacity: isRunning ? 0.5 : 1,
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{t.icon}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <label className="stat-label mb-2" style={{ display: 'block' }}>City</label>
          <select
            className="input mb-4"
            value={selectedCity}
            onChange={e => { setSelectedCity(e.target.value); setSelectedZone(CITIES.find(c => c.id === e.target.value)?.zones[0]); }}
            disabled={isRunning}
          >
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <label className="stat-label mb-2" style={{ display: 'block' }}>Zone</label>
          <select
            className="input"
            value={selectedZone}
            onChange={e => setSelectedZone(e.target.value)}
            disabled={isRunning}
          >
            {city?.zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>

          <button
            className="btn btn-primary btn-full btn-lg mt-6"
            onClick={runSimulation}
            disabled={isRunning}
            style={{
              background: isRunning ? 'var(--bg-elevated)' : undefined,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isRunning ? 'Pipeline Running...' : `⚡ Inject ${trigger?.name}`}
            {isRunning && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, height: '3px',
                background: 'var(--gradient-hero)',
                animation: 'shimmer 1.5s infinite',
                width: '100%',
              }}></div>
            )}
          </button>
        </div>

        {/* Live Payout Feed */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <span className="stat-label">Live Payout Feed</span>
            {notifications.length > 0 && <span className="live-dot"></span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '340px', overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <p className="text-muted text-sm" style={{ textAlign: 'center', padding: '40px 0' }}>
                Run a simulation to see payouts
              </p>
            ) : (
              notifications.map((n, i) => (
                <div key={n.id} className="animate-slide-up" style={{
                  padding: '10px 14px', background: 'var(--accent-success-glow)',
                  borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-success)',
                  animationDuration: '0.3s',
                }}>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{n.worker}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--accent-success)' }}>
                      +₹{n.amount}
                    </span>
                  </div>
                  <div className="text-xs text-muted mt-1">
                    UPI disbursed · {n.time}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="card card-glow mb-6">
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '20px' }}>Evaluation Pipeline</h3>
        <div className="flex gap-2" style={{ overflowX: 'auto', alignItems: 'stretch' }}>
          {PIPELINE_STEPS.map((step, i) => {
            const status = currentStep > i ? 'done' : currentStep === i ? 'active' : 'pending';
            return (
              <div key={i} style={{ position: 'relative', flex: 1, minWidth: '130px' }}>
                <div style={{
                  padding: '16px 12px', textAlign: 'center',
                  background: status === 'done' ? 'var(--accent-success-glow)' : 
                              status === 'active' ? 'var(--accent-primary-glow)' : 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: status === 'active' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  transition: 'all 0.4s ease',
                  height: '100%',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
                    {status === 'done' ? '✅' : step.icon}
                  </div>
                  <div style={{
                    fontSize: '0.75rem', fontWeight: 600,
                    color: status === 'active' ? 'var(--accent-primary)' : status === 'done' ? 'var(--accent-success)' : 'var(--text-muted)',
                  }}>{step.name}</div>
                  <div className="text-xs text-muted mt-1">{step.duration}ms</div>
                  {status === 'active' && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: '10%', width: '80%', height: '2px',
                      background: 'var(--accent-primary)',
                      animation: 'shimmer 1s infinite',
                      borderRadius: 'var(--radius-full)',
                    }}></div>
                  )}
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)',
                    color: status === 'done' ? 'var(--accent-success)' : 'var(--text-muted)',
                    fontSize: '1rem', fontWeight: 700, zIndex: 2,
                  }}>→</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="animate-slide-up">
          <div className="grid-4 mb-6">
            <div className="card" style={{ borderTop: '3px solid var(--accent-primary)' }}>
              <div className="stat-card">
                <span className="stat-label">Pipeline Duration</span>
                <span className="stat-value" style={{ fontSize: '1.5rem' }}>{result.summary.totalDuration}</span>
              </div>
            </div>
            <div className="card" style={{ borderTop: '3px solid var(--accent-secondary)' }}>
              <div className="stat-card">
                <span className="stat-label">Workers Affected</span>
                <span className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--accent-secondary)' }}>
                  {result.summary.affectedWorkers}
                </span>
              </div>
            </div>
            <div className="card" style={{ borderTop: '3px solid var(--accent-success)' }}>
              <div className="stat-card">
                <span className="stat-label">Payouts Approved</span>
                <span className="stat-value text-success" style={{ fontSize: '1.5rem' }}>
                  {result.summary.approvedPayouts}
                </span>
              </div>
            </div>
            <div className="card" style={{ borderTop: '3px solid var(--accent-warning)' }}>
              <div className="stat-card">
                <span className="stat-label">Total Disbursed</span>
                <span className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--accent-warning)' }}>
                  ₹{result.summary.totalPayoutAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '12px' }}>Pipeline Execution Log</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Step</th><th>Name</th><th>Duration</th><th>Detail</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {result.pipeline.map((p, i) => (
                    <tr key={i}>
                      <td className="font-mono">{p.step}</td>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td className="font-mono text-sm">{p.duration}ms</td>
                      <td className="text-sm text-muted">{p.detail}</td>
                      <td><span className="badge badge-success">✅ {p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
