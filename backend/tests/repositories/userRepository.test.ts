import { UserRepository } from '../../src/repositories/userRepository';

// Mock the database pool
const mockQuery = jest.fn();
jest.mock('../../src/db', () => ({
  pool: {
    query: mockQuery
  }
}));

describe('UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find user by email successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'user',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await UserRepository.findByEmail('test@example.com');

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        ['test@example.com']
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await UserRepository.findByEmail('nonexistent@example.com');

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        ['nonexistent@example.com']
      );
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await UserRepository.findById('1');

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
        ['1']
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await UserRepository.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockUser] });

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'user' as const
      };

      const result = await UserRepository.create(userData);

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
        ['Test User', 'test@example.com', 'hashed-password', 'user']
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'Updated User',
        email: 'updated@example.com',
        role: 'user',
        updated_at: '2024-01-01T00:00:00Z'
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockUser] });

      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com'
      };

      const result = await UserRepository.update('1', updateData);

      expect(mockQuery).toHaveBeenCalledWith(
        'UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, role, created_at, updated_at',
        ['Updated User', 'updated@example.com', '1']
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const updateData = {
        name: 'Updated User'
      };

      const result = await UserRepository.update('999', updateData);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const result = await UserRepository.delete('1');

      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM users WHERE id = $1',
        ['1']
      );
      expect(result).toBe(true);
    });

    it('should return false when user not found', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });

      const result = await UserRepository.delete('999');

      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should find all users successfully', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'Test User 1',
          email: 'test1@example.com',
          role: 'user',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Test User 2',
          email: 'test2@example.com',
          role: 'admin',
          created_at: '2024-01-02T00:00:00Z'
        }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockUsers });

      const result = await UserRepository.findAll();

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
      );
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await UserRepository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findAllWithPagination', () => {
    it('should find users with pagination successfully', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'Test User 1',
          email: 'test1@example.com',
          role: 'user',
          created_at: '2024-01-01T00:00:00Z'
        }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockUsers });

      const result = await UserRepository.findAllWithPagination(1, 10);

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [10, 0]
      );
      expect(result).toEqual(mockUsers);
    });
  });
});
