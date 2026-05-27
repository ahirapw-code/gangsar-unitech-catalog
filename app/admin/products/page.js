'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AdminProductsPage() {
  const router = useRouter();
  const { admin, loading, getToken } = useAdmin();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin/login');
    } else if (admin) {
      fetchData();
    }
  }, [admin, loading, router]);

  async function fetchData() {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/categories')
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setProducts(productsData.products || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoadingData(false);
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const token = getToken();
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success('Product deleted successfully');
        fetchData();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleTogglePromo = async (product) => {
    const token = getToken();
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...product,
          isPromo: !product.isPromo
        })
      });

      if (res.ok) {
        toast.success('Product updated successfully');
        fetchData();
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E8E5A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                <p className="text-gray-600">{products.length} total products</p>
              </div>
            </div>
            <Link href="/admin/products/add">
              <Button className="bg-[#1E8E5A] hover:bg-[#15663f]">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        {loadingData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E8E5A] mx-auto"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                            <p className="text-sm text-gray-600">{product.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {product.isPromo && (
                              <Badge variant="destructive">Promo -{product.discount}%</Badge>
                            )}
                            {product.inStock ? (
                              <Badge variant="default" className="bg-green-500">In Stock</Badge>
                            ) : (
                              <Badge variant="secondary">Out of Stock</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold text-[#1E8E5A]">
                              Rp {product.price.toLocaleString('id-ID')}
                            </span>
                            {product.isPromo && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                Rp {product.originalPrice.toLocaleString('id-ID')}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTogglePromo(product)}
                            >
                              {product.isPromo ? 'Remove Promo' : 'Set Promo'}
                            </Button>
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(product.id, product.name)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or add a new product</p>
              <Link href="/admin/products/add">
                <Button className="bg-[#1E8E5A] hover:bg-[#15663f]">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
