import request from 'supertest';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import imageRoutes from '../../src/routes/images';
import { authenticateJWT } from '../../src/middleware/authMiddleware';

// Mock multer
jest.mock('multer');
jest.mock('../../src/middleware/authMiddleware');

const app = express();

// Mock multer middleware
const mockMulter = multer as jest.Mocked<typeof multer>;
const mockUpload = {
  single: jest.fn()
};

mockMulter.mockReturnValue(mockUpload as any);
mockUpload.single.mockReturnValue((req: any, res: any, next: any) => {
  req.file = {
    fieldname: 'image',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('fake-image-data'),
    destination: '/tmp',
    filename: 'test.jpg',
    path: '/tmp/test.jpg'
  };
  next();
});

// Mock authenticateJWT
(authenticateJWT as jest.Mock).mockImplementation((req: any, res: any, next: any) => {
  req.user = { id: '1', email: 'test@example.com' };
  next();
});

// Mock sharp
jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    resize: jest.fn().mockReturnThis(),
    jpeg: jest.fn().mockReturnThis(),
    png: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-image-data')),
    metadata: jest.fn().mockResolvedValue({
      width: 800,
      height: 600,
      size: 1024,
      format: 'jpeg'
    })
  }));
});

// Mock fs
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn(),
  promises: {
    access: jest.fn(),
    mkdir: jest.fn(),
    writeFile: jest.fn(),
    unlink: jest.fn()
  }
}));

// Mock path
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
  extname: jest.fn(() => '.jpg'),
  basename: jest.fn((file) => file.split('/').pop()),
  dirname: jest.fn((file) => file.split('/').slice(0, -1).join('/'))
}));

app.use(express.json());
app.use('/api/images', imageRoutes);

