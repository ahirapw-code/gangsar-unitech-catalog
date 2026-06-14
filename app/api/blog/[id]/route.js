// app/api/blog/[id]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

async function findPost(db, id) {
  // Coba ObjectId dulu
  if (/^[a-f\d]{24}$/i.test(id)) {
    const post = await db.collection('blog_posts').findOne({ _id: new ObjectId(id) });
    if (post) return post;
  }
  // Coba by slug
  return await db.collection('blog_posts').findOne({ slug: id });
}

export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const post = await findPost(db, params.id);

    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { _id, ...rest } = post;
    return NextResponse.json({ id: _id.toString(), ...rest });
  } catch (error) {
    console.error('Blog GET[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id: _bodyId, _id: _objId, ...body } = await request.json();

    let query;
    if (/^[a-f\d]{24}$/i.test(params.id)) {
      query = { _id: new ObjectId(params.id) };
    } else {
      query = { slug: params.id };
    }

    await db.collection('blog_posts').updateOne(
      query,
      { $set: { ...body, updatedAt: new Date() } }
    );

    return NextResponse.json({ id: params.id, ...body });
  } catch (error) {
    console.error('Blog PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { db } = await connectToDatabase();

    let query;
    if (/^[a-f\d]{24}$/i.test(params.id)) {
      query = { _id: new ObjectId(params.id) };
    } else {
      query = { slug: params.id };
    }

    await db.collection('blog_posts').deleteOne(query);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
