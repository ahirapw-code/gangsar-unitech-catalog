'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Eye, CheckCircle, Clock, XCircle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

function StatusBadge({ status }) {
  const map = {
    pending:    { label: 'Pending',     className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    processing: { label: 'Processing',  className: 'bg-blue-100 text-blue-800 border-blue-300' },
    completed:  { label: 'Completed',   className: 'bg-green-100 text-green-800 border-green-300' },
    'close-won':  { label: 'Close Won',   className: 'bg-emerald-600 text-white' },
    'close-lost': { label: 'Close Lost',  className: 'bg-red-100 text-red-800 border-red-300' },
  };
  const s = map[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${s.className}`}>{s.label}</span>;
}

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
                          <StatusBadge status={rfq.status || 'pending'} />
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
                      <div className="flex flex-col gap-2 ml-4 min-w-[130px]">
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
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleUpdateStatus(rfq.id, 'processing')}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Process
                          </Button>
                        )}
                        {(rfq.status === 'processing' || rfq.status === 'pending') && (
                          <>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => handleUpdateStatus(rfq.id, 'close-won')}
                            >
                              <Trophy className="h-4 w-4 mr-1" />
                              Close Won
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleUpdateStatus(rfq.id, 'close-lost')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Close Lost
                            </Button>
                          </>
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
                      <StatusBadge status={selectedRfq.status || 'pending'} />
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

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {selectedRfq.status === 'pending' && (
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleUpdateStatus(selectedRfq.id, 'processing')}
                    >
                      <Clock className="h-4 w-4 mr-1" /> Mark as Processing
                    </Button>
                  )}
                  {(selectedRfq.status === 'pending' || selectedRfq.status === 'processing') && (
                    <>
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleUpdateStatus(selectedRfq.id, 'close-won')}
                      >
                        <Trophy className="h-4 w-4 mr-1" /> Close Won
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => handleUpdateStatus(selectedRfq.id, 'close-lost')}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Close Lost
                      </Button>
                    </>
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
