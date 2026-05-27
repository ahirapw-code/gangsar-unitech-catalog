import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, verifyPassword, initializeAdmin } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { initializeData } from '@/lib/initData';
import { v4 as uuidv4 } from 'uuid';

// Initialize admin and data on startup
let initialized = false;
async function initialize() {
  if (!initialized) {
    try {
      await initializeAdmin();
      await initializeData();
      initialized = true;
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }
}

// Helper function to check auth
function checkAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// GET Handler
export async function GET(request) {
  await initialize();
  
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.replace('/api/', '');

  try {
    const db = await getDb();

    // Get all categories
    if (path === 'categories') {
      const categories = await db.collection('categories').find({}).toArray();
      return NextResponse.json(categories);
    }

    // Get all products with filters
    if (path === 'products') {
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      const promo = searchParams.get('promo');
      const sort = searchParams.get('sort') || 'newest';
      const page = parseInt(searchParams.get('page')) || 1;
      const limit = parseInt(searchParams.get('limit')) || 12;

      let query = {};
      
      if (category && category !== 'all') {
        query.categorySlug = category;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (promo === 'true') {
        query.isPromo = true;
      }

      let sortQuery = {};
      if (sort === 'newest') {
        sortQuery.createdAt = -1;
      } else if (sort === 'promo') {
        sortQuery.isPromo = -1;
      } else if (sort === 'price-low') {
        sortQuery.price = 1;
      } else if (sort === 'price-high') {
        sortQuery.price = -1;
      }

      const skip = (page - 1) * limit;
      
      const products = await db.collection('products')
        .find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection('products').countDocuments(query);

      return NextResponse.json({
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }

    // Get single product by slug
    if (path.startsWith('products/')) {
      const slug = path.split('/')[1];
      const product = await db.collection('products').findOne({ slug });
      
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      // Get related products from same category
      const relatedProducts = await db.collection('products')
        .find({ 
          categorySlug: product.categorySlug,
          id: { $ne: product.id }
        })
        .limit(4)
        .toArray();

      return NextResponse.json({ ...product, relatedProducts });
    }

    // Get featured/promo products for homepage
    if (path === 'products/featured') {
      const featured = await db.collection('products')
        .find({ featured: true })
        .limit(8)
        .toArray();
      
      return NextResponse.json(featured);
    }

    // Get promo products
    if (path === 'products/promo') {
      const promoProducts = await db.collection('products')
        .find({ isPromo: true })
        .limit(8)
        .toArray();
      
      return NextResponse.json(promoProducts);
    }

    // Get all RFQs (admin only)
    if (path === 'rfq') {
      const token = checkAuth(request);
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const rfqs = await db.collection('rfqs')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return NextResponse.json(rfqs);
    }

    // Dashboard stats (admin only)
    if (path === 'admin/stats') {
      const token = checkAuth(request);
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const totalProducts = await db.collection('products').countDocuments();
      const totalCategories = await db.collection('categories').countDocuments();
      const totalRFQs = await db.collection('rfqs').countDocuments();
      const pendingRFQs = await db.collection('rfqs').countDocuments({ status: 'pending' });

      return NextResponse.json({
        totalProducts,
        totalCategories,
        totalRFQs,
        pendingRFQs
      });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST Handler
export async function POST(request) {
  await initialize();
  
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/', '');

  try {
    const db = await getDb();
    const body = await request.json();

    // Admin login
    if (path === 'auth/login') {
      const { email, password } = body;
      
      const user = await db.collection('users').findOne({ email });
      
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const isValid = await verifyPassword(password, user.password);
      
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      await db.collection('sessions').insertOne({
        userId: user.email,
        token,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      return NextResponse.json({
        token,
        user: {
          email: user.email,
          role: user.role
        }
      });
    }

    // Create RFQ
    if (path === 'rfq') {
      const { fullName, companyName, phone, email, products, notes } = body;

      const rfq = {
        id: uuidv4(),
        fullName,
        companyName,
        phone,
        email,
        products,
        notes,
        status: 'pending',
        createdAt: new Date()
      };

      await db.collection('rfqs').insertOne(rfq);

      // Send email notification
      const productList = products.map(p => 
        `<li><strong>${p.name}</strong> (SKU: ${p.sku}) - Quantity: ${p.quantity || 1}</li>`
      ).join('');

      const emailHtml = `
        <h2>New Quotation Request</h2>
        <p><strong>From:</strong> ${fullName}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <h3>Products Requested:</h3>
        <ul>${productList}</ul>
        <p><strong>Additional Notes:</strong></p>
        <p>${notes || 'None'}</p>
      `;

      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@gangsarunitech.com',
        subject: `New RFQ from ${companyName}`,
        html: emailHtml
      });

      return NextResponse.json({ success: true, rfq });
    }

    // Create product (admin only)
    if (path === 'products') {
      const token = checkAuth(request);
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const product = {
        id: uuidv4(),
        ...body,
        slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        createdAt: new Date()
      };

      await db.collection('products').insertOne(product);
      return NextResponse.json(product);
    }

    // Create category (admin only)
    if (path === 'categories') {
      const token = checkAuth(request);
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const category = {
        id: uuidv4(),
        ...body,
        slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        createdAt: new Date()
      };

      await db.collection('categories').insertOne(category);
      return NextResponse.json(category);
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT Handler
export async function PUT(request) {
  await initialize();
  
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/', '');

  try {
    const token = checkAuth(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const body = await request.json();

    // Update product
    if (path.startsWith('products/')) {
      const id = path.split('/')[1];
      
      const { id: _, _id, ...updateData } = body;
      
      const result = await db.collection('products').updateOne(
        { id },
        { $set: { ...updateData, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    }

    // Update RFQ status
    if (path.startsWith('rfq/')) {
      const id = path.split('/')[1];
      
      const result = await db.collection('rfqs').updateOne(
        { id },
        { $set: { status: body.status, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'RFQ not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    }

    // Update category
    if (path.startsWith('categories/')) {
      const id = path.split('/')[1];
      
      const { id: _, _id, ...updateData } = body;
      
      const result = await db.collection('categories').updateOne(
        { id },
        { $set: { ...updateData, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE Handler
export async function DELETE(request) {
  await initialize();
  
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/', '');

  try {
    const token = checkAuth(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();

    // Delete product
    if (path.startsWith('products/')) {
      const id = path.split('/')[1];
      
      const result = await db.collection('products').deleteOne({ id });

      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    }

    // Delete category
    if (path.startsWith('categories/')) {
      const id = path.split('/')[1];
      
      const result = await db.collection('categories').deleteOne({ id });

      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
