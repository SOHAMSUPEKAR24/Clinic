import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import { NavigationProgress } from '@/components/ui/NavigationProgress';

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: '--font-jakarta',
  display: 'swap',
  preload: false, // only used for headings — don't block initial render
  weight: ['600', '700', '800'],
});

export const metadata: Metadata = {
  title: "Clinic OS - Production SaaS",
  description: "Advanced Clinic Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-[#FAFAFA] min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: 'font-sans text-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100',
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
