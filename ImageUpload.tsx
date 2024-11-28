import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { ImageData } from '../types';

interface ImageUploadProps {
  images: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
  readOnly?: boolean;
}

export default function ImageUpload({ images, onImagesChange, readOnly }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ImageData[] = await Promise.all(
      files.map(async (file) => {
        return new Promise<ImageData>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: Math.random().toString(36).substr(2, 9),
              name: file.name,
              data: reader.result as string,
              type: file.type
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    onImagesChange([...images, ...newImages]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    onImagesChange(images.filter(img => img.id !== id));
  };

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex items-center justify-center w-full">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide uppercase border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
            <Upload className="w-8 h-8 text-indigo-600" />
            <span className="mt-2 text-base leading-normal text-gray-600">Upload Images</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              ref={fileInputRef}
            />
          </label>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {images.map((image) => (
            <div key={image.id} className="relative">
              <img
                src={image.data}
                alt={image.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              {!readOnly && (
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <p className="mt-1 text-sm text-gray-500 truncate">{image.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}