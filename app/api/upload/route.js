import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

// This allows file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.name.replace(/\s+/g, '-').toLowerCase();
    const uniqueFilename = `${uniqueSuffix}-${filename}`;

    // Save to public/uploads/products
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    const filepath = path.join(uploadDir, uniqueFilename);

    await writeFile(filepath, buffer);

    // Return the public URL
    const imageUrl = `/uploads/products/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image: ' + error.message },
      { status: 500 }
    );
  }
}

// Allow deleting uploaded images
export async function DELETE(request) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl || !imageUrl.startsWith('/uploads/products/')) {
      return NextResponse.json(
        { error: 'Invalid image URL' },
        { status: 400 }
      );
    }

    const filepath = path.join(process.cwd(), 'public', imageUrl);
    
    // Delete the file
    const fs = require('fs').promises;
    await fs.unlink(filepath);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image: ' + error.message },
      { status: 500 }
    );
  }
}
