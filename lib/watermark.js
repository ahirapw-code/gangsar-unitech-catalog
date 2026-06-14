import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Menambahkan watermark logo ke buffer gambar.
 * Logo diambil dari /public/watermark-logo.png
 * Posisi: pojok kanan bawah, dengan opacity 60%.
 */
export async function addWatermark(inputBuffer) {
  const logoPath = path.join(process.cwd(), 'public', 'watermark-logo.png');

  // Pastikan file logo ada
  if (!fs.existsSync(logoPath)) {
    console.warn('[Watermark] watermark-logo.png tidak ditemukan di /public, skip watermark.');
    return inputBuffer;
  }

  // Ambil metadata foto asli
  const metadata = await sharp(inputBuffer).metadata();
  const imgWidth = metadata.width || 800;
  const imgHeight = metadata.height || 600;

  // Hitung ukuran watermark: 25% dari lebar foto, minimal 80px, maksimal 300px
  const wmWidth = Math.min(300, Math.max(80, Math.floor(imgWidth * 0.25)));

  // Resize logo & beri opacity 60%
  const watermarkBuffer = await sharp(logoPath)
    .resize(wmWidth)
    .ensureAlpha()           // pastikan ada channel alpha
    .composite([{
      input: Buffer.from([0, 0, 0, 0]),  // fill transparan
      raw: { width: 1, height: 1, channels: 4 },
      tile: true,
      blend: 'dest-in',
    }])
    .modulate({})            // no-op supaya pipeline valid
    .toBuffer();

  // Buat versi logo dengan opacity 60% menggunakan raw manipulation
  const logoResized = await sharp(logoPath)
    .resize(wmWidth)
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  // Terapkan opacity 60% pada channel alpha
  const { data, info } = logoResized;
  const pixelCount = info.width * info.height;
  const adjustedData = Buffer.from(data);
  for (let i = 3; i < adjustedData.length; i += 4) {
    adjustedData[i] = Math.round(adjustedData[i] * 0.6); // 60% opacity
  }

  const wmWithOpacity = await sharp(adjustedData, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png().toBuffer();

  // Hitung posisi: pojok kanan bawah, margin 20px
  const wmMeta = await sharp(wmWithOpacity).metadata();
  const left = Math.max(0, imgWidth - wmMeta.width - 20);
  const top = Math.max(0, imgHeight - wmMeta.height - 20);

  // Composite watermark ke atas foto asli
  const result = await sharp(inputBuffer)
    .composite([{
      input: wmWithOpacity,
      left,
      top,
      blend: 'over',
    }])
    .jpeg({ quality: 85 })
    .toBuffer();

  return result;
}
