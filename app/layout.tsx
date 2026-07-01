import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'Zi Wei Chart · Ni Haixia Authentic Zi Wei Dou Shu',
  description: 'Authentic Ni Haixia Zi Wei Dou Shu — AI-powered deep readings covering your chart pattern, Da Xian, Liu Nian, love, career, wealth, and health',
  keywords: 'Zi Wei Dou Shu, Ni Haixia, Ni Haixia, complete Zi Wei, Zi Wei Quan Shu, Gu Sui Fu, chart, destiny, 14 major stars, 12 palaces',
  metadataBase: new URL('https://wdyziweidoushu666.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Zi Wei Chart · Ni Haixia Authentic Zi Wei Dou Shu',
    description: 'Authentic Ni Haixia Zi Wei Dou Shu — AI-powered deep readings covering your chart pattern, Da Xian, Liu Nian, love, career, wealth, and health',
    url: 'https://wdyziweidoushu666.com',
    siteName: 'Zi Wei Research',
    locale: 'zh_CN',
    type: 'website',
  },
  // Webmaster verification (paste the code into the relevant field, redeploy to activate)
  verification: {
    // Google Search Console: add the site at https://search.google.com/search-console to get this
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    // Bing Webmaster Tools: add the site at https://www.bing.com/webmasters to get this
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '808FFC6023A2C359B375DD860FEDA856',
      // Baidu Webmaster (after business license is approved)
      'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || '',
      // 360 Webmaster (after business license is approved)
      '360-site-verification': process.env.NEXT_PUBLIC_360_VERIFICATION || '',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ziwei-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
