"use client";
import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, X, Zap } from 'lucide-react';

export default function Toast({ message, type = 'success', duration = 4000, onClose }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Entrance animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    info: <Zap className="w-5 h-5 text-primary" />,
  };

  const borders = {
    success: 'border-green-500/30 bg-green-500/10',
    warning: 'border-amber-500/30 bg-amber-500/10',
    info: 'border-primary/30 bg-primary/10',
  };

  return (
    <div
      className={`fixed top-4 left-1/2 z-[100] w-[90%] max-w-sm -translate-x-1/2 transition-all duration-300 ${
        visible && !exiting ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className={`glass-card p-4 flex items-start gap-3 border ${borders[type]} shadow-2xl`}>
        <div className="shrink-0 mt-0.5">{icons[type]}</div>
        <p className="text-sm text-gray-200 flex-1 leading-relaxed">{message}</p>
        <button onClick={() => { setExiting(true); setTimeout(() => onClose?.(), 300); }} className="shrink-0 p-1 hover:bg-white/10 rounded-full">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
