"use client";
import { useState, useEffect } from 'react';
import { ShieldCheck, CloudLightning, History, ArrowUpRight, CloudRain, ThermometerSun, Wallet, TrendingUp, CreditCard, Wind, RefreshCw } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PayoutReceipt from '../components/PayoutReceipt';

function DashboardSkeleton() {
  return (
    <div className="w-full space-y-6 animate-fade-up">
      <div className="flex justify-between items-center">
        <div>
          <div className="skeleton w-32 h-6 mb-2" />
          <div className="skeleton w-24 h-3" />
        </div>
        <div className="skeleton w-20 h-6 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="skeleton h-24 rounded-2xl" />
        <div className="skeleton h-24 rounded-2xl" />
      </div>
      <div className="skeleton h-48 rounded-2xl" />
      <div className="skeleton h-12 rounded-xl" />
      <div className="skeleton h-12 rounded-xl" />
      <div className="skeleton h-20 rounded-2xl" />
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) { router.push('/'); return; }

    try {
      const [userRes, polRes, payRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/users/${userId}`),
        axios.get(`http://localhost:5000/api/policies/user/${userId}`),
        axios.get(`http://localhost:5000/api/payouts/user/${userId}`)
      ]);
      
      setUser(userRes.data);
      setPolicies(polRes.data);
      setPayouts(payRes.data);
      setLastRefresh(new Date());

      if (userRes.data.city) {
        const wRes = await axios.get(`http://localhost:5000/api/weather/${userRes.data.city}`);
        setWeather(wRes.data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 5000);
    return () => clearInterval(iv);
  }, [router]);

  const handlePayoutClick = async (payout) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/payments/receipt/${payout.id}`);
      setSelectedReceipt(res.data.receipt);
    } catch {
      setSelectedReceipt({
        amount: payout.amount,
        status: payout.status,
        transactionId: payout.transactionId || 'N/A',
        upiRef: payout.upiRef,
        upiId: payout.upiId,
        paidAt: payout.paidAt,
        reason: payout.reason,
        fraudTier: payout.fraudTier,
        fraudScore: payout.fraudScore,
      });
    }
  };

  if (loading) return <DashboardSkeleton />;

  const activePolicy = policies.find(p => p.status === 'active');
  const dateStr = activePolicy ? new Date(activePolicy.weekEnd).toLocaleDateString() : '';
  
  const daysRemaining = activePolicy 
    ? Math.max(0, Math.ceil((new Date(activePolicy.weekEnd) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const totalProtected = payouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const paidPayouts = payouts.filter(p => p.status === 'paid');

  return (
    <div className="w-full space-y-6 stagger-children">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Hello, {user?.name || 'Rider'}</h1>
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            {user?.gigPlatform?.toUpperCase()} | {user?.zone}
            <span className="live-dot" />
            <span className="text-[10px] text-gray-600">LIVE</span>
          </p>
        </div>
        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-green-500/30">
          <ShieldCheck className="w-3 h-3"/> Trust: {(user?.trustScore * 100).toFixed(0)}
        </div>
      </div>

      {/* Earnings + Coverage */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 hover:border-green-500/40 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-green-400" />
            <span className="text-[10px] text-gray-400 font-bold uppercase">Earnings Protected</span>
          </div>
          <p className="text-2xl font-black text-green-400">₹{totalProtected.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500 mt-1">{paidPayouts.length} payouts received</p>
        </div>
        <div className="glass-card p-4 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 hover:border-primary/40 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-[10px] text-gray-400 font-bold uppercase">Coverage</span>
          </div>
          {activePolicy ? (
            <>
              <p className="text-2xl font-black text-white">{daysRemaining}d</p>
              <p className="text-[10px] text-gray-500 mt-1">remaining • {activePolicy.plan}</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-black text-gray-600">—</p>
              <p className="text-[10px] text-gray-500 mt-1">No active plan</p>
            </>
          )}
        </div>
      </div>

      {/* Policy Card */}
      {activePolicy ? (
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-primary/80 to-accent/60 shadow-[0_0_30px_rgba(99,102,241,0.2)] animate-pulse-glow">
          <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck className="w-28 h-28" /></div>
          <div className="relative z-10">
            <span className="bg-black/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3 inline-block shadow-sm">
              Active Protection • {activePolicy.plan}
            </span>
            <h2 className="text-3xl font-black mb-1">Protected</h2>
            <p className="text-sm text-white/80 mb-6">Valid until {dateStr}</p>
            
            <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-4">
              <div>
                <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Premium</p>
                <p className="text-lg font-bold">₹{activePolicy.premium}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Coverage</p>
                <p className="text-lg font-bold">₹{activePolicy.coverageLimit}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Risk</p>
                <p className="text-lg font-bold">{activePolicy.riskFactor?.toFixed(1)}x</p>
              </div>
            </div>

            {/* AI Explanation */}
            {activePolicy.riskExplanation && (
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-[10px] text-white/70 leading-relaxed">
                  💡 {activePolicy.riskExplanation}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-card p-6 text-center">
          <ShieldCheck className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold">No Active Coverage</h2>
          <p className="text-sm text-gray-400 mb-4">Get protected before you ride</p>
          <Link href="/plans" className="btn-primary px-6 py-2 inline-block">View Plans</Link>
        </div>
      )}

      {/* Live Signals */}
      <div className="flex justify-between items-center pt-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
          Live Signals <span className="live-dot" />
        </h3>
        <span className="text-[10px] text-gray-600 font-mono">
          {lastRefresh ? lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {weather && (
          <>
            <div className="glass-card p-3 flex flex-col items-center text-center hover:border-blue-500/20 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shrink-0 mb-1.5">
                <CloudRain className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-sm font-bold">{weather.precipitation.toFixed(1)}</p>
              <p className="text-[9px] text-gray-500 uppercase">mm/hr</p>
            </div>
            <div className="glass-card p-3 flex flex-col items-center text-center hover:border-orange-500/20 transition-colors">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shrink-0 mb-1.5">
                <ThermometerSun className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-sm font-bold">{weather.temperature.toFixed(0)}°C</p>
              <p className="text-[9px] text-gray-500 uppercase">Temp</p>
            </div>
            <div className="glass-card p-3 flex flex-col items-center text-center hover:border-purple-500/20 transition-colors">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shrink-0 mb-1.5">
                <Wind className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-sm font-bold">{Math.round(weather.aqi)}</p>
              <p className="text-[9px] text-gray-500 uppercase">AQI</p>
            </div>
          </>
        )}
      </div>
      
      {/* Payout History */}
      <div className="flex justify-between items-center pt-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Payout History</h3>
        <History className="w-4 h-4 text-gray-500" />
      </div>

      <div className="space-y-3">
        {payouts.length === 0 ? (
          <div className="glass-card p-8 text-center text-sm text-gray-500 border-dashed border-white/20">
            No payouts recorded yet. You&apos;re safe! 🛡️
          </div>
        ) : (
          payouts.map((p, i) => (
            <div
              key={p.id}
              onClick={() => handlePayoutClick(p)}
              className={`glass-card p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-all duration-300 border-l-4 ${
                p.status === 'paid' ? 'border-l-green-500 bg-green-500/5' :
                p.status === 'pending' ? 'border-l-amber-400 bg-amber-400/5' :
                'border-l-red-500 bg-red-500/5'
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  p.status === 'paid' ? 'bg-green-500/20' : 'bg-amber-500/20'
                }`}>
                  {p.transactionId ? <CreditCard className="w-5 h-5 text-green-400" /> : <ArrowUpRight className="w-5 h-5 text-green-400" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{p.transactionId ? 'Razorpay Payout' : 'UPI Auto-Payout'}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{p.reason}</p>
                  <p className="text-[10px] text-gray-500">
                    {new Date(p.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} • MSVS: {p.fraudTier?.toUpperCase()}
                    {p.transactionId && <span className="text-primary ml-1">• {p.transactionId}</span>}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-lg ${p.status === 'paid' ? 'text-green-400' : 'text-amber-400'}`}>
                  +₹{p.amount}
                </p>
                <p className={`text-[10px] px-2 py-0.5 rounded-sm inline-block ${
                  p.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                  p.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>{p.status}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <PayoutReceipt receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
}
