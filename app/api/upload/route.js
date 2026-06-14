import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { addWatermark } from '@/lib/watermark';

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

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Konversi file ke buffer
    const arrayBuffer = await file.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    // Proses watermark (hanya untuk image)
    let finalBuffer = originalBuffer;
    const mimeType = file.type || 'image/jpeg';

    if (mimeType.startsWith('image/')) {
      try {
        finalBuffer = await addWatermark(originalBuffer);
        console.log('[Upload] Watermark berhasil diterapkan');
      } catch (wmError) {
        console.warn('[Upload] Gagal menerapkan watermark, upload gambar asli:', wmError.message);
        // Fallback: upload gambar asli tanpa watermark
        finalBuffer = originalBuffer;
      }
    }

    // Generate unique filename (selalu .jpg karena output sharp adalah jpeg)
    const timestamp = Date.now();
    const baseName = file.name.replace(/\s+/g, '-').toLowerCase().replace(/\.[^.]+$/, '');
    const uniqueFilename = `products/${timestamp}-${baseName}.jpg`;

    // Upload buffer hasil watermark ke Vercel Blob
    const blob = await put(uniqueFilename, finalBuffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'image/jpeg',
    });

    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
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

// Delete image from Vercel Blob
export async function DELETE(request) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Delete from Vercel Blob
    await del(imageUrl);

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
