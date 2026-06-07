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

      // Filters
      if (searchParams.get('promo') === 'true') filter.isPromo = true;
      if (searchParams.get('category')) filter.categorySlug = searchParams.get('category');
      if (searchParams.get('subcategory')) filter.subcategory = searchParams.get('subcategory');

      // Search by name or SKU
      if (searchParams.get('search')) {
        const q = searchParams.get('search');
        filter.$or = [
          { name: { $regex: q, $options: 'i' } },
          { sku:  { $regex: q, $options: 'i' } },
        ];
      }

      // Sort
      let sort = { createdAt: -1 };
      const sortParam = searchParams.get('sort');
      if (sortParam === 'price-low')  sort = { price: 1 };
      if (sortParam === 'price-high') sort = { price: -1 };
      if (sortParam === 'promo')      sort = { isPromo: -1, discount: -1 };

      // Pagination
      const limit = parseInt(searchParams.get('limit') || '12', 10);
      const page  = parseInt(searchParams.get('page')  || '1',  10);
      const skip  = (page - 1) * limit;

      const [products, total] = await Promise.all([
        db.collection('products').find(filter).sort(sort).skip(skip).limit(limit).toArray(),
        db.collection('products').countDocuments(filter),
      ]);

      const serialized = products.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));

      return NextResponse.json({
        products: serialized,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
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
      const doc = { ...body, createdAt: new Date() };
      const result = await db.collection('products').insertOne(doc);
      return NextResponse.json({ id: result.insertedId.toString(), ...doc }, { status: 201 });
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
        { $set: { ...body, updatedAt: new Date() } }
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
