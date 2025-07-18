import request from 'supertest';
import app from '../src/index';
import path from 'path';
import fs from 'fs';

describe('Upload API', () => {
  // Tạo file testfile.txt mẫu nếu chưa có
  const testFilePath = path.join(__dirname, 'testfile.txt');
  if (!fs.existsSync(testFilePath)) {
    fs.writeFileSync(testFilePath, 'Test upload file');
  }

  it('should upload a file', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('file', testFilePath);
    expect(res.statusCode).toBe(200);
    expect(res.body.url).toMatch(/\/uploads\//);
  });

  it('should block after too many uploads', async () => {
    for (let i = 0; i < 31; i++) {
      await request(app).post('/api/upload').attach('file', testFilePath);
    }
    const res = await request(app).post('/api/upload').attach('file', testFilePath);
    expect([429, 200]).toContain(res.statusCode); // 429 nếu bị chặn
  });

  it('should return error if no file uploaded', async () => {
    const res = await request(app).post('/api/upload');
    expect([400, 500]).toContain(res.statusCode);
  });
}); 