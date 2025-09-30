import React, { useState } from 'react';
import { X, ZoomIn, Download, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  className?: string;
  showActions?: boolean;
  onRemove?: () => void;
  metadata?: {
    width: number;
    height: number;
    size: number;
    format: string;
  };
}

export default function ImagePreview({
  src,
  alt = 'Image preview',
  className = '',
  showActions = true,
  onRemove,
  metadata
}: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = src.split('/').pop() || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(src, '_blank');
  };

  return (
    <>
      <div className={`relative group ${className}`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setIsOpen(true)}
        />
        
        {showActions && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center space-x-2">
            <button
              onClick={() => setIsOpen(true)}
              className="opacity-0 group-hover:opacity-100 bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              title="Zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDownload}
              className="opacity-0 group-hover:opacity-100 bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleOpenInNewTab}
              className="opacity-0 group-hover:opacity-100 bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            
            {onRemove && (
              <button
                onClick={onRemove}
                className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        
        {metadata && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {metadata.width} × {metadata.height} • {(metadata.size / 1024).toFixed(1)} KB
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>{alt}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handleOpenInNewTab}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6 pt-0">
            <div className="relative">
              <img
                src={src}
                alt={alt}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>
            
            {metadata && (
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Dimensions:</span>
                  <span>{metadata.width} × {metadata.height} pixels</span>
                </div>
                <div className="flex justify-between">
                  <span>File size:</span>
                  <span>{(metadata.size / 1024).toFixed(1)} KB</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span>{metadata.format.toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
