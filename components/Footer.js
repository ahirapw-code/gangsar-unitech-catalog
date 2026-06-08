'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : [])
      .then(data => setCategories(data || []))
      .catch(() => setCategories([]));
  }, []);

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
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="hover:text-[#1E8E5A] transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">Loading...</li>
              )}
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
                <span className="text-sm">+62 857-7191-9132</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#1E8E5A] flex-shrink-0" />
                <span className="text-sm">admin@gangsarunitech.id</span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              {/* Google Maps */}
              <a
                href="https://maps.google.com/?q=Gangsar+Unitech+Surabaya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                title="Find us on Google Maps"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </a>

              {/* Tokopedia */}
              <a
                href="https://www.tokopedia.com/gexpat"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                title="Visit our Tokopedia Store"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 109 109" fill="white">
                  <path d="M54.5 0C24.4 0 0 24.4 0 54.5S24.4 109 54.5 109 109 84.6 109 54.5 84.6 0 54.5 0zm22.8 37.2H65.1v33.6c0 1-.8 1.8-1.8 1.8h-8.5c-1 0-1.8-.8-1.8-1.8V37.2H40.8c-1 0-1.8-.8-1.8-1.8v-7.8c0-1 .8-1.8 1.8-1.8h36.5c1 0 1.8.8 1.8 1.8v7.8c0 1-.8 1.8-1.8 1.8z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/gangsarunitechindonesia?igsh=MWh3ZnQ1bGw0N3k2MA%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                title="Follow us on Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
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
