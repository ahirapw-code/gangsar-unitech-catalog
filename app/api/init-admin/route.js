import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET(request) {
  try {
    const db = await getDb();
    
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@gangsarunitech.id';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123456';
    
    // Check if admin exists
    const existing = await db.collection('users').findOne({ email: adminEmail });
    
    if (existing) {
      return NextResponse.json({ 
        message: 'Admin user already exists',
        email: adminEmail,
        created: false
      });
    }
    
    // Create admin user
    const hashedPassword = await hashPassword(adminPassword);
    await db.collection('users').insertOne({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Admin user created successfully!',
      email: adminEmail,
      password: '(hidden - check your ADMIN_DEFAULT_PASSWORD env var)',
      created: true
    });
    
  } catch (error) {
    console.error('Init admin error:', error);
    return NextResponse.json({ 
      error: error.message,
      details: 'Check if MONGO_URL environment variable is set correctly'
    }, { status: 500 });
  }
}
