// app/api/[[...path]]/route.js
import { NextResponse } from 'next/server';
import clientPromise, { getClientDb } from '@/lib/mongodb';

const MASTER_CATEGORIES = [
  { id: 'cat-electrical', name: 'Electrical', slug: 'electrical',
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&q=80',
    description: 'Electrical components, cables, switches, and control panels', order: 1 },
  { id: 'cat-mechanical', name: 'Mechanical', slug: 'mechanical',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80',
    description: 'Gears, shafts, couplings, and mechanical transmission parts', order: 2 },
  { id: 'cat-pneumatic', name: 'Pneumatic', slug: 'pneumatic',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80',
    description: 'Pneumatic cylinders, valves, fittings, and air preparation units', order: 3 },
  { id: 'cat-bearing', name: 'Bearing', slug: 'bearing',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&q=80',
    description: 'Ball bearings, roller bearings, pillow blocks, and related parts', order: 4 },
  { id: 'cat-general', name: 'General', slug: 'general',
    image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=400&q=80',
    description: 'General industrial spareparts and miscellaneous components', order: 5 },
];

export async function GET(request) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    const segments = pathname.replace('/api/', '').split('/');
    const resource = segments[0];

    const db = await getClientDb();

    if (resource === 'products') {
      const filter = {};

      // Filters
      if (searchParams.get('promo') === 'true') filter.isPromo = true;
      if (searchParams.get('featured') === 'true') filter.featured = true;
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

      // Single product by ID
      const productId = segments[1];
      if (productId) {
        let product = null;
        // Try ObjectId (24-char hex)
        if (/^[a-f\d]{24}$/i.test(productId)) {
          const { ObjectId } = await import('mongodb');
          product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
        }
        // Try by uuid id field
        if (!product) {
          product = await db.collection('products').findOne({ id: productId });
        }
        // Try by slug
        if (!product) {
          product = await db.collection('products').findOne({ slug: productId });
        }
        if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        const { _id, ...rest } = product;
        return NextResponse.json({ id: rest.id || _id.toString(), ...rest });
      }

      const [products, total] = await Promise.all([
        db.collection('products').find(filter).sort(sort).skip(skip).limit(limit).toArray(),
        db.collection('products').countDocuments(filter),
      ]);

      const serialized = products.map(({ _id, ...rest }) => ({ id: rest.id || _id.toString(), ...rest }));

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

    if (resource === 'rfq') {
      const rfqs = await db.collection('rfqs').find({}).sort({ createdAt: -1 }).toArray();
      const serialized = rfqs.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
      return NextResponse.json(serialized);
    }

    if (resource === 'categories') {
      // withSubcategories: derive from products collection
      const withSub = searchParams.get('withSubcategories') === 'true';
      if (!withSub) return NextResponse.json(MASTER_CATEGORIES);

      const products = await db.collection('products').find({}).toArray();
      const subcatMap = {};
      products.forEach((p) => {
        const slug = p.categorySlug || p.category?.toLowerCase().replace(/\s+/g, '-');
        const subcat = p.subcategory?.trim();
        if (slug && subcat) {
          if (!subcatMap[slug]) subcatMap[slug] = new Set();
          subcatMap[slug].add(subcat);
        }
      });
      const result = MASTER_CATEGORIES.map((cat) => ({
        ...cat,
        subcategories: subcatMap[cat.slug] ? Array.from(subcatMap[cat.slug]).sort() : [],
      }));
      return NextResponse.json(result);
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

    const db = await getClientDb();
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

    const db = await getClientDb();
    const rawBody = await request.json();
    // Strip 'id' and '_id' from body to avoid MongoDB conflicts
    const { id: _bodyId, _id: _bodyObjId, ...body } = rawBody;
    const { ObjectId } = await import('mongodb');

    if (resource === 'products' && id) {
      let query;
      if (/^[a-f\d]{24}$/i.test(id)) {
        query = { _id: new ObjectId(id) };
      } else {
        query = { id: id };
      }
      const result = await db.collection('products').updateOne(
        query,
        { $set: { ...body, updatedAt: new Date() } }
      );
      console.log('Product update result:', JSON.stringify(result));
      return NextResponse.json({ id, ...body });
    }

    if (resource === 'rfq' && id) {
      let query;
      if (/^[a-f\d]{24}$/i.test(id)) {
        query = { _id: new ObjectId(id) };
      } else {
        query = { id: id };
      }
      const result = await db.collection('rfqs').updateOne(
        query,
        { $set: { ...body, updatedAt: new Date() } }
      );
      console.log('RFQ update result:', JSON.stringify(result));
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'RFQ not found with id: ' + id }, { status: 404 });
      }
      return NextResponse.json({ id, ...body });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('PUT API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.replace('/api/', '').split('/');
    const resource = segments[0];
    const id = segments[1];

    const db = await getClientDb();
    const { ObjectId } = await import('mongodb');

    if (resource === 'products' && id) {
      let query;
      if (/^[a-f\d]{24}$/i.test(id)) {
        query = { _id: new ObjectId(id) };
      } else {
        query = { id: id };
      }
      await db.collection('products').deleteOne(query);
      return NextResponse.json({ success: true });
    }

    if (resource === 'rfq' && id) {
      let query;
      if (/^[a-f\d]{24}$/i.test(id)) {
        query = { _id: new ObjectId(id) };
      } else {
        query = { id: id };
      }
      await db.collection('rfqs').deleteOne(query);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
