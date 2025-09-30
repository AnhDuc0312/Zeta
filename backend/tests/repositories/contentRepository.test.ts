import { ContentRepository } from '../../src/repositories/contentRepository';

// Mock the database pool
const mockQuery = jest.fn();
jest.mock('../../src/db', () => ({
  pool: {
    query: mockQuery
  }
}));

describe('ContentRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should find all content successfully', async () => {
      const mockContent = [
        {
          id: '1',
          title: 'Test Article',
          description: 'Test description',
          type: 'article',
          author_name: 'Test Author',
          created_at: '2024-01-01T00:00:00Z',
          views: 100,
          likes: 10,
          comments: 5,
          category: 'Technology',
          featured: false
        }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockContent });

      const result = await ContentRepository.findAll();

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
      expect(result).toEqual(mockContent);
    });

    it('should filter by type when provided', async () => {
      const mockContent = [
        {
          id: '1',
          title: 'Test Article',
          type: 'article',
          author_name: 'Test Author'
        }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockContent });

      const result = await ContentRepository.findAll('article');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE c.type = $1'),
        ['article']
      );
      expect(result).toEqual(mockContent);
    });

    it('should return empty array when no content', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await ContentRepository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should find content by id successfully', async () => {
      const mockContent = {
        id: '1',
        title: 'Test Article',
        description: 'Test description',
        content: 'Test content',
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        comments: 5,
        category: 'Technology',
        featured: false
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockContent] });

      const result = await ContentRepository.findById('1');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE c.id = $1'),
        ['1']
      );
      expect(result).toEqual(mockContent);
    });

    it('should return null when content not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await ContentRepository.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create content successfully', async () => {
      const mockContent = {
        id: '1',
        title: 'New Article',
        description: 'New description',
        type: 'article',
        author_id: '1',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockContent] });

      const contentData = {
        title: 'New Article',
        description: 'New description',
        content: 'New content',
        type: 'article' as const,
        author_id: '1',
        category_id: '1'
      };

      const result = await ContentRepository.create(contentData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO content'),
        expect.arrayContaining([
          'New Article',
          'New description',
          'New content',
          'article',
          '1',
          '1'
        ])
      );
      expect(result).toEqual(mockContent);
    });
  });

  describe('update', () => {
    it('should update content successfully', async () => {
      const mockContent = {
        id: '1',
        title: 'Updated Article',
        description: 'Updated description',
        type: 'article',
        updated_at: '2024-01-01T00:00:00Z'
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockContent] });

      const updateData = {
        title: 'Updated Article',
        description: 'Updated description'
      };

      const result = await ContentRepository.update('1', updateData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE content SET'),
        expect.arrayContaining(['Updated Article', 'Updated description', '1'])
      );
      expect(result).toEqual(mockContent);
    });

    it('should return null when content not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const updateData = {
        title: 'Updated Article'
      };

      const result = await ContentRepository.update('999', updateData);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete content successfully', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const result = await ContentRepository.delete('1');

      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM content WHERE id = $1',
        ['1']
      );
      expect(result).toBe(true);
    });

    it('should return false when content not found', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });

      const result = await ContentRepository.delete('999');

      expect(result).toBe(false);
    });
  });

  describe('findByAuthor', () => {
    it('should find content by author successfully', async () => {
      const mockContent = [
        {
          id: '1',
          title: 'Test Article',
          type: 'article',
          author_name: 'Test Author'
        }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockContent });

      const result = await ContentRepository.findByAuthor('1');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE c.author_id = $1'),
        ['1']
      );
      expect(result).toEqual(mockContent);
    });
  });

  describe('findByCategory', () => {
    it('should find content by category successfully', async () => {
      const mockContent = [
        {
          id: '1',
          title: 'Test Article',
          type: 'article',
          category: 'Technology'
        }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockContent });

      const result = await ContentRepository.findByCategory('1');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE c.category_id = $1'),
        ['1']
      );
      expect(result).toEqual(mockContent);
    });
  });

  describe('findFeatured', () => {
    it('should find featured content successfully', async () => {
      const mockContent = [
        {
          id: '1',
          title: 'Featured Article',
          type: 'article',
          featured: true
        }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockContent });

      const result = await ContentRepository.findFeatured();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE c.featured = true')
      );
      expect(result).toEqual(mockContent);
    });
  });

  describe('search', () => {
    it('should search content successfully', async () => {
      const mockContent = [
        {
          id: '1',
          title: 'Test Article',
          type: 'article',
          author_name: 'Test Author'
        }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockContent });

      const result = await ContentRepository.search('test');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE'),
        expect.arrayContaining(['%test%'])
      );
      expect(result).toEqual(mockContent);
    });
  });

  describe('incrementViews', () => {
    it('should increment views successfully', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const result = await ContentRepository.incrementViews('1');

      expect(mockQuery).toHaveBeenCalledWith(
        'UPDATE content SET views = views + 1 WHERE id = $1',
        ['1']
      );
      expect(result).toBe(true);
    });

    it('should return false when content not found', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });

      const result = await ContentRepository.incrementViews('999');

      expect(result).toBe(false);
    });
  });
});
