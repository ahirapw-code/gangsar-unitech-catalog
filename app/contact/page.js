'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1E8E5A] to-[#15663f] text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-gray-100">
              Get in touch with our team for inquiries, quotations, or technical support
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#1E8E5A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-[#1E8E5A]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Location</h3>
                  <p className="text-gray-600 text-sm">
                    Surabaya<br />
                    East Java<br />
                    Indonesia
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#1E8E5A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-[#1E8E5A]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Phone</h3>
                  <p className="text-gray-600 text-sm">
                    <a href="tel:+6285771919132" className="hover:text-[#1E8E5A]">
                      +62 857 7191 9132
                    </a>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Mon-Fri: 8AM-5PM WIB
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#1E8E5A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-[#1E8E5A]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Email</h3>
                  <p className="text-gray-600 text-sm">
                    <a href="mailto:admin@gangsarunitech.id" className="hover:text-[#1E8E5A]">
                      info@gangsarunitech.com
                    </a>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Response within 24 hours
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#1E8E5A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-[#1E8E5A]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
                  <p className="text-gray-600 text-sm">
                    Monday - Friday<br />
                    8:00 AM - 5:00 PM<br />
                    Saturday: 8AM-1PM
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How Can We Help You?</h2>
              <p className="text-gray-600">
                Choose the best way to reach us based on your needs
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-12 w-12 text-[#25D366] mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">WhatsApp</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Quick questions or urgent inquiries
                    </p>
                    <Button
                      className="w-full bg-[#25D366] hover:bg-[#20BA5A]"
                      onClick={() => window.open('https://wa.me/6285771919132', '_blank')}
                    >
                      Chat Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <Mail className="h-12 w-12 text-[#1E8E5A] mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Detailed inquiries or documentation
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.location.href = 'mailto:admin@gangsarunitech.id'}
                    >
                      Send Email
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-12 w-12 text-[#1E8E5A] mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Direct conversation with our team
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.location.href = 'tel:+6285771919132'}
                    >
                      Call Us
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* RFQ CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="bg-gradient-to-r from-[#1E8E5A] to-[#15663f] text-white border-0">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">Need a Quotation?</h2>
                <p className="text-lg mb-8 text-gray-100">
                  Submit a formal quotation request and get competitive pricing within 24 hours
                </p>
                <Link href="/rfq">
                  <Button size="lg" variant="secondary" className="bg-white text-[#1E8E5A] hover:bg-gray-100">
                    Request Quotation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
