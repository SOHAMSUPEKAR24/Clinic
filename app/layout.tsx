import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: '--font-jakarta' });

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
