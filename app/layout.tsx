import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProviderWrapper } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://rimbasmita.com'),
  title: 'Rimbasmita — Setiap langkah punya cerita',
  description: 'A digital sanctuary for hikers and outdoor enthusiasts. Share meaningful hiking experiences, reflect on personal growth, and discover authentic trails.',
  openGraph: {
    title: 'Rimbasmita — Setiap langkah punya cerita',
    description: 'A digital sanctuary for hikers and outdoor enthusiasts.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProviderWrapper>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
