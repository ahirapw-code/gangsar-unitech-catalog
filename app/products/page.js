'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const MASTER_CATEGORIES = [
  { id: 'cat-electrical', name: 'Electrical', slug: 'electrical' },
  { id: 'cat-mechanical', name: 'Mechanical',  slug: 'mechanical'  },
  { id: 'cat-pneumatic',  name: 'Pneumatic',   slug: 'pneumatic'   },
  { id: 'cat-bearing',    name: 'Bearing',     slug: 'bearing'     },
  { id: 'cat-general',    name: 'General',     slug: 'general'     },
];

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    subcategory: 'all',
    sort: 'newest',
    page: 1,
  });
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const { addToCart } = useCart();

  // Reset page when filters change (except page itself)
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Load subcategories when category changes
  useEffect(() => {
    if (filters.category === 'all') {
      setSubcategories([]);
      return;
    }
    fetch(`/api/categories?withSubcategories=true`)
      .then(r => r.json())
      .then(data => {
        const cat = data.find(c => c.slug === filters.category);
        setSubcategories(cat?.subcategories || []);
      })
      .catch(() => setSubcategories([]));
  }, [filters.category]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search)                      params.append('search', filters.search);
      if (filters.category !== 'all')          params.append('category', filters.category);
      if (filters.subcategory !== 'all')       params.append('subcategory', filters.subcategory);
      params.append('sort', filters.sort);
      params.append('page', filters.page);
      params.append('limit', '12');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const setFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1,
      // Reset subcategory when category changes
      ...(key === 'category' ? { subcategory: 'all' } : {}),
    }));
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Product Catalog</h1>
          <p className="text-gray-300">Browse our comprehensive range of industrial spareparts</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by name or SKU..."
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={filters.category}
              onValueChange={(value) => setFilter('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {MASTER_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Subcategory Filter — only shown when category selected & has subcategories */}
            {filters.category !== 'all' && subcategories.length > 0 && (
              <Select
                value={filters.subcategory}
                onValueChange={(value) => setFilter('subcategory', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Sub Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sub Categories</SelectItem>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Sort */}
            <Select
              value={filters.sort}
              onValueChange={(value) => setFilter('sort', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="promo">Promotions</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters chips */}
        {(filters.category !== 'all' || filters.subcategory !== 'all') && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.category !== 'all' && (
              <Badge variant="secondary" className="gap-1 pr-1">
                <Tag className="h-3 w-3" />
                {MASTER_CATEGORIES.find(c => c.slug === filters.category)?.name}
                <button
                  onClick={() => setFilter('category', 'all')}
                  className="ml-1 hover:text-red-500 font-bold"
                >×</button>
              </Badge>
            )}
            {filters.subcategory !== 'all' && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {filters.subcategory}
                <button
                  onClick={() => setFilter('subcategory', 'all')}
                  className="ml-1 hover:text-red-500 font-bold"
                >×</button>
              </Badge>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="mb-4 text-gray-600 text-sm">
          {pagination.total > 0 ? (
            <span>
              Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
            </span>
          ) : !loading ? (
            <span>No products found</span>
          ) : null}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <Image
                      src={product.images?.[0] || '/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isPromo && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="text-xs text-gray-500 mb-1">SKU: {product.sku}</div>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>

                    {/* Category + Subcategory badges */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                      {product.subcategory && (
                        <span className="text-xs bg-[#1E8E5A]/10 text-[#1E8E5A] px-2 py-0.5 rounded-full">
                          {product.subcategory}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto">
                      <div className="mb-3">
                        <div className="text-lg font-bold text-[#1E8E5A]">
                          Rp {product.price.toLocaleString('id-ID')}
                        </div>
                        {product.isPromo && (
                          <div className="text-xs text-gray-500 line-through">
                            Rp {product.originalPrice.toLocaleString('id-ID')}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/products/${product.slug}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full text-xs">View</Button>
                        </Link>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 bg-[#1E8E5A] hover:bg-[#15663f] text-xs"
                        >
                          <ShoppingCart className="mr-1 h-3 w-3" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setFilters({ search: '', category: 'all', subcategory: 'all', sort: 'newest', page: 1 })}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === 1}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-1">
              {[...Array(pagination.pages)].map((_, i) => {
                const pageNum = i + 1;
                const near = pageNum === 1 || pageNum === pagination.pages ||
                  (pageNum >= filters.page - 1 && pageNum <= filters.page + 1);
                const ellipsis = pageNum === filters.page - 2 || pageNum === filters.page + 2;
                if (near) return (
                  <Button
                    key={pageNum}
                    variant={filters.page === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, page: pageNum }))}
                    className={filters.page === pageNum ? 'bg-[#1E8E5A] hover:bg-[#15663f]' : ''}
                  >
                    {pageNum}
                  </Button>
                );
                if (ellipsis) return <span key={pageNum} className="px-2">…</span>;
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === pagination.pages}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
