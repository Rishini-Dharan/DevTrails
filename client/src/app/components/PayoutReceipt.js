"use client";
import { X, CheckCircle, Clock, Fingerprint, CreditCard } from 'lucide-react';

export default function PayoutReceipt({ receipt, onClose }) {
  if (!receipt) return null;

  const tierColors = {
    green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  };
  const colors = tierColors[receipt.fraudTier] || tierColors.green;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-card w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Payment Receipt</h3>
              <p className="text-[10px] text-gray-500 font-mono">Razorpay Test Mode</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Amount */}
        <div className="text-center py-4 border-y border-white/10">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Amount Transferred</p>
          <p className="text-4xl font-black text-green-400 mt-1">₹{receipt.amount}</p>
          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-400">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span>{receipt.status === 'paid' ? 'Paid Instantly' : receipt.status}</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-mono text-xs">{receipt.transactionId || 'PENDING'}</span>
          </div>
          {receipt.upiRef && (
            <div className="flex justify-between">
              <span className="text-gray-500">UPI Reference</span>
              <span className="font-mono text-xs">{receipt.upiRef}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">UPI ID</span>
            <span className="font-mono text-xs">{receipt.upiId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Reason</span>
            <span className="text-xs text-right max-w-[60%]">{receipt.reason}</span>
          </div>
          {receipt.paidAt && (
            <div className="flex justify-between">
              <span className="text-gray-500">Paid At</span>
              <span className="text-xs">{new Date(receipt.paidAt).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Fraud Tier */}
        <div className={`flex items-center gap-2 p-3 rounded-lg ${colors.bg} ${colors.border} border`}>
          <Fingerprint className={`w-4 h-4 ${colors.text}`} />
          <div>
            <p className={`text-xs font-bold ${colors.text}`}>MSVS Fraud: {receipt.fraudTier?.toUpperCase()}</p>
            <p className="text-[10px] text-gray-400">Score: {receipt.fraudScore?.toFixed(3) || 'N/A'}</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-[9px] text-center text-gray-600 pt-2">
          Powered by GigShield × Razorpay Sandbox • Not a real transaction
        </p>
      </div>
    </div>
  );
}
