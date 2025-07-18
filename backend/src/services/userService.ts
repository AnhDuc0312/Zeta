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
  // Add create, update, delete as needed
};
