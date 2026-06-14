'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft, BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

export default function AdminBlogPage() {
  const router = useRouter();
  const { admin, loading, getToken } = useAdmin();
  const [posts, setPosts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!loading && !admin) router.push('/admin/login');
    else if (admin) fetchPosts(1, '');
  }, [admin, loading]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (admin) fetchPosts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  async function fetchPosts(page, search) {
    setLoadingData(true);
    try {
      const params = new URLSearchParams({ all: 'true', page, limit: 10 });
      if (search) params.set('search', search);
      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setPagination(data.pagination || null);
    } catch {
      toast.error('Gagal memuat artikel');
    } finally {
      setLoadingData(false);
    }
  }

  async function handleDelete(id, title) {
    if (!confirm(`Hapus artikel "${title}"?`)) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Artikel dihapus');
        fetchPosts(currentPage, searchTerm);
      } else {
        toast.error('Gagal menghapus artikel');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    }
  }

  async function togglePublish(post) {
    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, published: !post.published }),
      });
      if (res.ok) {
        toast.success(post.published ? 'Artikel disembunyikan' : 'Artikel dipublikasikan');
        fetchPosts(currentPage, searchTerm);
      }
    } catch {
      toast.error('Terjadi kesalahan');
    }
  }

  function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
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
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Blog</h1>
                <p className="text-gray-500 text-sm">{pagination?.total ?? 0} artikel total</p>
              </div>
            </div>
            <Link href="/admin/blog/add">
              <Button className="bg-[#1E8E5A] hover:bg-[#15663f]">
                <Plus className="mr-2 h-4 w-4" />
                Tulis Artikel
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari artikel..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* List */}
        {loadingData ? (
          <div className="text-center py-20 text-gray-400">Memuat...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-500 mb-2">Belum ada artikel</h2>
            <p className="text-gray-400 mb-6">Mulai tulis artikel pertama kamu!</p>
            <Link href="/admin/blog/add">
              <Button className="bg-[#1E8E5A] hover:bg-[#15663f]">
                <Plus className="mr-2 h-4 w-4" />
                Tulis Artikel
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    {post.thumbnail ? (
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-gray-300" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{post.title}</h3>
                          <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                            {post.excerpt || post.content?.replace(/<[^>]*>/g, '').slice(0, 100)}
                          </p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
                            {post.tags?.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            <Badge
                              className={`text-xs ${
                                post.published
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {post.published ? 'Dipublikasikan' : 'Draft'}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            title={post.published ? 'Sembunyikan' : 'Publikasikan'}
                            onClick={() => togglePublish(post)}
                          >
                            {post.published ? (
                              <EyeOff className="h-4 w-4 text-orange-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          {post.published && (
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Button size="sm" variant="ghost" title="Lihat di website">
                                <Eye className="h-4 w-4 text-blue-500" />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/admin/blog/edit/${post.id}`}>
                            <Button size="sm" variant="ghost" title="Edit">
                              <Edit className="h-4 w-4 text-gray-600" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Hapus"
                            onClick={() => handleDelete(post.id, post.title)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {currentPage > 1 && (
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p - 1)}>
                ← Sebelumnya
              </Button>
            )}
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={p === currentPage ? 'default' : 'outline'}
                className={p === currentPage ? 'bg-[#1E8E5A] hover:bg-[#15663f]' : ''}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </Button>
            ))}
            {currentPage < pagination.pages && (
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p + 1)}>
                Berikutnya →
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
