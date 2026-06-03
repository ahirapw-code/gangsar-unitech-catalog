'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1E8E5A] to-[#15663f] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">GU</span>
              </div>
              <div>
                <div className="font-bold text-white text-lg">Gangsar Unitech</div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Your trusted partner for industrial machinery spareparts and engineering solutions in Surabaya, Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-[#1E8E5A] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#1E8E5A] transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#1E8E5A] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#1E8E5A] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/rfq" className="hover:text-[#1E8E5A] transition-colors">
                  Request Quote
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#1E8E5A] transition-colors text-gray-400">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=bearings" className="hover:text-[#1E8E5A] transition-colors">
                  Bearings
                </Link>
              </li>
              <li>
                <Link href="/products?category=industrial-valves" className="hover:text-[#1E8E5A] transition-colors">
                  Industrial Valves
                </Link>
              </li>
              <li>
                <Link href="/products?category=gearboxes" className="hover:text-[#1E8E5A] transition-colors">
                  Gearboxes
                </Link>
              </li>
              <li>
                <Link href="/products?category=pumps" className="hover:text-[#1E8E5A] transition-colors">
                  Pumps
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#1E8E5A] flex-shrink-0 mt-0.5" />
                <span className="text-sm">Surabaya, East Java, Indonesia</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#1E8E5A] flex-shrink-0" />
                <span className="text-sm">+62 812-3456-7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#1E8E5A] flex-shrink-0" />
                <span className="text-sm">admin@gangsarunitech.id</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://maps.google.com/?q=Gangsar+Unitech+Surabaya" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                title="Find us on Google Maps"
              >
                <Image 
                  src="/icons/google-maps.svg"
                  width={20}
                  height={20}
                  alt="Google Maps"
                  className="text-gray-300 hover:text-[#1E8E5A]"
                />
              </a>
              <a 
                href="https://www.tokopedia.com/gexpat" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                title="Visit our Tokopedia Store"
              >
                <Image 
                  src="/icons/tokopedia.svg"
                  width={20}
                  height={20}
                  alt="Tokopedia"
                  className="text-gray-300 hover:text-[#1E8E5A]"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Gangsar Unitech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
