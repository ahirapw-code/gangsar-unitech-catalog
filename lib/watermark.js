import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Menambahkan watermark logo ke buffer gambar.
 * Logo diambil dari /public/watermark-logo.svg
 * SVG di-render tajam sesuai ukuran target sebelum di-composite.
 * Posisi: pojok kanan bawah, opacity 60%.
 */
export async function addWatermark(inputBuffer) {
  const logoPath = path.join(process.cwd(), 'public', 'watermark-logo.svg');

  // Pastikan file logo ada
  if (!fs.existsSync(logoPath)) {
    console.warn('[Watermark] watermark-logo.svg tidak ditemukan di /public, skip watermark.');
    return inputBuffer;
  }

  // Ambil metadata foto asli
  const metadata = await sharp(inputBuffer).metadata();
  const imgWidth = metadata.width || 800;
  const imgHeight = metadata.height || 600;

  // Hitung ukuran watermark: 25% dari lebar foto, minimal 80px, maksimal 300px
  const wmWidth = Math.min(300, Math.max(80, Math.floor(imgWidth * 0.25)));

  // Render SVG ke PNG dengan ukuran target (sharp bisa render SVG langsung)
  const logoResized = await sharp(logoPath)
    .resize(wmWidth)   // sharp otomatis render SVG di resolusi ini → hasil tajam
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Terapkan opacity 60% pada channel alpha
  const { data, info } = logoResized;
  const adjustedData = Buffer.from(data);
  for (let i = 3; i < adjustedData.length; i += 4) {
    adjustedData[i] = Math.round(adjustedData[i] * 0.6);
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
