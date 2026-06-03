'use client';

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Image from 'next/image';

export default function ImageUploader({ images, onImagesChange }) {
  const [uploading, setUploading] = useState(false);
  // Lacak URL mana yang sedang dihapus agar bisa tampilkan loading per-gambar
  const [deletingIndex, setDeletingIndex] = useState(null);

  // Cek apakah URL adalah gambar dari Vercel Blob (bukan URL eksternal)
  const isVercelBlobUrl = (url) =>
    url && url.includes('blob.vercel-storage.com');

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error);
        }

        return data.imageUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      // Filter string kosong sebelum gabung dengan yang baru
      const newImages = [...images.filter(img => img && img.trim() !== ''), ...uploadedUrls];
      onImagesChange(newImages);

      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (error) {
      toast.error('Failed to upload image: ' + error.message);
    } finally {
      setUploading(false);
      // Reset input file agar file yang sama bisa diupload lagi
      e.target.value = '';
    }
  };

  const handleUrlAdd = () => {
    onImagesChange([...images, '']);
  };

  const updateImageUrl = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    onImagesChange(newImages);
  };

  const removeImage = async (index) => {
    const imageUrl = images[index];

    // Kalau URL adalah Vercel Blob, hapus dulu dari storage
    if (isVercelBlobUrl(imageUrl)) {
      setDeletingIndex(index);
      try {
        const res = await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl }),
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Delete failed');
        }

        toast.success('Image deleted');
      } catch (error) {
        // Tetap hapus dari list UI meskipun delete dari storage gagal,
        // supaya user tidak terjebak dengan gambar yang tidak bisa dihapus
        toast.error('Could not delete from storage, removed from list only');
        console.error('Blob delete error:', error);
      } finally {
        setDeletingIndex(null);
      }
    }

    // Hapus dari list UI
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages.length > 0 ? newImages : []);
  };

  return (
    <div className="space-y-4">
      {/* Area Upload File */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1E8E5A] transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 text-[#1E8E5A] animate-spin" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="text-sm font-medium">Click to upload images</p>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
              </>
            )}
          </div>
        </label>
      </div>

      {/* Daftar Gambar (terupload atau URL manual) */}
      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((image, index) => (
            <div key={index} className="flex gap-2 items-center">
              {/* Preview thumbnail kalau URL valid */}
              {image && (image.startsWith('/uploads/') || image.startsWith('https://')) ? (
                <div className="relative w-20 h-20 border rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {/* Overlay loading saat gambar ini sedang dihapus */}
                  {deletingIndex === index && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    </div>
                  )}
                </div>
              ) : null}

              {/* Input URL — tampilkan hanya untuk gambar non-blob atau gambar URL manual */}
              {!isVercelBlobUrl(image) && (
                <Input
                  placeholder="Paste image URL"
                  value={image}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  className="flex-1"
                />
              )}

              {/* Label untuk gambar Vercel Blob */}
              {isVercelBlobUrl(image) && (
                <p className="flex-1 text-sm text-gray-500 truncate">
                  {image.split('/').pop()}
                </p>
              )}

              {/* Tombol hapus */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeImage(index)}
                disabled={deletingIndex === index}
                className="flex-shrink-0 text-red-400 hover:text-red-600 hover:bg-red-50"
              >
                {deletingIndex === index ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Tombol tambah URL manual */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleUrlAdd}
        className="w-full"
      >
        + Add Image URL
      </Button>

      <p className="text-xs text-gray-500">
        💡 Upload images for better reliability, or paste image URLs as backup
      </p>
    </div>
  );
}