describe('Image Upload Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock fs methods
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (fs.unlinkSync as jest.Mock).mockImplementation(() => {});
    
    (fs.promises.access as jest.Mock).mockResolvedValue(undefined);
    (fs.promises.mkdir as jest.Mock).mockResolvedValue(undefined);
    (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
    (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Image Upload', () => {
    it('should upload image successfully', async () => {
      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('url');
      expect(response.body.data).toHaveProperty('filename');
      expect(response.body.data).toHaveProperty('metadata');
      expect(response.body.data.metadata).toHaveProperty('width');
      expect(response.body.data.metadata).toHaveProperty('height');
      expect(response.body.data.metadata).toHaveProperty('size');
      expect(response.body.data.metadata).toHaveProperty('format');
    });

    it('should handle image processing errors', async () => {
      // Mock sharp to throw an error
      const sharp = require('sharp');
      sharp.mockImplementation(() => {
        throw new Error('Image processing failed');
      });

      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Image processing failed');
    });

    it('should handle file system errors', async () => {
      (fs.promises.writeFile as jest.Mock).mockRejectedValueOnce(new Error('Write failed'));

      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Write failed');
    });

    it('should validate file type', async () => {
      // Mock multer to return invalid file type
      mockUpload.single.mockReturnValueOnce((req: any, res: any, next: any) => {
        req.file = {
          fieldname: 'image',
          originalname: 'test.txt',
          encoding: '7bit',
          mimetype: 'text/plain',
          size: 1024,
          buffer: Buffer.from('fake-text-data'),
          destination: '/tmp',
          filename: 'test.txt',
          path: '/tmp/test.txt'
        };
        next();
      });

      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', Buffer.from('fake-text-data'), 'test.txt');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid file type');
    });

    it('should validate file size', async () => {
      // Mock multer to return oversized file
      mockUpload.single.mockReturnValueOnce((req: any, res: any, next: any) => {
        req.file = {
          fieldname: 'image',
          originalname: 'large.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          size: 10 * 1024 * 1024, // 10MB
          buffer: Buffer.from('fake-image-data'),
          destination: '/tmp',
          filename: 'large.jpg',
          path: '/tmp/large.jpg'
        };
        next();
      });

      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', Buffer.from('fake-image-data'), 'large.jpg');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('File size exceeds limit');
    });
  });

  describe('Image Resize', () => {
    it('should resize image successfully', async () => {
      const response = await request(app)
        .post('/api/images/resize')
        .send({
          filename: 'test.jpg',
          width: 400,
          height: 300
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('url');
      expect(response.body.data).toHaveProperty('filename');
      expect(response.body.data).toHaveProperty('metadata');
    });

    it('should handle resize errors', async () => {
      const sharp = require('sharp');
      sharp.mockImplementation(() => {
        throw new Error('Resize failed');
      });

      const response = await request(app)
        .post('/api/images/resize')
        .send({
          filename: 'test.jpg',
          width: 400,
          height: 300
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Resize failed');
    });

    it('should validate resize parameters', async () => {
      const response = await request(app)
        .post('/api/images/resize')
        .send({
          filename: 'test.jpg',
          width: -100,
          height: 300
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid dimensions');
    });
  });

  describe('Image Thumbnail', () => {
    it('should generate thumbnail successfully', async () => {
      const response = await request(app)
        .post('/api/images/thumbnail')
        .send({
          filename: 'test.jpg',
          size: 150
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('url');
      expect(response.body.data).toHaveProperty('filename');
      expect(response.body.data).toHaveProperty('metadata');
    });

    it('should handle thumbnail generation errors', async () => {
      const sharp = require('sharp');
      sharp.mockImplementation(() => {
        throw new Error('Thumbnail generation failed');
      });

      const response = await request(app)
        .post('/api/images/thumbnail')
        .send({
          filename: 'test.jpg',
          size: 150
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Thumbnail generation failed');
    });
  });

  describe('Image Delete', () => {
    it('should delete image successfully', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const response = await request(app)
        .delete('/api/images/test.jpg');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Image deleted successfully');
      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    it('should handle delete errors', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.unlinkSync as jest.Mock).mockImplementation(() => {
        throw new Error('Delete failed');
      });

      const response = await request(app)
        .delete('/api/images/test.jpg');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Delete failed');
    });

    it('should handle non-existent file', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const response = await request(app)
        .delete('/api/images/nonexistent.jpg');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Image not found');
    });
  });

  describe('Authentication', () => {
    it('should require authentication for upload', async () => {
      (authenticateJWT as jest.Mock).mockImplementationOnce((req: any, res: any, next: any) => {
        res.status(401).json({ success: false, error: 'Unauthorized' });
      });

      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should require authentication for delete', async () => {
      (authenticateJWT as jest.Mock).mockImplementationOnce((req: any, res: any, next: any) => {
        res.status(401).json({ success: false, error: 'Unauthorized' });
      });

      const response = await request(app)
        .delete('/api/images/test.jpg');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('File System Operations', () => {
    it('should create upload directory if it does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg');

      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it('should handle directory creation errors', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {
        throw new Error('Directory creation failed');
      });

      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Directory creation failed');
    });
  });

  describe('Image Processing', () => {
    it('should process different image formats', async () => {
      const formats = ['jpeg', 'png', 'webp'];
      
      for (const format of formats) {
        const sharp = require('sharp');
        sharp.mockImplementationOnce(() => ({
          resize: jest.fn().mockReturnThis(),
          [format]: jest.fn().mockReturnThis(),
          toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-image-data')),
          metadata: jest.fn().mockResolvedValue({
            width: 800,
            height: 600,
            size: 1024,
            format: format
          })
        }));

        const response = await request(app)
          .post('/api/images/upload')
          .attach('image', Buffer.from('fake-image-data'), `test.${format}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.metadata.format).toBe(format);
      }
    });

    it('should handle image metadata extraction', async () => {
      const sharp = require('sharp');
      sharp.mockImplementationOnce(() => ({
        resize: jest.fn().mockReturnThis(),
        jpeg: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-image-data')),
        metadata: jest.fn().mockResolvedValue({
          width: 1920,
          height: 1080,
          size: 2048,
          format: 'jpeg',
          density: 72,
          hasAlpha: false
        })
      }));

      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.metadata).toEqual({
        width: 1920,
        height: 1080,
        size: 2048,
        format: 'jpeg',
        density: 72,
        hasAlpha: false
      });
    });
  });
});
