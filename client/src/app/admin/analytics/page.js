"use client";
import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, ShieldAlert, Activity, RefreshCw, ArrowLeft, Cpu, MapPin, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
} from 'recharts';
import axios from 'axios';
import Link from 'next/link';

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/admin/analytics');
      setData(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchAnalytics(); }, []);

  if (!data && loading) return <div className="mt-10 text-center animate-pulse text-gray-400">Loading analytics engine...</div>;

  const predictions = data?.predictions;
  const heatmap = data?.zoneHeatmap || [];

  return (
    <div className="w-full max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-white/90 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> Analytics
          </h1>
          <p className="text-xs text-gray-500 font-mono">PREDICTIVE INSIGHTS & HISTORICAL TRENDS</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAnalytics} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link href="/admin" className="text-xs bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
        </div>
      </div>

      {/* Predictive Analytics Card */}
      {predictions && (
        <div className={`glass-card p-5 mb-6 border-l-4 ${
          predictions.overallRisk === 'critical' ? 'border-l-red-500 bg-red-500/5' :
          predictions.overallRisk === 'elevated' ? 'border-l-amber-400 bg-amber-400/5' :
          'border-l-green-500 bg-green-500/5'
        }`}>
          <div className="flex items-start gap-3 mb-3">
            <Cpu className={`w-5 h-5 mt-0.5 ${
              predictions.overallRisk === 'critical' ? 'text-red-400' :
              predictions.overallRisk === 'elevated' ? 'text-amber-400' : 'text-green-400'
            }`} />
            <div>
              <h3 className="font-bold text-sm">Next Week Forecast</h3>
              <p className="text-xs text-gray-400 mt-1">{predictions.recommendation}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-black/20 p-3 rounded-lg text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Risk Level</p>
              <p className={`text-lg font-black uppercase ${
                predictions.overallRisk === 'critical' ? 'text-red-400' :
                predictions.overallRisk === 'elevated' ? 'text-amber-400' : 'text-green-400'
              }`}>{predictions.overallRisk}</p>
            </div>
            <div className="bg-black/20 p-3 rounded-lg text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Est. Claims</p>
              <p className="text-lg font-black text-white">{predictions.totalExpectedClaims}</p>
            </div>
            <div className="bg-black/20 p-3 rounded-lg text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Est. Exposure</p>
              <p className="text-lg font-black text-white">₹{predictions.totalExpectedPayout?.toLocaleString()}</p>
            </div>
          </div>

          {/* Disruption forecast bars */}
          <div className="mt-4 space-y-2">
            {Object.entries(predictions.disruptions || {}).map(([type, info]) => (
              <div key={type} className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 w-12 uppercase font-bold">{type}</span>
                <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${info.riskLevel === 'high' ? 'bg-red-500' : info.riskLevel === 'medium' ? 'bg-amber-400' : 'bg-green-500'}`}
                    style={{ width: `${info.probability * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 w-10 text-right">{(info.probability * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue vs Payouts Chart */}
      {data?.revenueVsPayouts?.length > 0 && (
        <div className="glass-card p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Revenue vs Payouts
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.revenueVsPayouts}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 10 }} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fill: '#666', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#999' }}
              />
              <Line type="monotone" dataKey="premiums" stroke="#6366f1" strokeWidth={2} dot={false} name="Premiums ₹" />
              <Line type="monotone" dataKey="payouts" stroke="#ef4444" strokeWidth={2} dot={false} name="Payouts ₹" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Disruption Distribution Pie */}
        {data?.disruptionDistribution?.length > 0 && (
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Disruption Types
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.disruptionDistribution}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                  paddingAngle={3}
                >
                  {data.disruptionDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {data.disruptionDistribution.map((d, i) => (
                <span key={i} className="text-[10px] text-gray-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {d.label} ({d.count})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Fraud Tier Timeline */}
        {data?.fraudOverTime?.length > 0 && (
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" /> Fraud Tiers Over Time
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.fraudOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fill: '#666', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="green" fill="#10b981" stackId="a" name="Green" />
                <Bar dataKey="amber" fill="#f59e0b" stackId="a" name="Amber" />
                <Bar dataKey="red" fill="#ef4444" stackId="a" name="Red" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Zone Risk Heatmap */}
      {heatmap.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" /> Zone Risk Heatmap
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {heatmap.map((z, i) => (
              <div key={i} className={`p-3 rounded-lg border ${
                z.riskLevel === 'critical' ? 'bg-red-500/15 border-red-500/30' :
                z.riskLevel === 'high' ? 'bg-amber-500/15 border-amber-500/30' :
                z.riskLevel === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20' :
                'bg-green-500/10 border-green-500/20'
              }`}>
                <p className="text-xs font-bold capitalize">{z.zone}</p>
                <div className="flex justify-between items-end mt-1">
                  <span className={`text-lg font-black ${
                    z.riskLevel === 'critical' ? 'text-red-400' :
                    z.riskLevel === 'high' ? 'text-amber-400' :
                    z.riskLevel === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>{z.riskScore}</span>
                  <span className="text-[9px] text-gray-500 uppercase">{z.riskLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!data?.revenueVsPayouts?.length && !predictions) && (
        <div className="glass-card p-12 text-center">
          <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-400">No Data Yet</h2>
          <p className="text-sm text-gray-600 mt-1">Simulate some triggers to generate analytics data.</p>
          <Link href="/dashboard/triggers" className="text-xs text-primary mt-4 inline-block hover:underline">Go to Trigger Simulation →</Link>
        </div>
      )}
    </div>
  );
}
