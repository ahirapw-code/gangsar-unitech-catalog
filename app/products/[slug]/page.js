'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  async function fetchProduct() {
    try {
      const res = await fetch(`/api/products/${params.slug}`);
      const data = await res.json();
      setProduct(data);
      setRelatedProducts(data.relatedProducts || []);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWhatsAppInquiry = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in:\n${product.name}\nSKU: ${product.sku}\n\nPlease provide more information.`
    );
    window.open(`https://wa.me/6285771919132?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E8E5A]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#1E8E5A]">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#1E8E5A]">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.categorySlug}`} className="hover:text-[#1E8E5A]">  
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <Link href="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        {/* Product Detail */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <Card className="overflow-hidden mb-4">
              <div className="relative h-96 bg-gray-100">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
                {product.isPromo && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    -{product.discount}% OFF
                  </div>
                )}
              </div>
            </Card>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-20 border-2 rounded-lg overflow-hidden ${
                      selectedImage === idx ? 'border-[#1E8E5A]' : 'border-gray-200'
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="text-sm text-gray-500 mb-2">SKU: {product.sku}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <Badge variant="secondary" className="mb-4">{product.category}</Badge>

            <div className="mb-6">
              <div className="text-4xl font-bold text-[#1E8E5A] mb-2">
                Rp {product.price.toLocaleString('id-ID')}
              </div>
              {product.isPromo && (
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-500 line-through">
                    Rp {product.originalPrice.toLocaleString('id-ID')}
                  </span>
                  <span className="text-red-500 font-semibold">
                    Save {product.discount}%
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-600 font-medium">
                {product.inStock ? 'In Stock' : 'Contact for Availability'}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-3">Specifications</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <table className="w-full">
                    <tbody>
                      {product.specifications.map((spec, idx) => (
                        <tr key={idx} className="border-b border-gray-200 last:border-0">
                          <td className="py-2 font-medium text-gray-700">{spec.label}</td>
                          <td className="py-2 text-gray-900">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="w-full bg-[#1E8E5A] hover:bg-[#15663f]"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWhatsAppInquiry}
                className="w-full"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp Inquiry
              </Button>
              <Link href="/rfq" className="w-full">
                <Button size="lg" variant="secondary" className="w-full">
                  Request Formal Quotation
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <Card key={relProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/products/${relProduct.slug}`}>
                    <div className="relative h-40 bg-gray-100">
                      <Image
                        src={relProduct.images[0]}
                        alt={relProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="text-xs text-gray-500 mb-1">SKU: {relProduct.sku}</div>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{relProduct.name}</h3>
                      <div className="text-lg font-bold text-[#1E8E5A]">
                        Rp {relProduct.price.toLocaleString('id-ID')}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
