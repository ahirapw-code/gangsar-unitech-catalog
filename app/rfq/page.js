'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

export default function RFQPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [customProducts, setCustomProducts] = useState([]);

  const addCustomProduct = () => {
    setCustomProducts([...customProducts, { name: '', sku: '', quantity: 1 }]);
  };

  const removeCustomProduct = (index) => {
    setCustomProducts(customProducts.filter((_, i) => i !== index));
  };

  const updateCustomProduct = (index, field, value) => {
    const updated = [...customProducts];
    updated[index][field] = value;
    setCustomProducts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Combine cart items and custom products
    const allProducts = [
      ...cart.map(item => ({
        name: item.name,
        sku: item.sku,
        quantity: item.quantity
      })),
      ...customProducts.filter(p => p.name && p.sku)
    ];

    if (allProducts.length === 0) {
      toast.error('Please add at least one product to your quotation request');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          products: allProducts
        })
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Quotation request submitted successfully! Redirecting...');
        clearCart();
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        toast.error('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting RFQ:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#1E8E5A] to-[#15663f] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Request for Quotation</h1>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              Get competitive pricing for your industrial sparepart needs. Our team will respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="ABC Manufacturing"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+62 812-3456-7890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Products */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Products Requested</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Cart Items */}
                    {cart.length > 0 && (
                      <div className="space-y-2">
                        <Label>From Cart ({cart.length} items)</Label>
                        {cart.map((item) => (
                          <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-gray-600">
                              SKU: {item.sku} | Qty: {item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Custom Products */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Additional Products</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={addCustomProduct}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Product
                        </Button>
                      </div>
                      {customProducts.map((product, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2 space-y-2">
                          <div className="flex justify-between items-start">
                            <Input
                              placeholder="Product Name"
                              value={product.name}
                              onChange={(e) => updateCustomProduct(index, 'name', e.target.value)}
                              className="mb-2"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => removeCustomProduct(index)}
                              className="ml-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="SKU"
                              value={product.sku}
                              onChange={(e) => updateCustomProduct(index, 'sku', e.target.value)}
                            />
                            <Input
                              type="number"
                              placeholder="Qty"
                              min="1"
                              value={product.quantity}
                              onChange={(e) => updateCustomProduct(index, 'quantity', parseInt(e.target.value))}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any specific requirements or questions..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">
                      By submitting this form, you agree to be contacted by our sales team regarding your quotation request.
                    </p>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="bg-[#1E8E5A] hover:bg-[#15663f] min-w-[200px]"
                    >
                      {loading ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
