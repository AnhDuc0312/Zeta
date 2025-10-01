import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Handle both CommonJS and ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export interface ImageUploadResult {
  success: boolean;
  filename?: string;
  url?: string;
  error?: string;
  metadata?: {
    width: number;
    height: number;
    size: number;
    format: string;
  };
}

export class ImageService {
  static async uploadImage(file: Express.Multer.File): Promise<ImageUploadResult> {
    try {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.mimetype)) {
        return {
          success: false,
          error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'
        };
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return {
          success: false,
          error: 'File too large. Maximum size is 5MB.'
        };
      }

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const filename = `${uuidv4()}${fileExtension}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      // Process image with Sharp
      const image = sharp(file.buffer);
      const metadata = await image.metadata();

      // Resize if too large (max 1920x1080)
      if (metadata.width && metadata.width > 1920) {
        image.resize(1920, 1080, { 
          fit: 'inside',
          withoutEnlargement: true 
        });
      }

      // Convert to WebP for better compression
      const processedImage = await image
        .webp({ quality: 85 })
        .toFile(filepath);

      // Generate URL
      const url = `/uploads/${filename}`;

      return {
        success: true,
        filename,
        url,
        metadata: {
          width: processedImage.width,
          height: processedImage.height,
          size: processedImage.size,
          format: 'webp'
        }
      };
    } catch (error) {
      console.error('Image upload error:', error);
      return {
        success: false,
        error: 'Failed to process image'
      };
    }
  }

  static async deleteImage(filename: string): Promise<boolean> {
    try {
      const filepath = path.join(UPLOAD_DIR, filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Image deletion error:', error);
      return false;
    }
  }

  static async resizeImage(
    file: Express.Multer.File, 
    width: number, 
    height: number
  ): Promise<Buffer> {
    return await sharp(file.buffer)
      .resize(width, height, { 
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toBuffer();
  }

  static async generateThumbnail(
    file: Express.Multer.File, 
    size: number = 300
  ): Promise<Buffer> {
    return await sharp(file.buffer)
      .resize(size, size, { 
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toBuffer();
  }
}
