'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Target, Eye, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Gangsar Unitech</h1>
            <p className="text-xl text-gray-300">
              Your trusted partner for industrial machinery solutions in Indonesia
            </p>
          </motion.div>
        </div>
      </div>

      {/* Company Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Who We Are</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Gangsar Unitech is a leading supplier of industrial machinery spareparts based in Surabaya, East Java, Indonesia. 
                  We specialize in providing high-quality bearings, valves, gearboxes, pumps, and mechanical components to support 
                  industrial operations across various sectors.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  With years of experience in the industrial supply chain, we understand the critical importance of reliable components 
                  and timely delivery. Our commitment is to keep your operations running smoothly with genuine, industrial-grade products.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We serve manufacturing plants, engineering companies, maintenance teams, and contractors throughout Indonesia, 
                  providing not just products but comprehensive technical support and solutions.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative h-96 rounded-2xl overflow-hidden shadow-xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1542274368-443d694d79aa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwzfHxmYWN0b3J5fGVufDB8fHxibHVlfDE3Nzk4NzExNzJ8MA&ixlib=rb-4.1.0&q=85"
                  alt="Factory"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-[#1E8E5A]/10 rounded-full flex items-center justify-center mb-6">
                    <Target className="h-8 w-8 text-[#1E8E5A]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-gray-700 leading-relaxed">
                    To provide Indonesian industries with reliable, high-quality machinery spareparts and engineering solutions 
                    that enhance operational efficiency, reduce downtime, and support sustainable industrial growth through 
                    exceptional service and technical expertise.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-[#1E8E5A]/10 rounded-full flex items-center justify-center mb-6">
                    <Eye className="h-8 w-8 text-[#1E8E5A]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                  <p className="text-gray-700 leading-relaxed">
                    To be Indonesia's most trusted and innovative industrial spareparts supplier, recognized for quality products, 
                    technical excellence, and customer-centric solutions that power the future of Indonesian manufacturing and industry.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'Quality First',
                description: 'Only genuine, industrial-grade products from trusted manufacturers',
              },
              {
                title: 'Customer Focus',
                description: 'Understanding and exceeding customer expectations in every interaction',
              },
              {
                title: 'Technical Excellence',
                description: 'Deep expertise and continuous learning in industrial engineering',
              },
              {
                title: 'Integrity',
                description: 'Transparent, honest business practices and reliable partnerships',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-[#1E8E5A] rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Award className="h-16 w-16 text-[#1E8E5A] mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Gangsar Unitech?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Extensive inventory of industrial spareparts',
                'Genuine products from trusted global manufacturers',
                'Competitive pricing with bulk discounts',
                'Fast response and quick quotation turnaround',
                'Technical support from experienced engineers',
                'Reliable delivery across Indonesia',
                'Strong relationships with major industries',
                'Commitment to customer satisfaction',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="h-6 w-6 text-[#1E8E5A] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
