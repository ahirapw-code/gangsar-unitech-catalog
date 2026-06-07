import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const [totalProducts, totalRFQs, pendingRFQs, promoProducts, preOrderProducts] = await Promise.all([
      db.collection('products').countDocuments({}),
      db.collection('rfqs').countDocuments({}),
      db.collection('rfqs').countDocuments({ status: 'pending' }),
      db.collection('products').countDocuments({ isPromo: true }),
      db.collection('products').countDocuments({ preOrder: true }),
    ]);
    return NextResponse.json({
      totalProducts,
      totalCategories: 5,   // static — always 5 master categories
      totalRFQs,
      pendingRFQs,
      promoProducts,
      preOrderProducts,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
