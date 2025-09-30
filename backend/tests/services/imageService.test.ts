import * as imageService from '../../src/services/imageService';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Mock dependencies
jest.mock('sharp');
jest.mock('fs');
jest.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}));

const mockSharp = sharp as jest.Mocked<typeof sharp>;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('ImageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should upload image successfully', async () => {
      const mockFile = {
        buffer: Buffer.from('mock-image-data'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg'
      } as Express.Multer.File;

      const mockSharpInstance = {
        resize: jest.fn().mockReturnThis(),
        webp: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-image'))
      };

      (mockSharp as any).mockReturnValue(mockSharpInstance as any);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.writeFileSync.mockImplementation(() => {});

      const result = await ImageService.uploadImage(mockFile);

      expect(mockSharp).toHaveBeenCalledWith(mockFile.buffer);
      expect(mockSharpInstance.resize).toHaveBeenCalledWith(800, 600, {
        fit: 'inside',
        withoutEnlargement: true
      });
      expect(mockSharpInstance.webp).toHaveBeenCalledWith({ quality: 80 });
      expect(result).toMatchObject({
        filename: expect.stringContaining('mock-uuid'),
        url: expect.stringContaining('/uploads/'),
        metadata: expect.objectContaining({
          width: 800,
          height: 600,
          format: 'webp'
        })
      });
    });

    it('should throw error for invalid file type', async () => {
      const mockFile = {
        buffer: Buffer.from('mock-image-data'),
        originalname: 'test.txt',
        mimetype: 'text/plain'
      } as Express.Multer.File;

      await expect(ImageService.uploadImage(mockFile)).rejects.toThrow('Invalid file type');
    });

    it('should throw error for file too large', async () => {
      const mockFile = {
        buffer: Buffer.alloc(6 * 1024 * 1024), // 6MB
        originalname: 'test.jpg',
        mimetype: 'image/jpeg'
      } as Express.Multer.File;

      await expect(ImageService.uploadImage(mockFile)).rejects.toThrow('File too large');
    });
  });

  describe('deleteImage', () => {
    it('should delete image successfully', async () => {
      const filename = 'test-image.webp';
      mockFs.existsSync.mockReturnValue(true);
      mockFs.unlinkSync.mockImplementation(() => {});

      const result = await ImageService.deleteImage(filename);

      expect(mockFs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining(filename)
      );
      expect(mockFs.unlinkSync).toHaveBeenCalledWith(
        expect.stringContaining(filename)
      );
      expect(result).toBe(true);
    });

    it('should return false when file does not exist', async () => {
      const filename = 'nonexistent.webp';
      mockFs.existsSync.mockReturnValue(false);

      const result = await ImageService.deleteImage(filename);

      expect(result).toBe(false);
    });
  });

  describe('resizeImage', () => {
    it('should resize image successfully', async () => {
      const mockFile = {
        buffer: Buffer.from('mock-image-data'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg'
      } as Express.Multer.File;

      const mockSharpInstance = {
        resize: jest.fn().mockReturnThis(),
        webp: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('resized-image'))
      };

      (mockSharp as any).mockReturnValue(mockSharpInstance as any);
      mockFs.writeFileSync.mockImplementation(() => {});

      const result = await ImageService.resizeImage(mockFile, 400, 300);

      expect(mockSharp).toHaveBeenCalledWith(mockFile.buffer);
      expect(mockSharpInstance.resize).toHaveBeenCalledWith(400, 300, {
        fit: 'inside',
        withoutEnlargement: true
      });
      expect(result).toMatchObject({
        filename: expect.stringContaining('mock-uuid'),
        url: expect.stringContaining('/uploads/'),
        metadata: expect.objectContaining({
          width: 400,
          height: 300
        })
      });
    });
  });

  describe('generateThumbnail', () => {
    it('should generate thumbnail successfully', async () => {
      const mockFile = {
        buffer: Buffer.from('mock-image-data'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg'
      } as Express.Multer.File;

      const mockSharpInstance = {
        resize: jest.fn().mockReturnThis(),
        webp: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('thumbnail-image'))
      };

      (mockSharp as any).mockReturnValue(mockSharpInstance as any);
      mockFs.writeFileSync.mockImplementation(() => {});

      const result = await ImageService.generateThumbnail(mockFile);

      expect(mockSharp).toHaveBeenCalledWith(mockFile.buffer);
      expect(mockSharpInstance.resize).toHaveBeenCalledWith(200, 200, {
        fit: 'cover',
        position: 'center'
      });
      expect(result).toMatchObject({
        filename: expect.stringContaining('thumb'),
        url: expect.stringContaining('/uploads/'),
        metadata: expect.objectContaining({
          width: 200,
          height: 200
        })
      });
    });
  });
});
