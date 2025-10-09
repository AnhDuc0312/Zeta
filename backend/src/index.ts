import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { routes } from './routes/index';
import { setupSwagger } from './swagger';
import pool from './db';
import { errorHandler } from './middleware/errorHandler';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Rate limit cho các route public
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 1000, // tối đa 1000 request mỗi 15 phút
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/auth', publicLimiter);
app.use('/api/upload', publicLimiter);
app.use('/api/account', publicLimiter);
app.use('/api/search', publicLimiter);
app.use('/api/health', publicLimiter);

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('public/uploads'));

// Serve static frontend files from ui directory
app.use(express.static('ui'));

// Mount all API routes
app.use('/api', routes);
setupSwagger(app);
app.use(errorHandler);

// Serve frontend for all non-API routes (SPA routing)
app.get('*', (req: Request, res: Response) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Serve index.html for all other routes (SPA routing)
  res.sendFile('index.html', { root: 'ui' });
});

// Chỉ kiểm tra kết nối DB khi không phải test environment
if (process.env.NODE_ENV !== 'test') {
  pool
    .query('SELECT 1')
    .then(() => {
      console.log('Database connected!');
    })
    .catch((err: any) => {
      console.error('Database connection failed:', err);
      process.exit(1);
    });
}

export default app;
