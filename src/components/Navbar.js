'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ variant = 'landing' }) {
  const pathname = usePathname();

  if (variant === 'landing') {
    return (
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">⚡</div>
            Lattice Protocol
          </Link>
          <div className="nav-links">
            <Link href="/plans" className={`nav-link ${pathname === '/plans' ? 'active' : ''}`}>Plans</Link>
            <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
            <Link href="/admin" className={`nav-link ${pathname === '/admin' ? 'active' : ''}`}>Admin</Link>
            <Link href="/onboard" className="btn btn-primary" style={{ marginLeft: '8px' }}>Get Protected →</Link>
          </div>
        </div>
      </nav>
    );
  }

  return null;
}
