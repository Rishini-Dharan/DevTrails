"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Info, AlertTriangle, Shield } from 'lucide-react';
import axios from 'axios';

export default function Plans() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchUserAndPremium = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) { router.push('/onboarding'); return; }

      try {
        const userRes = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUser(userRes.data);

        // Fetch AI premiums for all 3 tiers
        const basicRes = await axios.get(`http://localhost:5000/api/premium/calculate?zone=${userRes.data.zone}&city=${userRes.data.city}&plan=basic`);
        const standardRes = await axios.get(`http://localhost:5000/api/premium/calculate?zone=${userRes.data.zone}&city=${userRes.data.city}&plan=standard`);
        const premiumRes = await axios.get(`http://localhost:5000/api/premium/calculate?zone=${userRes.data.zone}&city=${userRes.data.city}&plan=premium`);

        setPlans([basicRes.data, standardRes.data, premiumRes.data]);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchUserAndPremium();
  }, [router]);

  const handlePurchase = async (planType) => {
    if (purchasing) return;
    setPurchasing(true);
    try {
      const userId = localStorage.getItem('userId');
      await axios.post('http://localhost:5000/api/policies', { userId, plan: planType });
      // Simulate real-ish delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (e) {
      alert('Purchase failed');
      setPurchasing(false);
    }
  };

  if (loading) return <div className="mt-20 text-center animate-pulse text-gray-400">Loading your AI risk profile...</div>;

  const recommended = plans.find(p => p.plan === 'standard');

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Select Active Coverage</h1>
        <p className="text-sm text-gray-400 mt-1">Valid for one week. Priced for {user?.zone}.</p>
      </div>

      {recommended && (
        <div className="glass-card p-4 mb-6 border-primary/50 bg-primary/5">
          <div className="flex gap-3 mb-2">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs text-gray-300">
              <span className="font-semibold text-white">AI Pricing Logic: </span> 
              {recommended.explanation}
            </p>
          </div>
          {recommended.riskFactor > 1.2 && (
            <div className="flex gap-2 items-center text-xs text-amber-400 mt-2 bg-amber-400/10 p-2 rounded">
              <AlertTriangle className="w-4 h-4" /> 
              High disruption probability this week in your zone.
            </div>
          )}
        </div>
      )}

      <div className="space-y-4 pb-8">
        {plans.map((p, i) => (
          <div key={i} className={`glass-card p-5 relative overflow-hidden transition-all duration-300 ${p.plan === 'standard' ? 'border-primary ring-1 ring-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.15)] scale-[1.02]' : 'opacity-90'}`}>
            
            {p.plan === 'standard' && (
              <div className="absolute top-0 right-0 bg-primary text-[10px] font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold capitalize flex items-center gap-2">
                  {p.plan} {p.plan === 'premium' && <Shield className="w-4 h-4 text-accent"/>}
                </h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{p.coverage}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-white">₹{p.premium}</span>
                <span className="text-gray-500 text-xs block">/ week</span>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {p.plan === 'basic' && (
                <>
                  <li className="flex text-sm text-gray-300 gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0"/> Covers up to ₹1,500/week</li>
                  <li className="flex text-sm text-gray-300 gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0"/> Rain & Flood protection</li>
                  <li className="flex text-sm text-gray-500 gap-2 opacity-50"><CheckCircle2 className="w-4 h-4 shrink-0"/> AQI & Platform protection</li>
                </>
              )}
              {p.plan === 'standard' && (
                <>
                  <li className="flex text-sm text-gray-300 gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0"/> Covers up to ₹3,000/week</li>
                  <li className="flex text-sm text-gray-300 gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0"/> Rain, Flood, Heat protection</li>
                  <li className="flex text-sm text-gray-300 gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0"/> AQI &gt; 400 protection</li>
                </>
              )}
              {p.plan === 'premium' && (
                <>
                  <li className="flex text-sm text-gray-300 gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0"/> Covers up to ₹5,000/week</li>
                  <li className="flex text-sm text-gray-300 gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0"/> All weather + AQI</li>
                  <li className="flex text-sm text-gray-300 gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0"/> Curfews & Platform Outages</li>
                </>
              )}
            </ul>

            <button 
              onClick={() => handlePurchase(p.plan)}
              className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 ${p.plan === 'standard' ? 'bg-gradient-to-r from-primary to-accent text-white' : 'bg-white/10 hover:bg-white/20'}`}
            >
              Pay via UPI
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
