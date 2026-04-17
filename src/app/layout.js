import './globals.css';

export const metadata = {
  title: 'Lattice Protocol — Parametric Income Protection for Gig Workers',
  description: 'AI-powered parametric micro-insurance that automatically protects gig workers against income loss from weather, pollution, and local disruptions. Zero claims. Instant payouts.',
  keywords: 'gig economy, parametric insurance, income protection, delivery partners, India',
  manifest: '/manifest.json',
  themeColor: '#6366f1',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#6366f1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  );
}
