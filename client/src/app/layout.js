import './globals.css';
import { Inter } from 'next/font/google';
import BottomNav from './components/BottomNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GigShield — AI Powered Parametric Insurance',
  description: 'Weekly income protection for India\'s gig workers. AI-powered parametric micro-insurance with instant automated payouts.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GigShield',
  },
};

export const viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col items-center p-4 pb-20">
          <div className="w-full max-w-md mt-4 mb-10">
            {children}
          </div>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
