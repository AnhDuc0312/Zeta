import { Request, Response } from 'express';

export const UploadController = {
  async upload(req: Request, res: Response) {
    const file = (req as any).file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    // Đường dẫn public cho file
    const url = `/uploads/${file.filename}`;
    res.json({ url });
  },
};
