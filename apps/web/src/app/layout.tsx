import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Basa-koi (HomeFinder BD) | Smart Location-Based House Rental in Bangladesh',
  description:
    'Find and rent verified apartments, bachelor mess, sublets, and family houses in Khulna City and across Bangladesh with transparent pricing in BDT.',
  keywords: ['house rent khulna', 'to let khulna', 'bachelor mess khulna', 'apartment rental bangladesh', 'basa-koi', 'homefinder bd'],
  openGraph: {
    title: 'Basa-koi | Smart House Rental & To-Let Marketplace',
    description: 'Find verified houses, flats, rooms, and sublets with location-based map discovery.',
    url: 'https://basa-koi.vercel.app',
    siteName: 'Basa-koi BD',
    locale: 'en_BD',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-50 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

