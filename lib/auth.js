import bcrypt from 'bcryptjs';
import { getDb } from './db';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function initializeAdmin() {
  const db = await getDb();
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@gangsarunitech.com';
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123456';

  const existingAdmin = await db.collection('users').findOne({ email: adminEmail });
  
  if (!existingAdmin) {
    const hashedPassword = await hashPassword(adminPassword);
    await db.collection('users').insertOne({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    });
    console.log('Admin user created:', adminEmail);
  }
}

export function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}