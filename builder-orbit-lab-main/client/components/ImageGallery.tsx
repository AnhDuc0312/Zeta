import React, { useState } from 'react';
import { Plus, Grid3X3, List, X } from 'lucide-react';
import ImageUpload from './ImageUpload';
import ImagePreview from './ImagePreview';

interface ImageItem {
  id: string;
  url: string;
  filename: string;
  metadata?: {
    width: number;
    height: number;
    size: number;
    format: string;
  };
}

interface ImageGalleryProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  maxImages?: number;
  className?: string;
  showUpload?: boolean;
}

export default function ImageGallery({
  images,
  onImagesChange,
  maxImages = 10,
  className = '',
  showUpload = true
}: ImageGalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploader, setShowUploader] = useState(false);

  const handleImageUploaded = (url: string, filename: string) => {
    if (images.length >= maxImages) {
      return;
    }

    const newImage: ImageItem = {
      id: Date.now().toString(),
      url,
      filename,
      // Metadata will be added by the upload response
    };

    onImagesChange([...images, newImage]);
    setShowUploader(false);
  };

  const handleImageRemoved = (imageId: string) => {
    onImagesChange(images.filter(img => img.id !== imageId));
  };

  const handleRemoveAll = () => {
    onImagesChange([]);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium text-gray-900">
            Images ({images.length}/{maxImages})
          </h3>
          
          {images.length > 0 && (
            <button
              onClick={handleRemoveAll}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove all
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Upload button */}
          {showUpload && images.length < maxImages && (
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </button>
          )}
        </div>
      </div>

      {/* Upload area */}
      {showUploader && images.length < maxImages && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <ImageUpload
            onImageUploaded={handleImageUploaded}
            onImageRemoved={() => setShowUploader(false)}
            maxSize={5}
          />
        </div>
      )}

      {/* Images display */}
      {images.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'space-y-4'
          }
        >
          {images.map((image) => (
            <div key={image.id} className="relative">
              <ImagePreview
                src={image.url}
                alt={image.filename}
                metadata={image.metadata}
                onRemove={() => handleImageRemoved(image.id)}
                className={viewMode === 'list' ? 'h-32' : ''}
              />
              
              {viewMode === 'list' && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {image.filename}
                  </p>
                  {image.metadata && (
                    <p className="text-xs text-gray-500">
                      {image.metadata.width} × {image.metadata.height} • 
                      {(image.metadata.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-6 h-6" />
          </div>
          <p className="text-lg font-medium mb-2">No images yet</p>
          <p className="text-sm">Upload your first image to get started</p>
        </div>
      )}

      {/* Max images reached message */}
      {images.length >= maxImages && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                Maximum number of images reached ({maxImages}). Remove some images to add new ones.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

