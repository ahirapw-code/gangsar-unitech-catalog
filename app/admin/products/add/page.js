'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';
import ImageUploader from '@/components/ImageUploader';

// ─── Master categories (static, no DB call needed) ────────────────────────────
const MASTER_CATEGORIES = [
  { id: 'cat-electrical', name: 'Electrical', slug: 'electrical' },
  { id: 'cat-mechanical', name: 'Mechanical',  slug: 'mechanical'  },
  { id: 'cat-pneumatic',  name: 'Pneumatic',   slug: 'pneumatic'   },
  { id: 'cat-bearing',    name: 'Bearing',     slug: 'bearing'     },
  { id: 'cat-general',    name: 'General',     slug: 'general'     },
];

export default function AddProductPage() {
  const router = useRouter();
  const { admin, loading, getToken } = useAdmin();
  const [submitting, setSubmitting] = useState(false);

  // Track existing subcategories per category for autocomplete suggestions
  const [subcategorySuggestions, setSubcategorySuggestions] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    categorySlug: '',
    subcategory: '',          // ← new field
    description: '',
    price: '',
    originalPrice: '',
    isPromo: false,
    discount: 0,
    inStock: true,
    featured: false,
    preOrder: false,
    images: [''],
    specifications: [{ label: '', value: '' }],
  });

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin/login');
    } else if (admin) {
      fetchSubcategorySuggestions();
    }
  }, [admin, loading, router]);

  // Load existing subcategories from products for autocomplete hints
  async function fetchSubcategorySuggestions() {
    try {
      const res = await fetch('/api/categories?withSubcategories=true');
      if (!res.ok) return;
      const data = await res.json();
      const map = {};
      data.forEach((cat) => {
        if (cat.subcategories?.length) {
          map[cat.slug] = cat.subcategories;
        }
      });
      setSubcategorySuggestions(map);
    } catch (err) {
      // non-critical, ignore
    }
  }

  const handleCategoryChange = (categoryName) => {
    const category = MASTER_CATEGORIES.find((c) => c.name === categoryName);
    setFormData({
      ...formData,
      category: categoryName,
      categorySlug: category?.slug || '',
      subcategory: '', // reset subcategory when category changes
    });
  };

  const addImage = () =>
    setFormData({ ...formData, images: [...formData.images, ''] });

  const updateImage = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
  };

  const addSpecification = () =>
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { label: '', value: '' }],
    });

  const updateSpecification = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const removeSpecification = (index) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      specifications: newSpecs.length > 0 ? newSpecs : [{ label: '', value: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const token = getToken();

    let discount = 0;
    if (formData.isPromo && formData.originalPrice && formData.price) {
      discount = Math.round(
        ((parseFloat(formData.originalPrice) - parseFloat(formData.price)) /
          parseFloat(formData.originalPrice)) *
          100
      );
    }

    const productData = {
      ...formData,
      preOrder: formData.preOrder,
      price: parseFloat(formData.price),
      originalPrice: formData.isPromo
        ? parseFloat(formData.originalPrice || formData.price)
        : parseFloat(formData.price),
      discount: formData.isPromo ? discount : 0,
      subcategory: formData.subcategory?.trim() || '',
      images: formData.images.filter((img) => img.trim() !== ''),
      specifications: formData.specifications.filter(
        (spec) => spec.label && spec.value
      ),
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        toast.success('Product added successfully!');
        router.push('/admin/products');
      } else {
        toast.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E8E5A]" />
      </div>
    );
  }

  // Suggestions for the currently selected category
  const currentSuggestions =
    subcategorySuggestions[formData.categorySlug] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600">Fill in the product details below</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* ── Main Info ───────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name */}
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Deep Groove Ball Bearing 6205-2RS"
                    />
                  </div>

                  {/* SKU + Category */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sku">SKU Code *</Label>
                      <Input
                        id="sku"
                        required
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sku: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="e.g., BRG-6205-2RS"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={handleCategoryChange}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {MASTER_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Subcategory */}
                  <div>
                    <Label htmlFor="subcategory">
                      Sub Category
                      <span className="ml-1 text-xs text-gray-400 font-normal">
                        (optional — e.g., Ball Bearing, MCB, Solenoid Valve)
                      </span>
                    </Label>
                    <Input
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={(e) =>
                        setFormData({ ...formData, subcategory: e.target.value })
                      }
                      placeholder="Enter sub category..."
                      list="subcategory-suggestions"
                    />
                    {/* Datalist for autocomplete based on existing subcategories */}
                    {currentSuggestions.length > 0 && (
                      <datalist id="subcategory-suggestions">
                        {currentSuggestions.map((s) => (
                          <option key={s} value={s} />
                        ))}
                      </datalist>
                    )}
                    {/* Show existing suggestions as clickable chips */}
                    {currentSuggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="text-xs text-gray-400 mr-1 self-center">
                          Existing:
                        </span>
                        {currentSuggestions.slice(0, 8).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, subcategory: s })
                            }
                            className="text-xs px-2 py-0.5 rounded-full bg-gray-100 hover:bg-[#1E8E5A] hover:text-white transition-colors border border-gray-200"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Detailed product description..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* ── Pricing ────────────────────────────────────────────────── */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (Rp) *</Label>
                      <Input
                        id="price"
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="e.g., 45000"
                      />
                    </div>
                    {formData.isPromo && (
                      <div>
                        <Label htmlFor="originalPrice">Original Price (Rp) *</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          required={formData.isPromo}
                          value={formData.originalPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              originalPrice: e.target.value,
                            })
                          }
                          placeholder="e.g., 60000"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="isPromo" className="font-semibold">
                        Promotional Item
                      </Label>
                      <p className="text-sm text-gray-600">
                        Display this product with a discount badge
                      </p>
                    </div>
                    <Switch
                      id="isPromo"
                      checked={formData.isPromo}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isPromo: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* ── Specifications ─────────────────────────────────────────── */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Specifications</CardTitle>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addSpecification}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Spec
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Label (e.g., Material)"
                        value={spec.label}
                        onChange={(e) =>
                          updateSpecification(index, 'label', e.target.value)
                        }
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value (e.g., Stainless Steel)"
                        value={spec.value}
                        onChange={(e) =>
                          updateSpecification(index, 'value', e.target.value)
                        }
                        className="flex-1"
                      />
                      {formData.specifications.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeSpecification(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* ── Images ─────────────────────────────────────────────────── */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    images={formData.images}
                    onImagesChange={(newImages) =>
                      setFormData({ ...formData, images: newImages })
                    }
                  />
                </CardContent>
              </Card>
            </div>

            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inStock">In Stock</Label>
                    <Switch
                      id="inStock"
                      checked={formData.inStock}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, inStock: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Featured Product</Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, featured: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="preOrder">Pre-order</Label>
                      <p className="text-xs text-gray-500">Product available for pre-order</p>
                    </div>
                    <Switch
                      id="preOrder"
                      checked={formData.preOrder}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, preOrder: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Tips:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use descriptive product names</li>
                    <li>• SKU should be unique</li>
                    <li>• Sub category helps buyers filter products</li>
                    <li>• Add detailed specifications</li>
                    <li>• Use high-quality images</li>
                    <li>• Set realistic pricing</li>
                  </ul>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full bg-[#1E8E5A] hover:bg-[#15663f]"
                size="lg"
                disabled={submitting}
              >
                {submitting ? (
                  'Adding Product...'
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Add Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
