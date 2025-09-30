import { UserRepository } from '../repositories/userRepository';

export const UserService = {
  async getAllUsers() {
    return await UserRepository.findAll();
  },
  async getUsersWithPagination(page: number, limit: number) {
    return await UserRepository.findAllWithPagination(page, limit);
  },
  async getUserById(id: string) {
    return await UserRepository.findById(id);
  },
  async updateUserProfile(id: string, data: { name: string; bio?: string; location?: string; website?: string }) {
    return await UserRepository.updateProfile(id, data);
  },
  async getUserStats(userId: string) {
    return await UserRepository.getUserStats(userId);
  },
  async getUserFavorites(userId: string, options?: {
    page?: number;
    limit?: number;
    type?: string;
    sort?: string;
    search?: string;
  }) {
    return await UserRepository.getUserFavorites(userId, options);
  },
  // Add create, update, delete as needed
};
