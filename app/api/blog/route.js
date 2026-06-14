// app/api/blog/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { db } = await connectToDatabase();

    const filter = {};
    // Publik hanya melihat yang published, admin bisa lihat semua
    const showAll = searchParams.get('all') === 'true';
    if (!showAll) filter.published = true;

    // Search
    const search = searchParams.get('search');
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const page  = parseInt(searchParams.get('page')  || '1',  10);
    const skip  = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      db.collection('blog_posts')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('blog_posts').countDocuments(filter),
    ]);

    const serialized = posts.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));

    return NextResponse.json({
      posts: serialized,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();

    // Buat slug dari title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Cek slug unik
    const existing = await db.collection('blog_posts').findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const doc = {
      ...body,
      slug: finalSlug,
      published: body.published ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('blog_posts').insertOne(doc);
    return NextResponse.json(
      { id: result.insertedId.toString(), ...doc },
      { status: 201 }
    );
  } catch (error) {
    console.error('Blog POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
