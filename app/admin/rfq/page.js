'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Eye, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminRFQPage() {
  const router = useRouter();
  const { admin, loading, getToken } = useAdmin();
  const [rfqs, setRfqs] = useState([]);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin/login');
    } else if (admin) {
      fetchRfqs();
    }
  }, [admin, loading, router]);

  async function fetchRfqs() {
    const token = getToken();
    try {
      const res = await fetch('/api/rfq', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setRfqs(data || []);
    } catch (error) {
      console.error('Error fetching RFQs:', error);
      toast.error('Failed to load RFQs');
    } finally {
      setLoadingData(false);
    }
  }

  const handleUpdateStatus = async (rfqId, newStatus) => {
    const token = getToken();
    try {
      const res = await fetch(`/api/rfq/${rfqId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        toast.success('RFQ status updated');
        fetchRfqs();
        if (selectedRfq && selectedRfq.id === rfqId) {
          setSelectedRfq({ ...selectedRfq, status: newStatus });
        }
      } else {
        toast.error('Failed to update status');
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
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RFQ Management</h1>
              <p className="text-gray-600">{rfqs.length} quotation requests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loadingData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E8E5A] mx-auto"></div>
          </div>
        ) : rfqs.length > 0 ? (
          <div className="space-y-4">
            {rfqs.map((rfq, index) => (
              <motion.div
                key={rfq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{rfq.companyName}</h3>
                          <Badge variant={rfq.status === 'pending' ? 'secondary' : rfq.status === 'processing' ? 'default' : 'outline'}>
                            {rfq.status || 'pending'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <strong>Contact:</strong> {rfq.fullName}
                          </div>
                          <div>
                            <strong>Email:</strong> {rfq.email}
                          </div>
                          <div>
                            <strong>Phone:</strong> {rfq.phone}
                          </div>
                          <div>
                            <strong>Date:</strong> {rfq.createdAt ? format(new Date(rfq.createdAt), 'MMM dd, yyyy') : 'N/A'}
                          </div>
                        </div>
                        <div className="mt-3">
                          <strong className="text-sm text-gray-700">Products:</strong>
                          <div className="mt-1 space-y-1">
                            {rfq.products?.slice(0, 3).map((product, idx) => (
                              <div key={idx} className="text-sm text-gray-600">
                                • {product.name} (SKU: {product.sku}) - Qty: {product.quantity || 1}
                              </div>
                            ))}
                            {rfq.products?.length > 3 && (
                              <div className="text-sm text-gray-500">+ {rfq.products.length - 3} more products</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRfq(rfq)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {rfq.status === 'pending' && (
                          <Button
                            size="sm"
                            className="bg-[#1E8E5A] hover:bg-[#15663f]"
                            onClick={() => handleUpdateStatus(rfq.id, 'processing')}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Process
                          </Button>
                        )}
                        {rfq.status === 'processing' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleUpdateStatus(rfq.id, 'completed')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        )}
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
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No RFQs yet</h3>
              <p className="text-gray-600">Quotation requests from customers will appear here</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* RFQ Detail Dialog */}
      <Dialog open={!!selectedRfq} onOpenChange={() => setSelectedRfq(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedRfq && (
            <>
              <DialogHeader>
                <DialogTitle>RFQ Details - {selectedRfq.companyName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Company Name</label>
                    <p className="text-gray-900">{selectedRfq.companyName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Contact Person</label>
                    <p className="text-gray-900">{selectedRfq.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedRfq.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Phone</label>
                    <p className="text-gray-900">{selectedRfq.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Status</label>
                    <p>
                      <Badge variant={selectedRfq.status === 'pending' ? 'secondary' : 'default'}>
                        {selectedRfq.status || 'pending'}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Date Submitted</label>
                    <p className="text-gray-900">
                      {selectedRfq.createdAt ? format(new Date(selectedRfq.createdAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Requested Products</label>
                  <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                    {selectedRfq.products?.map((product, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-white rounded border">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Quantity</p>
                          <p className="font-semibold">{product.quantity || 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedRfq.notes && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Additional Notes</label>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedRfq.notes}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  {selectedRfq.status === 'pending' && (
                    <Button
                      className="flex-1 bg-[#1E8E5A] hover:bg-[#15663f]"
                      onClick={() => handleUpdateStatus(selectedRfq.id, 'processing')}
                    >
                      Mark as Processing
                    </Button>
                  )}
                  {selectedRfq.status === 'processing' && (
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleUpdateStatus(selectedRfq.id, 'completed')}
                    >
                      Mark as Completed
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedRfq(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
