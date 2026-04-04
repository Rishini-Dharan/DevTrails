"use client";
import { useState, useEffect } from 'react';
import { Activity, Users, ShieldAlert, CircleDollarSign, Fingerprint, RefreshCw, BarChart3, AlertTriangle, CreditCard } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats');
      setStats(res.data);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  if (!stats && loading) return <div className="mt-10 text-center animate-pulse text-gray-400">Connecting to Databricks...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-black text-white/90">HQ Control</h1>
          <p className="text-xs text-primary font-mono tracking-widest uppercase">Platform Metrics</p>
        </div>
        <button onClick={fetchStats} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/admin/analytics" className="glass-card p-4 flex items-center gap-3 hover:bg-white/5 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Analytics</h3>
            <p className="text-[10px] text-gray-500">Charts, predictions, trends</p>
          </div>
        </Link>
        <Link href="/admin/fraud" className="glass-card p-4 flex items-center gap-3 hover:bg-white/5 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Fingerprint className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Fraud Console</h3>
            <p className="text-[10px] text-gray-500">
              {stats?.fraudBreakdown ? `${stats.fraudBreakdown.amber + stats.fraudBreakdown.red} flagged` : 'Review cases'}
            </p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="glass-card p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs text-gray-400 uppercase font-bold tracking-wider">Gross Payouts</h3>
            <CircleDollarSign className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-black text-white">₹{stats?.totalPayoutAmount?.toLocaleString() || 0}</p>
          <p className="text-[10px] text-gray-500 mt-1">{stats?.totalPayouts} automated transfers</p>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs text-gray-400 uppercase font-bold tracking-wider">Loss Ratio</h3>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.lossRatio || 0}%</p>
          <p className="text-[10px] text-gray-500 mt-1">₹{stats?.totalPremiumCollected} premiums collected</p>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs text-gray-400 uppercase font-bold tracking-wider">Active Policies</h3>
            <ShieldAlert className="w-4 h-4 text-accent" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.activePolicies || 0}</p>
          <p className="text-[10px] text-gray-500 mt-1">Live coverage across zones</p>
        </div>

        <div className="glass-card p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs text-gray-400 uppercase font-bold tracking-wider">Coverage Tiers</h3>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="space-y-1 mt-1 text-xs font-mono">
            <div className="flex justify-between"><span className="text-gray-500">Basic</span><span>{stats?.planBreakdown?.basic || 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Standard</span><span className="text-primary">{stats?.planBreakdown?.standard || 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Premium</span><span>{stats?.planBreakdown?.premium || 0}</span></div>
          </div>
        </div>
      </div>

      {/* Payout Status Breakdown */}
      <div className="glass-card p-5 mb-6">
        <h3 className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-green-400" /> Payment Status
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-500/10 p-3 rounded-lg text-center border border-green-500/20">
            <p className="text-lg font-black text-green-400">{stats?.payoutStatusBreakdown?.paid || 0}</p>
            <p className="text-[10px] text-gray-500 uppercase">Paid</p>
          </div>
          <div className="bg-amber-500/10 p-3 rounded-lg text-center border border-amber-500/20">
            <p className="text-lg font-black text-amber-400">{stats?.payoutStatusBreakdown?.pending || 0}</p>
            <p className="text-[10px] text-gray-500 uppercase">Pending</p>
          </div>
          <div className="bg-red-500/10 p-3 rounded-lg text-center border border-red-500/20">
            <p className="text-lg font-black text-red-400">{stats?.payoutStatusBreakdown?.rejected || 0}</p>
            <p className="text-[10px] text-gray-500 uppercase">Rejected</p>
          </div>
        </div>
      </div>

      {/* AI Fraud MSVS Engine */}
      <h2 className="text-xs text-primary font-mono tracking-widest uppercase mb-3 flex items-center gap-2">
        <Fingerprint className="w-4 h-4" /> AI Fraud MSVS Engine
      </h2>
      <div className="glass-card p-5">
        <p className="text-xs text-gray-400 mb-4">Isolation Forest + 7-signal multi-verification + Advanced Checks (GPS, History, Weather, Duplicates)</p>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-green-400 font-bold">Tier GREEN (Auto Approve)</span>
              <span>{stats?.fraudBreakdown?.green || 0}</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full transition-all" style={{ width: `${(stats?.fraudBreakdown?.green || 0) / (stats?.totalPayouts || 1) * 100}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-amber-400 font-bold">Tier AMBER (Sec. Review)</span>
              <span>{stats?.fraudBreakdown?.amber || 0}</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full transition-all" style={{ width: `${(stats?.fraudBreakdown?.amber || 0) / (stats?.totalPayouts || 1) * 100}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-red-400 font-bold">Tier RED (Blocked / Manual)</span>
              <span>{stats?.fraudBreakdown?.red || 0}</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full transition-all" style={{ width: `${(stats?.fraudBreakdown?.red || 0) / (stats?.totalPayouts || 1) * 100}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-mono">
          <span>Sys. Avg Threat Score</span>
          <span className="text-white text-xs">{stats?.avgFraudScore || "0.000"}</span>
        </div>
      </div>
    </div>
  );
}
