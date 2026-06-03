'use client';

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';

export default function ImageUploader({ images, onImagesChange }) {
  const [uploading, setUploading] = useState(false);

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
      const newImages = [...images.filter(img => img), ...uploadedUrls];
      onImagesChange(newImages);
      
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (error) {
      toast.error('Failed to upload image: ' + error.message);
    } finally {
      setUploading(false);
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

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages.length > 0 ? newImages : ['']);
  };

  return (
    <div className="space-y-4">
      {/* File Upload Button */}
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

      {/* Uploaded/URL Images */}
      <div className="space-y-3">
        {images.map((image, index) => (
          <div key={index} className="flex gap-2 items-start">
            {image && image.startsWith('/uploads/') ? (
              <div className="relative w-20 h-20 border rounded overflow-hidden flex-shrink-0">
                <Image
                  src={image}
                  alt="Product"
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}
            <Input
              placeholder="Or paste image URL"
              value={image}
              onChange={(e) => updateImageUrl(index, e.target.value)}
              className="flex-1"
            />
            {images.length > 1 && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

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
        💡 Tip: Upload images for better reliability, or use image URLs as backup
      </p>
    </div>
  );
}
