// app/api/rfq/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { sendEmail } from '@/lib/email';

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

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gangsarunitech.id';
    const productList = (body.products || [])
      .map(p => `<li><strong>${p.name}</strong> (SKU: ${p.sku}) — Qty: ${p.quantity}</li>`)
      .join('');

    await sendEmail({
      to: adminEmail,
      subject: `[New RFQ] ${body.fullName || body.company || 'Customer'} - ${body.company || ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1E8E5A; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">New Quotation Request</h1>
            <p style="color: #d1fae5; margin: 4px 0 0;">Gangsar Unitech</p>
          </div>
          <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; font-size: 16px; margin-top: 0;">Contact Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Name</td><td style="padding: 6px 0; font-weight: bold;">${body.fullName || '-'}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280;">Company</td><td style="padding: 6px 0;">${body.company || '-'}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280;">Phone</td><td style="padding: 6px 0;">${body.phone || '-'}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;">${body.email || '-'}</td></tr>
            </table>

            <h2 style="color: #111827; font-size: 16px; margin-top: 20px;">Products Requested</h2>
            <ul style="padding-left: 20px; color: #374151;">${productList || '<li>No products listed</li>'}</ul>

            ${body.notes ? `
            <h2 style="color: #111827; font-size: 16px; margin-top: 20px;">Notes</h2>
            <p style="color: #374151; background: white; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">${body.notes}</p>
            ` : ''}

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <a href="https://www.gangsarunitech.id/admin/rfq" 
                 style="background: #1E8E5A; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                View in Dashboard →
              </a>
            </div>
          </div>
        </div>
      `
    });

    return NextResponse.json({ id: result.insertedId.toString(), ...doc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
