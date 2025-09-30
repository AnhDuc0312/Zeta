import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authRoutes from '../../src/routes/auth';

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      };

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] }) // Check if user exists
        .mockResolvedValueOnce({ rows: [mockUser] }); // Insert user

      // Mock bcrypt
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toMatchObject({
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      });
      expect(response.body.data.token).toBeDefined();
    });

    it('should return error if user already exists', async () => {
      const existingUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      };

      // Mock database query - user exists
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [existingUser] });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User already exists');
    });

    it('should return error for invalid input', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: '',
          email: 'invalid-email',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'user'
      };

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockUser] });

      // Mock bcrypt
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Mock jwt
      (jwt.sign as jest.Mock).mockReturnValue('mock-jwt-token');

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toMatchObject({
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      });
      expect(response.body.data.token).toBe('mock-jwt-token');
    });

    it('should return error for invalid credentials', async () => {
      // Mock database query - user not found
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return error for wrong password', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'user'
      };

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockUser] });

      // Mock bcrypt - wrong password
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh token successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      };

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockUser] });

      // Mock jwt
      (jwt.verify as jest.Mock).mockReturnValue({ userId: '1' });
      (jwt.sign as jest.Mock).mockReturnValue('new-mock-jwt-token');

      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBe('new-mock-jwt-token');
    });

    it('should return error for invalid token', async () => {
      // Mock jwt - invalid token
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid token');
    });
  });
});
