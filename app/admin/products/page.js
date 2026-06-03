'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, ArrowLeft, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';
import Image from 'next/image';

const PRODUCTS_PER_PAGE = 20;

export default function AdminProductsPage() {
  const router = useRouter();
  const { admin, loading, getToken } = useAdmin();
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin/login');
    } else if (admin) {
      fetchData(currentPage, searchTerm);
    }
  }, [admin, loading, router, currentPage, searchTerm]);

  // Reset ke page 1 ketika search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  async function fetchData(page, search) {
    setLoadingData(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: PRODUCTS_PER_PAGE,
        ...(search && { search }),
      });

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      setProducts(data.products || []);
      // API mengembalikan total di dalam object pagination
      setTotalProducts(data.pagination?.total ?? data.products?.length ?? 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoadingData(false);
    }
  }

  // Debounce search agar tidak kirim request setiap ketikan
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

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
        // Kalau halaman ini jadi kosong setelah hapus, kembali ke halaman sebelumnya
        const newTotal = totalProducts - 1;
        const newTotalPages = Math.ceil(newTotal / PRODUCTS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        } else {
          fetchData(currentPage, searchTerm);
        }
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
        body: JSON.stringify({ ...product, isPromo: !product.isPromo })
      });

      if (res.ok) {
        toast.success('Product updated successfully');
        fetchData(currentPage, searchTerm);
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Buat range nomor halaman yang ditampilkan (maks 5 angka)
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  };

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
                <p className="text-gray-600">
                  {totalProducts} total product{totalProducts !== 1 ? 's' : ''}
                  {searchTerm && ` · hasil pencarian "${searchTerm}"`}
                </p>
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        {loadingData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E8E5A] mx-auto"></div>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="space-y-4">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                              <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                              <p className="text-sm text-gray-600">{product.category}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-3">
                {/* Info halaman */}
                <p className="text-sm text-gray-500">
                  Halaman {currentPage} dari {totalPages} &nbsp;·&nbsp;
                  Menampilkan {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–
                  {Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts)} dari {totalProducts} produk
                </p>

                {/* Tombol navigasi */}
                <div className="flex items-center gap-1">
                  {/* Tombol First */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="hidden sm:flex"
                  >
                    «
                  </Button>

                  {/* Tombol Prev */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </Button>

                  {/* Ellipsis kiri */}
                  {getPageNumbers()[0] > 1 && (
                    <span className="px-2 text-gray-400 hidden sm:block">…</span>
                  )}

                  {/* Nomor halaman */}
                  {getPageNumbers().map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className={`w-9 hidden sm:flex ${
                        page === currentPage ? 'bg-[#1E8E5A] hover:bg-[#15663f]' : ''
                      }`}
                    >
                      {page}
                    </Button>
                  ))}

                  {/* Ellipsis kanan */}
                  {getPageNumbers().at(-1) < totalPages && (
                    <span className="px-2 text-gray-400 hidden sm:block">…</span>
                  )}

                  {/* Tombol Next */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  {/* Tombol Last */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="hidden sm:flex"
                  >
                    »
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Produk tidak ditemukan' : 'No products found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? `Tidak ada produk yang cocok dengan "${searchTerm}"`
                  : 'Try adjusting your search or add a new product'}
              </p>
              {!searchTerm && (
                <Link href="/admin/products/add">
                  <Button className="bg-[#1E8E5A] hover:bg-[#15663f]">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Product
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
