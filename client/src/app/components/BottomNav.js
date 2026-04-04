"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/dashboard', icon: ShieldCheck, label: 'Shield' },
  { href: '/dashboard/triggers', icon: Zap, label: 'Simulate' },
  { href: '/admin', icon: BarChart3, label: 'Admin' },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on onboarding and plans pages
  if (pathname === '/onboarding' || pathname === '/plans') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bottom-nav-bar">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-primary scale-110' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]' : ''}`} />
                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
                )}
              </div>
              <span className={`text-[10px] font-bold tracking-wide transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
