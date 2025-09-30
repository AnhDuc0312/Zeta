import request from 'supertest';
import express from 'express';
import commentRoutes from '../../src/routes/comments';

const app = express();
app.use(express.json());
app.use('/api/comments', commentRoutes);

describe('CommentController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/comments', () => {
    it('should get comments by content id successfully', async () => {
      const mockComments = [
        {
          id: '1',
          content_id: '1',
          user_id: '1',
          text: 'Great article!',
          author_name: 'Test User',
          created_at: '2024-01-01T00:00:00Z',
          status: 'visible'
        },
        {
          id: '2',
          content_id: '1',
          user_id: '2',
          text: 'Very informative',
          author_name: 'Another User',
          created_at: '2024-01-02T00:00:00Z',
          status: 'visible'
        }
      ];

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: mockComments });

      const response = await request(app)
        .get('/api/comments?contentId=1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toMatchObject({
        text: 'Great article!',
        author_name: 'Test User'
      });
    });

    it('should return empty array when no comments', async () => {
      // Mock database query - no comments
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/comments?contentId=1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should return error when contentId is missing', async () => {
      const response = await request(app)
        .get('/api/comments');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Content ID is required');
    });
  });

  describe('POST /api/comments', () => {
    it('should create comment successfully', async () => {
      const mockComment = {
        id: '1',
        content_id: '1',
        user_id: '1',
        text: 'New comment',
        author_name: 'Test User',
        created_at: '2024-01-01T00:00:00Z',
        status: 'visible'
      };

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockComment] });

      const response = await request(app)
        .post('/api/comments')
        .send({
          contentId: '1',
          body: 'New comment'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        text: 'New comment',
        author_name: 'Test User'
      });
    });

    it('should create reply comment successfully', async () => {
      const mockComment = {
        id: '2',
        content_id: '1',
        user_id: '1',
        text: 'Reply comment',
        parent_id: '1',
        author_name: 'Test User',
        created_at: '2024-01-01T00:00:00Z',
        status: 'visible'
      };

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockComment] });

      const response = await request(app)
        .post('/api/comments')
        .send({
          contentId: '1',
          body: 'Reply comment',
          parentId: '1'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        text: 'Reply comment',
        parent_id: '1'
      });
    });

    it('should return error for invalid input', async () => {
      const response = await request(app)
        .post('/api/comments')
        .send({
          contentId: '',
          body: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return error for invalid parent ID format', async () => {
      const response = await request(app)
        .post('/api/comments')
        .send({
          contentId: '1',
          body: 'Comment',
          parentId: 'invalid-uuid'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Parent ID must be a valid UUID');
    });
  });

  describe('PUT /api/comments/:id', () => {
    it('should update comment successfully', async () => {
      const mockComment = {
        id: '1',
        content_id: '1',
        user_id: '1',
        text: 'Updated comment',
        author_name: 'Test User',
        updated_at: '2024-01-01T00:00:00Z'
      };

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockComment] });

      const response = await request(app)
        .put('/api/comments/1')
        .send({
          text: 'Updated comment'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        text: 'Updated comment'
      });
    });

    it('should return 404 for non-existent comment', async () => {
      // Mock database query - no comment found
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .put('/api/comments/999')
        .send({
          text: 'Updated comment'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Comment not found');
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('should delete comment successfully', async () => {
      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rowCount: 1 });

      const response = await request(app)
        .delete('/api/comments/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Comment deleted successfully');
    });

    it('should return 404 for non-existent comment', async () => {
      // Mock database query - no comment found
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rowCount: 0 });

      const response = await request(app)
        .delete('/api/comments/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Comment not found');
    });
  });

  describe('GET /api/comments/:id/replies', () => {
    it('should get replies successfully', async () => {
      const mockReplies = [
        {
          id: '2',
          content_id: '1',
          user_id: '1',
          text: 'Reply 1',
          parent_id: '1',
          author_name: 'Test User',
          created_at: '2024-01-01T00:00:00Z',
          status: 'visible'
        },
        {
          id: '3',
          content_id: '1',
          user_id: '2',
          text: 'Reply 2',
          parent_id: '1',
          author_name: 'Another User',
          created_at: '2024-01-02T00:00:00Z',
          status: 'visible'
        }
      ];

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: mockReplies });

      const response = await request(app)
        .get('/api/comments/1/replies');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toMatchObject({
        text: 'Reply 1',
        parent_id: '1'
      });
    });

    it('should return empty array when no replies', async () => {
      // Mock database query - no replies
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/comments/1/replies');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });
});
