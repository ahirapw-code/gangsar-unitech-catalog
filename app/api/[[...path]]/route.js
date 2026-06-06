// app/api/[[...path]]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    const segments = pathname.replace('/api/', '').split('/');
    const resource = segments[0];

    const client = await clientPromise;
    const db = client.db();

    if (resource === 'products') {
      const filter = {};
      if (searchParams.get('promo') === 'true') filter.isPromo = true;
      if (searchParams.get('category')) filter.categorySlug = searchParams.get('category');

      const limit = parseInt(searchParams.get('limit') || '20', 10);
      const page  = parseInt(searchParams.get('page')  || '1',  10);
      const skip  = (page - 1) * limit;

      const [products, total] = await Promise.all([
        db.collection('products').find(filter).skip(skip).limit(limit).toArray(),
        db.collection('products').countDocuments(filter),
      ]);

      // Convert MongoDB _id to string id
      const serialized = products.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
      return NextResponse.json({ products: serialized, total, page, limit });
    }

    if (resource === 'categories') {
      const categories = await db.collection('categories').find({}).sort({ order: 1 }).toArray();
      const serialized = categories.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
      return NextResponse.json(serialized);
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.replace('/api/', '').split('/');
    const resource = segments[0];

    const client = await clientPromise;
    const db = client.db();
    const body = await request.json();

    if (resource === 'products') {
      const result = await db.collection('products').insertOne(body);
      return NextResponse.json({ id: result.insertedId.toString(), ...body }, { status: 201 });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.replace('/api/', '').split('/');
    const resource = segments[0];
    const id = segments[1];

    const client = await clientPromise;
    const db = client.db();
    const body = await request.json();
    const { ObjectId } = await import('mongodb');

    if (resource === 'products' && id) {
      await db.collection('products').updateOne(
        { _id: new ObjectId(id) },
        { $set: body }
      );
      return NextResponse.json({ id, ...body });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.replace('/api/', '').split('/');
    const resource = segments[0];
    const id = segments[1];

    const client = await clientPromise;
    const db = client.db();
    const { ObjectId } = await import('mongodb');

    if (resource === 'products' && id) {
      await db.collection('products').deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
