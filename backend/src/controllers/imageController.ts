import { Request, Response } from 'express';
import multer from 'multer';
import { ImageService } from '../services/imageService';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
    }
  }
});

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const result = await ImageService.uploadImage(req.file);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: {
        filename: result.filename,
        url: result.url,
        metadata: result.metadata
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        error: 'Filename is required'
      });
    }

    const deleted = await ImageService.deleteImage(filename);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const resizeImage = async (req: Request, res: Response) => {
  try {
    const { width, height } = req.query;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    if (!width || !height) {
      return res.status(400).json({
        success: false,
        error: 'Width and height are required'
      });
    }

    const resizedImage = await ImageService.resizeImage(
      file, 
      parseInt(width as string), 
      parseInt(height as string)
    );

    res.set({
      'Content-Type': 'image/webp',
      'Content-Length': resizedImage.length.toString()
    });

    res.send(resizedImage);
  } catch (error) {
    console.error('Resize error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    const { size } = req.query;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const thumbnailSize = size ? parseInt(size as string) : 300;
    const thumbnail = await ImageService.generateThumbnail(file, thumbnailSize);

    res.set({
      'Content-Type': 'image/webp',
      'Content-Length': thumbnail.length.toString()
    });

    res.send(thumbnail);
  } catch (error) {
    console.error('Thumbnail error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Export multer middleware
export { upload };

