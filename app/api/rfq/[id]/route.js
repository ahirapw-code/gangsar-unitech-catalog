// app/api/rfq/[id]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

function buildQuery(id) {
  // UUID format: use id field; 24-char hex: use ObjectId _id
  return /^[a-f\d]{24}$/i.test(id) ? null : { id };
}

export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { id: _id, _id: _objId, ...updateBody } = body;

    let query = buildQuery(params.id);
    if (!query) {
      const { ObjectId } = await import('mongodb');
      query = { _id: new ObjectId(params.id) };
    }

    const result = await db.collection('rfqs').updateOne(
      query,
      { $set: { ...updateBody, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'RFQ not found' }, { status: 404 });
    }

    return NextResponse.json({ id: params.id, ...updateBody });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { db } = await connectToDatabase();

    let query = buildQuery(params.id);
    if (!query) {
      const { ObjectId } = await import('mongodb');
      query = { _id: new ObjectId(params.id) };
    }

    await db.collection('rfqs').deleteOne(query);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
