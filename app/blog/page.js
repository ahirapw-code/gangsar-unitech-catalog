// app/blog/page.js
import Link from 'next/link';
import { Calendar, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Blog & Artikel Industri | Gangsar Unitech',
  description:
    'Baca artikel seputar sparepart industri, tips perawatan mesin, bearing, valve, dan solusi teknik dari Gangsar Unitech Surabaya.',
  keywords:
    'blog industri, artikel sparepart, tips perawatan mesin, bearing, valve, gearbox, Surabaya',
};

async function getPosts(page = 1) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const res = await fetch(
      `${baseUrl}/api/blog?published=true&page=${page}&limit=9`,
      { cache: 'no-store' }
    );
    if (!res.ok) return { posts: [], pagination: null };
    return res.json();
  } catch {
    return { posts: [], pagination: null };
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').slice(0, 160);
}

export default async function BlogPage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1', 10);
  const { posts, pagination } = await getPosts(page);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-[#1E8E5A] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Artikel</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tips, insight, dan informasi seputar industri sparepart, perawatan mesin, dan solusi teknik dari tim Gangsar Unitech.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-500 mb-2">Belum ada artikel</h2>
            <p className="text-gray-400">Artikel akan segera hadir. Pantau terus!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    {/* Thumbnail */}
                    {post.thumbnail && (
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    {!post.thumbnail && (
                      <div className="h-48 bg-gradient-to-br from-[#1E8E5A]/10 to-[#1E8E5A]/30 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-[#1E8E5A]/40" />
                      </div>
                    )}

                    <CardContent className="p-6">
                      {/* Tags */}
                      {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-[#1E8E5A]/10 text-[#1E8E5A]"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <h2 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1E8E5A] transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt || stripHtml(post.content)}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#1E8E5A] font-medium">
                          <span>Baca</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {page > 1 && (
                  <Link
                    href={`/blog?page=${page - 1}`}
                    className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    ← Sebelumnya
                  </Link>
                )}
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/blog?page=${p}`}
                    className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                      p === page
                        ? 'bg-[#1E8E5A] text-white border-[#1E8E5A]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {page < pagination.pages && (
                  <Link
                    href={`/blog?page=${page + 1}`}
                    className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    Berikutnya →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
