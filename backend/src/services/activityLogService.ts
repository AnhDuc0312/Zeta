import { ActivityLog } from '../models/ActivityLog';
import { ActivityLogRepository } from '../repositories/activityLogRepository';

export const ActivityLogService = {
  async getAllLogs(): Promise<ActivityLog[]> {
    return await ActivityLogRepository.findAll();
  },
  async getLogsWithPagination(page: number, limit: number) {
    return await ActivityLogRepository.findAllWithPagination(page, limit);
  },
  async getLogById(id: string): Promise<ActivityLog | undefined> {
    return await ActivityLogRepository.findById(id);
  },
  // Add create, update, delete as needed
};
