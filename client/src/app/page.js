"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, Zap, Banknote, Umbrella, CloudRain, ThermometerSun, TrendingUp } from 'lucide-react';

const STATS = [
  { value: '₹2.3Cr', label: 'Protected', icon: TrendingUp },
  { value: '12K+', label: 'Workers', icon: Zap },
  { value: '<60s', label: 'Payout', icon: Banknote },
];

const TAGLINES = [
  "When it rains, you get paid.",
  "Zero paperwork. Instant payouts.",
  "AI-powered income protection.",
  "Built for India's gig economy.",
];

export default function Home() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const tagline = TAGLINES[taglineIndex];

    if (isTyping) {
      if (displayText.length < tagline.length) {
        const timer = setTimeout(() => {
          setDisplayText(tagline.slice(0, displayText.length + 1));
        }, 40);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timer);
      }
    } else {
      if (displayText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 20);
        return () => clearTimeout(timer);
      } else {
        setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
        setIsTyping(true);
      }
    }
  }, [displayText, isTyping, taglineIndex]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-8 stagger-children">
      {/* Animated Shield Hero */}
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center p-5 bg-primary/10 rounded-full mb-4 animate-pulse-glow animate-float relative">
          <ShieldAlert className="w-14 h-14 text-primary" />
          <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl" />
        </div>
        <h1 className="text-5xl font-black bg-gradient-to-r from-white via-accent to-primary text-transparent bg-clip-text animate-gradient-text pb-1">
          GigShield
        </h1>
        <div className="h-7">
          <p className="text-gray-400 text-lg font-mono">
            {displayText}
            <span className="inline-block w-0.5 h-5 bg-primary ml-0.5 animate-live-pulse" />
          </p>
        </div>
      </div>

      {/* Stat Counters */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card p-3 text-center group hover:border-primary/30 transition-all duration-300">
              <Icon className="w-4 h-4 mx-auto mb-1 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
              <p className="text-lg font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="glass-card p-4 flex flex-col col-span-2 items-center text-center group hover:border-blue-500/20 transition-all duration-300">
          <Umbrella className="w-6 h-6 text-blue-400 mb-2 group-hover:animate-float" />
          <h3 className="font-semibold text-sm">Parametric Coverage</h3>
          <p className="text-xs text-gray-500 mt-1">Auto-triggers when disruption &gt; threshold</p>
        </div>
        <div className="glass-card p-4 flex flex-col items-center text-center group hover:border-yellow-500/20 transition-all duration-300">
          <Zap className="w-6 h-6 text-yellow-400 mb-2 group-hover:animate-float" />
          <h3 className="font-semibold text-sm">Zero Claim</h3>
          <p className="text-xs text-gray-500 mt-1">No forms needed</p>
        </div>
        <div className="glass-card p-4 flex flex-col items-center text-center group hover:border-green-500/20 transition-all duration-300">
          <Banknote className="w-6 h-6 text-green-400 mb-2 group-hover:animate-float" />
          <h3 className="font-semibold text-sm">₹29/week</h3>
          <p className="text-xs text-gray-500 mt-1">AI-priced</p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="w-full pt-4 space-y-4">
        <Link
          href="/onboarding"
          className="w-full block btn-primary text-center text-lg py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300"
        >
          Get Covered Now
        </Link>
        <Link
          href="/dashboard"
          className="w-full block glass-card py-4 font-semibold text-gray-300 hover:text-white hover:border-white/20 transition-all duration-300 text-center"
        >
          Login to Dashboard
        </Link>
      </div>
    </div>
  );
}
