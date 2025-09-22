import type React from 'react';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import AuthProvider from '@/lib/AuthProvider';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'NightShift Inventory Management System',
  description: 'Smart Inventory · Vendor Traceability · Customer Insights',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className='font-sans antialiased'>
        <Navbar />
        <main className='min-h-screen'>
          <AuthProvider>
            {children}
            <Toaster position='bottom-right' />
          </AuthProvider>
        </main>
        <footer className='relative z-20 bg-card/80 backdrop-blur-md py-8'>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
