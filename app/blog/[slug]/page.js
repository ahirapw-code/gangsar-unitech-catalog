// app/blog/[slug]/page.js
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

async function getPost(slug) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const res = await fetch(`${baseUrl}/api/blog/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getRelatedPosts(tags = []) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const res = await fetch(`${baseUrl}/api/blog?limit=3`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Artikel Tidak Ditemukan' };

  return {
    title: `${post.title} | Blog Gangsar Unitech`,
    description: post.excerpt || post.content?.replace(/<[^>]*>/g, '').slice(0, 160),
    keywords: post.tags?.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content?.replace(/<[^>]*>/g, '').slice(0, 160),
      images: post.thumbnail ? [{ url: post.thumbnail }] : [],
      type: 'article',
      publishedTime: post.createdAt,
    },
  };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);

  if (!post || !post.published) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.tags);
  const otherPosts = relatedPosts.filter((p) => p.slug !== params.slug).slice(0, 2);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#1E8E5A]">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#1E8E5A]">Blog</Link>
            <span>/</span>
            <span className="text-gray-700 line-clamp-1">{post.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Back button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-6 -ml-2 text-gray-500 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Blog
          </Button>
        </Link>

        {/* Header */}
        <article>
          <header className="mb-8">
            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-[#1E8E5A]/10 text-[#1E8E5A]"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 pb-6 border-b">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              {post.author && (
                <span>oleh <strong className="text-gray-700">{post.author}</strong></span>
              )}
            </div>

            {/* Thumbnail */}
            {post.thumbnail && (
              <div className="mt-6 rounded-xl overflow-hidden">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}
          </header>

          {/* Excerpt / intro */}
          {post.excerpt && (
            <p className="text-lg text-gray-600 font-medium mb-6 leading-relaxed border-l-4 border-[#1E8E5A] pl-4">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-[#1E8E5A] prose-strong:text-gray-900 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-[#1E8E5A] to-[#15663f] rounded-xl text-white text-center">
          <h3 className="text-xl font-bold mb-2">Butuh Sparepart Industri?</h3>
          <p className="text-gray-100 mb-4 text-sm">
            Gangsar Unitech menyediakan bearing, valve, gearbox, dan berbagai komponen industri berkualitas.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/products">
              <Button variant="secondary" className="bg-white text-[#1E8E5A] hover:bg-gray-100">
                Lihat Produk
              </Button>
            </Link>
            <Link href="/rfq">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Minta Penawaran
              </Button>
            </Link>
          </div>
        </div>

        {/* Related posts */}
        {otherPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Artikel Lainnya</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {otherPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`} className="group">
                  <div className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    {related.thumbnail && (
                      <img
                        src={related.thumbnail}
                        alt={related.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#1E8E5A] transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(related.createdAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
