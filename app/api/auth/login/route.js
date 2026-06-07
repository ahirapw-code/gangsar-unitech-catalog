// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Auto-create admin if no user found and credentials match defaults
      const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@gangsarunitech.id';
      const defaultPass  = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123456';

      if (email.toLowerCase().trim() === defaultEmail && password === defaultPass) {
        const bcrypt = await import('bcryptjs');
        const hashed = await bcrypt.default.hash(password, 10);
        await db.collection('users').insertOne({
          email: defaultEmail,
          password: hashed,
          role: 'admin',
          createdAt: new Date(),
        });
        const token = generateToken();
        return NextResponse.json({
          token,
          user: { email: defaultEmail, role: 'admin' },
        });
      }

      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken();
    return NextResponse.json({
      token,
      user: { email: user.email, role: user.role },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}
