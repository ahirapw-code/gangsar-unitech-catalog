// app/api/rfq/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    const rfqs = await db.collection('rfqs').find({}).sort({ createdAt: -1 }).toArray();
    const serialized = rfqs.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
    return NextResponse.json(serialized);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const doc = { ...body, status: 'pending', createdAt: new Date() };
    const result = await db.collection('rfqs').insertOne(doc);
    return NextResponse.json({ id: result.insertedId.toString(), ...doc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
