import './globals.css';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext';
import { AdminProvider } from '@/contexts/AdminContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Gangsar Unitech - Industrial Machinery Spareparts | Surabaya',
  description: 'Your trusted partner for industrial machinery spareparts and engineering solutions in Surabaya, Indonesia. Quality bearings, valves, gearboxes, pumps, and more.',
  keywords: 'industrial spareparts, machinery parts, bearings, valves, gearboxes, pumps, Surabaya, Indonesia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <WhatsAppButton />
            <Toaster />
          </CartProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
