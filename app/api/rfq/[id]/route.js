// app/api/rfq/[id]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');
    const body = await request.json();
    await db.collection('rfqs').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...body, updatedAt: new Date() } }
    );
    return NextResponse.json({ id: params.id, ...body });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');
    await db.collection('rfqs').deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
