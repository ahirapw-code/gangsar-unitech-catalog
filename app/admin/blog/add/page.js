'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';
import RichTextEditor from '@/components/RichTextEditor';

export default function AddBlogPage() {
  const router = useRouter();
  const { admin, loading } = useAdmin();
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    author: '',
    tags: [],
    published: false,
  });

  useEffect(() => {
    if (!loading && !admin) router.push('/admin/login');
  }, [admin, loading]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  }

  function removeTag(tag) {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }

  async function handleSubmit(publishNow = false) {
    if (!form.title.trim()) {
      toast.error('Judul artikel wajib diisi');
      return;
    }
    if (!form.content.trim() || form.content === '<br>') {
      toast.error('Konten artikel wajib diisi');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form, published: publishNow || form.published };
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(publishNow ? 'Artikel dipublikasikan!' : 'Draft disimpan!');
        router.push('/admin/blog');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Gagal menyimpan artikel');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E8E5A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/blog">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Tulis Artikel Baru</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleSubmit(false)}
                disabled={submitting}
              >
                <Save className="mr-2 h-4 w-4" />
                Simpan Draft
              </Button>
              <Button
                className="bg-[#1E8E5A] hover:bg-[#15663f]"
                onClick={() => handleSubmit(true)}
                disabled={submitting}
              >
                <Eye className="mr-2 h-4 w-4" />
                Publikasikan
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold mb-2 block">Judul Artikel *</Label>
                <Input
                  placeholder="Masukkan judul artikel yang menarik..."
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="text-lg"
                />
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold mb-1 block">Ringkasan (Excerpt)</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Tampil di daftar blog & meta description SEO. Maks ~160 karakter.
                </p>
                <Textarea
                  placeholder="Tulis ringkasan singkat artikel ini..."
                  value={form.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{form.excerpt.length}/200</p>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Konten Artikel *</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <RichTextEditor
                  value={form.content}
                  onChange={(val) => handleChange('content', val)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status Publikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Publikasikan sekarang</p>
                    <p className="text-xs text-gray-500">Artikel langsung muncul di blog</p>
                  </div>
                  <Switch
                    checked={form.published}
                    onCheckedChange={(v) => handleChange('published', v)}
                  />
                </div>
                <div className="pt-2 space-y-2">
                  <Button
                    className="w-full bg-[#1E8E5A] hover:bg-[#15663f]"
                    onClick={() => handleSubmit(true)}
                    disabled={submitting}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Publikasikan
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSubmit(false)}
                    disabled={submitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Draft
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thumbnail / Cover</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="URL gambar cover..."
                  value={form.thumbnail}
                  onChange={(e) => handleChange('thumbnail', e.target.value)}
                />
                {form.thumbnail && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img
                      src={form.thumbnail}
                      alt="preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Gunakan URL gambar dari Unsplash, atau upload via halaman produk lalu salin URL-nya.
                </p>
              </CardContent>
            </Card>

            {/* Author */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Penulis</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Nama penulis (opsional)"
                  value={form.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tags / Kata Kunci</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Tambah tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); addTag(); }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addTag} size="sm">
                    +
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Tekan Enter untuk menambah tag. Tags membantu SEO.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
