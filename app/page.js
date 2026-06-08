'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Building2, TrendingUp, Shield, Zap, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import ClientsSection from '@/components/ClientsSection';
export default function HomePage() {
  const [promoProducts, setPromoProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        const [promoRes, categoriesRes] = await Promise.all([
          fetch('/api/products?promo=true&limit=6', { cache: 'no-store' }),
          fetch('/api/categories', { cache: 'no-store' })
        ]);

        if (!promoRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const promoData = await promoRes.json();
        const categoriesData = await categoriesRes.json();

        setPromoProducts(promoData.products || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPromoProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-[#1E8E5A] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1578776349090-de61da00ff1a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwxfHxmYWN0b3J5fGVufDB8fHxibHVlfDE3Nzk4NzExNzJ8MA&ixlib=rb-4.1.0&q=85"
            alt="Industrial Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Premium Industrial Machinery Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Your trusted partner for high-quality spareparts, bearings, valves, and engineering components in Surabaya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-[#1E8E5A] hover:bg-[#15663f] text-white">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/rfq">
                <Button size="lg" variant="outline" className="border-white text-white bg-white/10 hover:bg-white hover:text-gray-900">
                  Request Quotation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              About Gangsar Unitech
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Gangsar Unitech is a leading supplier of industrial machinery spareparts based in Surabaya, Indonesia.
              We specialize in providing high-quality bearings, valves, gearboxes, pumps, and mechanical components
              to factories, manufacturing companies, and engineering teams across Indonesia.
            </p>
          </div>
        </div>
      </section>

      {/* Promo Products */}
      {promoProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Special Promotions</h2>
                <p className="text-gray-600 mt-2">Limited time offers on selected products</p>
              </div>
              <Link href="/products?promo=true">
                <Button variant="outline" className="hidden md:flex">
                  View All Promos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promoProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.isPromo && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="text-xs text-gray-500 mb-2">SKU: {product.sku}</div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-2xl font-bold text-[#1E8E5A]">
                            Rp {product.price.toLocaleString('id-ID')}
                          </div>
                          {product.isPromo && (
                            <div className="text-sm text-gray-500 line-through">
                              Rp {product.originalPrice.toLocaleString('id-ID')}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/products/${product.slug || product.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            Details
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 bg-[#1E8E5A] hover:bg-[#15663f]"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Product Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive range of industrial spareparts and machinery components
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/products?category=${category.slug}`}>
                  <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer overflow-hidden group">
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <h3 className="absolute bottom-3 left-0 right-0 text-center text-white font-bold text-base drop-shadow">
                        {category.name}
                      </h3>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Gangsar Unitech?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Genuine Products',
                description: 'Only authentic, industrial-grade quality products from trusted manufacturers',
              },
              {
                icon: Zap,
                title: 'Fast Response',
                description: 'Quick quotation turnaround and efficient delivery to keep your operations running',
              },
              {
                icon: TrendingUp,
                title: 'Competitive Pricing',
                description: 'Best value for quality products with transparent pricing and bulk discounts',
              },
              {
                icon: Building2,
                title: 'Technical Support',
                description: 'Expert guidance and support from our experienced engineering team',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-shadow h-full">
                  <div className="w-16 h-16 bg-[#1E8E5A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-[#1E8E5A]" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients / Logo Ticker */}
      <ClientsSection />

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-[#1E8E5A] to-[#15663f] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need a Custom Quotation?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Our team is ready to provide competitive pricing for your specific requirements
          </p>
          <Link href="/rfq">
            <Button size="lg" variant="secondary" className="bg-white text-[#1E8E5A] hover:bg-gray-100">
              Request Quote Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
