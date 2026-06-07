// app/api/admin/stats/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();

    const [totalProducts, totalRfqs, promoProducts, outOfStock, preOrderProducts] = await Promise.all([
      db.collection('products').countDocuments({}),
      db.collection('rfqs').countDocuments({}),
      db.collection('products').countDocuments({ isPromo: true }),
      db.collection('products').countDocuments({ inStock: false }),
      db.collection('products').countDocuments({ preOrder: true }),
    ]);

    return NextResponse.json({
      totalProducts,
      totalRfqs,
      promoProducts,
      outOfStock,
      preOrderProducts,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
