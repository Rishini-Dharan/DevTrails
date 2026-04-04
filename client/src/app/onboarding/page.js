"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, MapPin, Phone } from 'lucide-react';
import axios from 'axios';

const STEPS = [
  { label: 'Phone', icon: Phone },
  { label: 'Verify', icon: ShieldCheck },
  { label: 'Profile', icon: User },
  { label: 'Zone', icon: MapPin },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('zomato');
  const [gigId, setGigId] = useState('');
  const [city, setCity] = useState('mumbai');
  const [zone, setZone] = useState('andheri west');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleSendOtp = async () => {
    if (phone.length < 10) return alert('Enter valid phone');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', { phone });
      setStep(2);
    } catch (e) { alert('Error sending OTP'); }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return alert('Enter 6 digit OTP');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { phone, otp });
      setUserId(res.data.user.id);
      localStorage.setItem('userId', res.data.user.id);
      setStep(3);
    } catch (e) { alert('Invalid OTP'); }
    setLoading(false);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/users/onboard', {
        userId, name, gigPlatform: platform, gigId, city, zone, pincode: '400058'
      });
      router.push('/plans');
    } catch (e) { alert('Error saving profile'); }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-[85vh] justify-center w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Setup Your Shield</h1>
        
        {/* Visual Progress Bar */}
        <div className="progress-bar mb-3">
          <div className="progress-bar-fill" style={{ width: `${(step / 4) * 100}%` }} />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between items-center px-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const stepNum = i + 1;
            const isActive = step >= stepNum;
            const isCurrent = step === stepNum;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCurrent ? 'bg-primary/20 border-2 border-primary scale-110 shadow-[0_0_10px_rgba(99,102,241,0.3)]' :
                  isActive ? 'bg-green-500/20 border border-green-500/50' :
                  'bg-white/5 border border-white/10'
                }`}>
                  <Icon className={`w-3.5 h-3.5 transition-colors duration-300 ${
                    isCurrent ? 'text-primary' : isActive ? 'text-green-400' : 'text-gray-600'
                  }`} />
                </div>
                <span className={`text-[9px] font-bold tracking-wider uppercase transition-colors duration-300 ${
                  isCurrent ? 'text-primary' : isActive ? 'text-green-400' : 'text-gray-600'
                }`}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-card p-6 w-full">
        {step === 1 && (
          <div className="space-y-4 animate-fade-up">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-accent"/> Enter Phone
            </h2>
            <input 
              type="tel" placeholder="10-digit mobile number" 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              value={phone} onChange={e => setPhone(e.target.value)}
            />
            <button onClick={handleSendOtp} disabled={loading} className="w-full btn-primary disabled:opacity-50">
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">Zero paperwork required.</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-up">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-400"/> Verify OTP
            </h2>
            <p className="text-sm text-gray-400">Sent to {phone}</p>
            <input 
              type="number" placeholder="Enter 123456 (demo)" maxLength={6}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary tracking-[1em] text-center text-xl transition-colors"
              value={otp} onChange={e => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp} disabled={loading} className="w-full btn-primary disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-up">
            <h2 className="text-xl font-semibold">Worker Details</h2>
            <input 
              type="text" placeholder="Full Name" 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors"
              value={name} onChange={e => setName(e.target.value)}
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setPlatform('zomato')}
                className={`flex-1 py-3 rounded-lg border transition-all duration-300 ${platform === 'zomato' ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)]' : 'bg-white/5 border-white/10 text-gray-400'}`}
              >Zomato</button>
              <button 
                onClick={() => setPlatform('swiggy')}
                className={`flex-1 py-3 rounded-lg border transition-all duration-300 ${platform === 'swiggy' ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.15)]' : 'bg-white/5 border-white/10 text-gray-400'}`}
              >Swiggy</button>
            </div>
            <input 
              type="text" placeholder="Rider ID (e.g. SW-8912)" 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary uppercase transition-colors"
              value={gigId} onChange={e => setGigId(e.target.value.toUpperCase())}
            />
            <button onClick={() => setStep(4)} className="w-full btn-primary mt-2">Next</button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-fade-up">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400"/> Work Zone
            </h2>
            <p className="text-sm text-gray-400 mb-2">Coverage applies to this area only.</p>
            
            <select className="w-full bg-[#15152a] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary text-white transition-colors"
              value={city} onChange={e => setCity(e.target.value)}
            >
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="bangalore">Bangalore</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="chennai">Chennai</option>
              <option value="pune">Pune</option>
              <option value="kolkata">Kolkata</option>
            </select>

            <select className="w-full bg-[#15152a] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary text-white transition-colors"
              value={zone} onChange={e => setZone(e.target.value)}
            >
              <option value="andheri west">Andheri West</option>
              <option value="bandra">Bandra</option>
              <option value="borivali">Borivali</option>
              <option value="koramangala">Koramangala</option>
              <option value="connaught place">Connaught Place</option>
            </select>

            <button onClick={handleComplete} disabled={loading} className="w-full btn-primary mt-4 disabled:opacity-50">
              {loading ? 'Saving...' : 'Finish & View Plans'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
