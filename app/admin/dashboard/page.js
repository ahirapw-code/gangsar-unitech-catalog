'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Package, 
  FolderTree, 
  FileText, 
  TrendingUp, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin, logout, loading, getToken } = useAdmin();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin/login');
    } else if (admin) {
      fetchData();
    }
  }, [admin, loading, router]);

  async function fetchData() {
    const token = getToken();
    if (!token) return;

    try {
      const [statsRes, productsRes, rfqsRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/products?limit=5'),
        fetch('/api/rfq', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const statsData = await statsRes.json();
      const productsData = await productsRes.json();
      const rfqsData = await rfqsRes.json();

      setStats(statsData);
      setProducts(productsData.products || []);
      setRfqs(rfqsData.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {admin.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline">
                  View Website
                </Button>
              </Link>
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Products</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Categories</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalCategories}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FolderTree className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total RFQs</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalRFQs}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pending RFQs</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.pendingRFQs}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Products</CardTitle>
              <Link href="/admin/products">
                <Button size="sm" className="bg-[#1E8E5A] hover:bg-[#15663f]">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Products
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : products.length > 0 ? (
                <div className="space-y-3">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-600">SKU: {product.sku}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {product.isPromo && (
                          <Badge variant="destructive" className="text-xs">Promo</Badge>
                        )}
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No products yet</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent RFQs</CardTitle>
              <Link href="/admin/rfq">
                <Button size="sm" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View All RFQs
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : rfqs.length > 0 ? (
                <div className="space-y-3">
                  {rfqs.map((rfq) => (
                    <div key={rfq.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{rfq.companyName}</p>
                        <Badge variant={rfq.status === 'pending' ? 'secondary' : 'default'}>
                          {rfq.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{rfq.fullName}</p>
                      <p className="text-xs text-gray-600">{rfq.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {rfq.products?.length || 0} products requested
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No RFQs yet</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Email Configuration</h3>
            <p className="text-sm text-blue-800">
              To enable email notifications for RFQs, please update your Gmail SMTP credentials in the <code className="bg-blue-200 px-2 py-1 rounded">.env</code> file:
            </p>
            <ul className="text-sm text-blue-800 mt-2 ml-4 list-disc">
              <li>SMTP_USER: Your Gmail address</li>
              <li>SMTP_PASS: Your App-specific password</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
