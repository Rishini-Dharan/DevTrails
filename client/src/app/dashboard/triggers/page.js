"use client";
import { useState } from 'react';
import { Play, Siren, CheckCircle, Cpu, CloudRain, ThermometerSun, Wind, AlertTriangle, Zap, CreditCard } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import PayoutReceipt from '../../components/PayoutReceipt';

const TRIGGER_OPTIONS = [
  { type: 'TRG-RAIN', label: 'Heavy Rainfall', icon: CloudRain, color: 'blue', desc: 'Cloudburst >30mm/hr • 4hr duration', iconColor: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/30' },
  { type: 'TRG-HEAT', label: 'Extreme Heat', icon: ThermometerSun, color: 'orange', desc: 'Temperature >44°C • Heatwave alert', iconColor: 'text-orange-400', bgColor: 'bg-orange-500/10 border-orange-500/30' },
  { type: 'TRG-AQI', label: 'Severe AQI', icon: Wind, color: 'purple', desc: 'AQI >400 • Hazardous air quality', iconColor: 'text-purple-400', bgColor: 'bg-purple-500/10 border-purple-500/30' },
  { type: 'TRG-FLOOD', label: 'Urban Flooding', icon: CloudRain, color: 'cyan', desc: 'Waterlogged roads • Areas submerged', iconColor: 'text-cyan-400', bgColor: 'bg-cyan-500/10 border-cyan-500/30' },
  { type: 'TRG-CURFEW', label: 'Curfew / Bandh', icon: AlertTriangle, color: 'red', desc: 'Section 144 • Area lockdown', iconColor: 'text-red-400', bgColor: 'bg-red-500/10 border-red-500/30' },
  { type: 'TRG-PLATFORM', label: 'Platform Outage', icon: Zap, color: 'yellow', desc: 'App server down • Orders halted', iconColor: 'text-yellow-400', bgColor: 'bg-yellow-500/10 border-yellow-500/30' },
];

export default function DemoSimulate() {
  const [selectedTrigger, setSelectedTrigger] = useState(TRIGGER_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const logEvent = (msg) => {
    setEventLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 15));
  };

  const handleSimulate = async () => {
    setLoading(true);
    setResult(null);
    setEventLog([]);
    
    logEvent(`SYSTEM_TEST: Initiating ${selectedTrigger.label} simulation`);
    await new Promise(r => setTimeout(r, 800));
    
    logEvent(`SENSOR_API: Detected ${selectedTrigger.label.toLowerCase()} anomaly pattern`);
    await new Promise(r => setTimeout(r, 800));

    logEvent(`THRESHOLD: ${selectedTrigger.label} (${selectedTrigger.type}) parameter exceeded`);
    await new Promise(r => setTimeout(r, 600));

    logEvent("ORCHESTRATOR: Scanning active policies in Andheri West/Mumbai");
    await new Promise(r => setTimeout(r, 1000));

    logEvent("ML_ENGINE: Running Advanced Fraud Check (MSVS v2.0 + GPS + History + Weather)...");
    
    try {
      const res = await axios.post('http://localhost:5000/api/triggers/simulate', {
        type: selectedTrigger.type,
        zone: 'andheri west',
        city: 'mumbai',
        durationHours: 4
      });

      if (res.data.payoutsCreated > 0) {
        logEvent(`FRAUD_ENGINE: ${res.data.paidInstantly || 0} green-tier (auto-approved), ${res.data.pendingReview || 0} amber-tier (held), ${res.data.rejected || 0} red-tier (blocked)`);
        logEvent(`RAZORPAY_GATEWAY: Processing UPI payout via test mode...`);
        await new Promise(r => setTimeout(r, 500));
        logEvent(`PAYOUT_GATEWAY: Total ₹${res.data.totalAmount} dispatched via UPI`);
        
        // Log transaction IDs
        res.data.payouts?.forEach(p => {
          if (p.transactionId) {
            logEvent(`TXN_CONFIRM: ${p.transactionId} • ₹${p.amount} → ${p.upiId} [${p.status.toUpperCase()}]`);
          }
        });
      } else {
        logEvent("ORCHESTRATOR: No active policies found in zone — no payouts generated");
      }

      setResult(res.data);
    } catch (e) {
      logEvent("CRITICAL_ERROR: Failed to contact orchestrator " + e.message);
    }
    
    setLoading(false);
  };

  const handleReceiptClick = (payout) => {
    setSelectedReceipt({
      amount: payout.amount,
      status: payout.status,
      transactionId: payout.transactionId || 'PENDING',
      upiRef: payout.upiRef,
      upiId: payout.upiId,
      paidAt: payout.paidAt,
      reason: payout.reason,
      fraudTier: payout.fraudTier,
      fraudScore: payout.fraudScore,
    });
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Cpu className="w-5 h-5 text-accent" /> Demo Sandbox
          </h1>
          <p className="text-sm text-gray-400">Trigger parametric conditions</p>
        </div>
        <Link href="/dashboard" className="text-xs bg-white/10 px-3 py-1 rounded-full">Back</Link>
      </div>

      {/* Trigger Type Selector */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {TRIGGER_OPTIONS.map(t => {
          const Icon = t.icon;
          const isSelected = selectedTrigger.type === t.type;
          return (
            <button
              key={t.type}
              onClick={() => setSelectedTrigger(t)}
              className={`p-3 rounded-lg border text-center transition-all ${
                isSelected 
                  ? `${t.bgColor} border-opacity-100 scale-[1.02]` 
                  : 'bg-white/3 border-white/10 opacity-60 hover:opacity-80'
              }`}
            >
              <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? t.iconColor : 'text-gray-500'}`} />
              <p className="text-[10px] font-bold leading-tight">{t.label}</p>
            </button>
          );
        })}
      </div>

      {/* Trigger Card */}
      <div className={`glass-card p-6 ${selectedTrigger.bgColor} mb-6 text-center`}>
        <Siren className={`w-12 h-12 ${selectedTrigger.iconColor} mx-auto mb-3 ${loading ? 'animate-pulse' : ''}`} />
        <h2 className="text-lg font-bold">{selectedTrigger.label} Warning</h2>
        <p className="text-xs font-mono text-gray-400 mt-2 mb-4 bg-black/40 p-2 rounded">
          Andheri West • {selectedTrigger.desc}
        </p>

        <button 
          onClick={handleSimulate} 
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 disabled:opacity-50 transition-colors"
        >
          {loading ? <span className="animate-spin">⧗</span> : <Play className="w-5 h-5"/>}
          {loading ? 'Executing...' : `Trigger ${selectedTrigger.label} Now`}
        </button>
      </div>

      {/* Kernel Logs */}
      <div className="glass-card p-4 font-mono text-[10px] sm:text-xs">
        <h3 className="text-primary font-bold mb-2 flex items-center gap-2">
           GigShield Kernel Logs
        </h3>
        <div className="h-48 overflow-y-auto bg-black/50 p-3 rounded border border-white/5 space-y-1">
          {eventLog.map((log, i) => (
            <div key={i} className={`${
              log.includes('CRITICAL') ? 'text-red-400' : 
              log.includes('PAYOUT') || log.includes('TXN_CONFIRM') ? 'text-green-400' : 
              log.includes('FRAUD') ? 'text-amber-400' :
              log.includes('RAZORPAY') ? 'text-blue-400' :
              'text-gray-300'
            }`}>
              <span className="opacity-50 text-gray-500">{'>'}</span> {log}
            </div>
          ))}
          {eventLog.length === 0 && <span className="text-gray-600 italic">Select a trigger type and fire it to see kernel logs...</span>}
        </div>
      </div>

      {/* Live Payout Feed */}
      {result && result.payouts && result.payouts.length > 0 && (
        <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-green-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Live Payout Feed
          </h3>
          {result.payouts.map(p => (
            <div
              key={p.id}
              onClick={() => handleReceiptClick(p)}
              className={`glass-card p-3 flex justify-between items-center border-l-4 text-sm cursor-pointer hover:bg-white/5 transition-colors ${
                p.status === 'paid' ? 'border-l-green-500' : p.status === 'pending' ? 'border-l-amber-400' : 'border-l-red-500'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  {p.transactionId ? <CreditCard className="w-3 h-3 text-green-400" /> : null}
                  <span className="font-mono text-xs">{p.upiId}</span>
                </div>
                <p className="text-[10px] text-gray-400">
                  {p.transactionId && <span className="text-primary">{p.transactionId} • </span>}
                  Policy: {p.policyId?.substring(0,8)}
                </p>
                <p className={`text-[10px] mt-1 ${
                  p.fraudTier === 'green' ? 'text-green-400' : p.fraudTier === 'amber' ? 'text-amber-400' : 'text-red-400'
                }`}>
                  MSVS: {p.fraudTier?.toUpperCase()} ({p.fraudScore?.toFixed(3)})
                </p>
              </div>
              <div className="text-right">
                <span className={`font-bold ${p.status === 'paid' ? 'text-green-400' : p.status === 'pending' ? 'text-amber-400' : 'text-red-400'}`}>
                  {p.status === 'paid' ? '+' : ''}₹{p.amount}
                </span>
                <br/>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  p.status === 'paid' ? 'bg-green-500/20 text-green-400' : 
                  p.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 
                  'bg-red-500/20 text-red-400'
                }`}>{p.status}</span>
              </div>
            </div>
          ))}
          
          {/* Summary */}
          <div className="glass-card p-3 text-xs text-gray-400 flex justify-between font-mono">
            <span>Paid: {result.paidInstantly || 0} | Held: {result.pendingReview || 0} | Blocked: {result.rejected || 0}</span>
            <span className="text-green-400 font-bold">Total: ₹{result.totalAmount}</span>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <PayoutReceipt receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
}
