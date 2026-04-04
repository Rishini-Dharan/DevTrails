"use client";
import { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, XCircle, Eye, ArrowLeft, RefreshCw, Fingerprint, MapPin, Clock } from 'lucide-react';
import axios from '@/lib/axios';
import Link from 'next/link';

export default function FraudInvestigation() {
  const [cases, setCases] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/admin/fraud-cases');
      setCases(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchCases(); }, []);

  const handleAction = async (payoutId, action) => {
    setActionLoading(payoutId);
    try {
      await axios.put(`http://localhost:5000/api/admin/fraud-cases/${payoutId}`, { action });
      fetchCases();
    } catch (e) { console.error(e); }
    setActionLoading(null);
  };

  if (!cases && loading) return <div className="mt-10 text-center animate-pulse text-gray-400">Loading fraud cases...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-white/90 flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-red-400" /> Fraud Console
          </h1>
          <p className="text-xs text-gray-500 font-mono">MSVS INVESTIGATION & CASE MANAGEMENT</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchCases} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link href="/admin" className="text-xs bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card p-4 text-center">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Total Flagged</p>
          <p className="text-2xl font-black text-white">{cases?.totalCases || 0}</p>
        </div>
        <div className="glass-card p-4 text-center border-amber-500/20">
          <p className="text-[10px] text-amber-400 uppercase font-bold">Amber</p>
          <p className="text-2xl font-black text-amber-400">{cases?.amberCases || 0}</p>
        </div>
        <div className="glass-card p-4 text-center border-red-500/20">
          <p className="text-[10px] text-red-400 uppercase font-bold">Red</p>
          <p className="text-2xl font-black text-red-400">{cases?.redCases || 0}</p>
        </div>
      </div>

      {/* Cases List */}
      {cases?.cases?.length === 0 && (
        <div className="glass-card p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-300">All Clear</h2>
          <p className="text-sm text-gray-600">No flagged claims requiring investigation.</p>
        </div>
      )}

      <div className="space-y-3">
        {cases?.cases?.map(c => (
          <div
            key={c.payoutId}
            className={`glass-card overflow-hidden transition-all duration-300 border-l-4 ${
              c.fraudTier === 'red' ? 'border-l-red-500 bg-red-500/5' : 'border-l-amber-400 bg-amber-400/5'
            }`}
          >
            {/* Summary Row */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  c.fraudTier === 'red' ? 'bg-red-500/20' : 'bg-amber-500/20'
                }`}>
                  <ShieldAlert className={`w-5 h-5 ${c.fraudTier === 'red' ? 'text-red-400' : 'text-amber-400'}`} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{c.workerName} <span className="text-gray-500 font-normal text-xs">({c.platform})</span></h4>
                  <p className="text-[10px] text-gray-500">{c.reason} • Score: {c.fraudScore?.toFixed(3)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">₹{c.amount}</span>
                <button
                  onClick={() => setExpanded(expanded === c.payoutId ? null : c.payoutId)}
                  className="p-1.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expanded === c.payoutId && (
              <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-3 animate-in fade-in slide-in-from-top-2">
                {/* Signal Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    <span className="text-gray-500">Zone:</span>
                    <span>{c.triggerZone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-500">Triggered:</span>
                    <span>{c.triggerFiredAt ? new Date(c.triggerFiredAt).toLocaleString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-mono">{c.workerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Plan:</span>
                    <span className="capitalize">{c.policyPlan}</span>
                  </div>
                </div>

                {/* Fraud Signals */}
                {c.fraudSignals && Object.keys(c.fraudSignals).length > 0 && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">MSVS Signal Breakdown</p>
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(c.fraudSignals).filter(([k]) => k !== 'advancedChecks').map(([signal, data]) => (
                        <div key={signal} className="flex items-center gap-1 text-[10px]">
                          <span className={`w-2 h-2 rounded-full ${data?.passed ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-gray-400 capitalize">{signal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advanced Checks */}
                {c.fraudSignals?.advancedChecks && Object.keys(c.fraudSignals.advancedChecks).length > 0 && (
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Advanced Fraud Checks</p>
                    <div className="space-y-1">
                      {Object.entries(c.fraudSignals.advancedChecks).map(([check, data]) => (
                        <div key={check} className={`flex items-center gap-2 text-[10px] p-1.5 rounded ${data?.flagged ? 'bg-red-500/10' : 'bg-green-500/5'}`}>
                          <span className={`w-2 h-2 rounded-full ${data?.flagged ? 'bg-red-500' : 'bg-green-500'}`} />
                          <span className="text-gray-400 capitalize font-bold">{check.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-gray-500 ml-auto">{data?.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {c.status !== 'paid' && c.status !== 'rejected' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleAction(c.payoutId, 'approve')}
                      disabled={actionLoading === c.payoutId}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30 py-2 rounded-lg text-xs font-bold hover:bg-green-500/30 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve & Pay
                    </button>
                    <button
                      onClick={() => handleAction(c.payoutId, 'reject')}
                      disabled={actionLoading === c.payoutId}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 py-2 rounded-lg text-xs font-bold hover:bg-red-500/30 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
                {c.status === 'paid' && (
                  <p className="text-xs text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Already approved and paid</p>
                )}
                {c.status === 'rejected' && (
                  <p className="text-xs text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> Claim rejected</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
