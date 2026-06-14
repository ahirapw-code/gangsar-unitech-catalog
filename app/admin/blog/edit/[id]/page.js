'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, X, Trash2 } from 'lucide-react';
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

export default function EditBlogPage({ params }) {
  const router = useRouter();
  const { admin, loading } = useAdmin();
  const [submitting, setSubmitting] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
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
    if (!loading && !admin) {
      router.push('/admin/login');
    } else if (admin) {
      fetchPost();
    }
  }, [admin, loading]);

  async function fetchPost() {
    try {
      const res = await fetch(`/api/blog/${params.id}`);
      if (!res.ok) { toast.error('Artikel tidak ditemukan'); router.push('/admin/blog'); return; }
      const data = await res.json();
      setForm({
        title: data.title || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        thumbnail: data.thumbnail || '',
        author: data.author || '',
        tags: data.tags || [],
        published: data.published || false,
      });
    } catch {
      toast.error('Gagal memuat artikel');
    } finally {
      setLoadingPost(false);
    }
  }

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

  async function handleSubmit(publishNow) {
    if (!form.title.trim()) { toast.error('Judul artikel wajib diisi'); return; }
    if (!form.content.trim() || form.content === '<br>') { toast.error('Konten artikel wajib diisi'); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        published: publishNow !== undefined ? publishNow : form.published,
      };
      const res = await fetch(`/api/blog/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Artikel berhasil diperbarui!');
        router.push('/admin/blog');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Gagal memperbarui artikel');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Hapus artikel ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/blog/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Artikel dihapus');
        router.push('/admin/blog');
      }
    } catch {
      toast.error('Gagal menghapus artikel');
    }
  }

  if (loading || !admin || loadingPost) {
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
              <h1 className="text-xl font-bold text-gray-900">Edit Artikel</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={submitting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </Button>
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
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold mb-2 block">Judul Artikel *</Label>
                <Input
                  placeholder="Masukkan judul artikel..."
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="text-lg"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-semibold mb-1 block">Ringkasan (Excerpt)</Label>
                <p className="text-xs text-gray-500 mb-2">Tampil di daftar blog & meta description SEO.</p>
                <Textarea
                  placeholder="Tulis ringkasan singkat..."
                  value={form.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{form.excerpt.length}/200</p>
              </CardContent>
            </Card>

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
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status Publikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Dipublikasikan</p>
                    <p className="text-xs text-gray-500">Artikel muncul di halaman blog</p>
                  </div>
                  <Switch
                    checked={form.published}
                    onCheckedChange={(v) => handleChange('published', v)}
                  />
                </div>
                <div className="pt-2 space-y-2">
                  <Button
                    className="w-full bg-[#1E8E5A] hover:bg-[#15663f]"
                    onClick={() => handleSubmit()}
                    disabled={submitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                  {form.published && (
                    <Link href={`/blog`} target="_blank">
                      <Button variant="outline" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat di Blog
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

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
              </CardContent>
            </Card>

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
                  <Button type="button" variant="outline" onClick={addTag} size="sm">+</Button>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
