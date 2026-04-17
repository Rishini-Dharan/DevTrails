'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { section: 'Worker' },
  { href: '/dashboard', icon: '📊', label: 'Overview' },
  { href: '/dashboard/policy', icon: '🛡️', label: 'Active Policy' },
  { href: '/dashboard/payouts', icon: '💰', label: 'Payout History' },
  { href: '/dashboard/weather', icon: '🌤️', label: 'Live Conditions' },
  { section: 'Admin' },
  { href: '/admin', icon: '⚙️', label: 'Analytics' },
  { href: '/admin/map', icon: '🗺️', label: 'Risk Heatmap' },
  { href: '/admin/triggers', icon: '⚡', label: 'Trigger Monitor' },
  { href: '/admin/fraud', icon: '🔍', label: 'Fraud Detection' },
  { href: '/admin/simulation', icon: '🎯', label: 'Live Simulation' },
  { href: '/admin/explainability', icon: '🧠', label: 'AI Explainability' },
  { href: '/admin/financials', icon: '📈', label: 'Financials' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/" className="sidebar-logo">
        <div className="nav-logo-icon" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>⚡</div>
        Lattice Protocol
      </Link>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item, i) => {
          if (item.section) {
            return (
              <div key={i} className="sidebar-section-label">{item.section}</div>
            );
          }
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User card at bottom */}
      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3" style={{ padding: '8px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: 'var(--radius-full)',
            background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700
          }}>RK</div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Ramesh Kumar</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Swiggy · Koramangala</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
