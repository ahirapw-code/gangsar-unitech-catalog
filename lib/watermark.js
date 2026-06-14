import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Menambahkan watermark logo ke buffer gambar.
 * Logo diambil dari /public/watermark-logo.svg
 * Posisi: tengah, opacity 35%, ukuran 40% dari lebar foto.
 */
export async function addWatermark(inputBuffer) {
  const logoPath = path.join(process.cwd(), 'public', 'watermark-logo.svg');

  if (!fs.existsSync(logoPath)) {
    console.warn('[Watermark] watermark-logo.svg tidak ditemukan di /public, skip watermark.');
    return inputBuffer;
  }

  const metadata = await sharp(inputBuffer).metadata();
  const imgWidth = metadata.width || 800;
  const imgHeight = metadata.height || 600;

  // Ukuran watermark: 40% dari lebar foto, minimal 120px, maksimal 500px
  const wmWidth = Math.min(500, Math.max(120, Math.floor(imgWidth * 0.40)));

  // Render SVG ke raw buffer
  const logoResized = await sharp(logoPath)
    .resize(wmWidth)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Terapkan opacity 35%
  const { data, info } = logoResized;
  const adjustedData = Buffer.from(data);
  for (let i = 3; i < adjustedData.length; i += 4) {
    adjustedData[i] = Math.round(adjustedData[i] * 0.35);
  }

  const wmWithOpacity = await sharp(adjustedData, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png().toBuffer();

  // Posisi: tengah
  const wmMeta = await sharp(wmWithOpacity).metadata();
  const left = Math.round((imgWidth - wmMeta.width) / 2);
  const top = Math.round((imgHeight - wmMeta.height) / 2);

  const result = await sharp(inputBuffer)
    .composite([{
      input: wmWithOpacity,
      left: Math.max(0, left),
      top: Math.max(0, top),
      blend: 'over',
    }])
    .jpeg({ quality: 85 })
    .toBuffer();

  return result;
}
