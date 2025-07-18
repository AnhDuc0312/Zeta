import { AnalyticsEvent } from '../models/AnalyticsEvent';
import { AnalyticsEventRepository } from '../repositories/analyticsEventRepository';

export const AnalyticsEventService = {
  async getAllEvents(): Promise<AnalyticsEvent[]> {
    return await AnalyticsEventRepository.findAll();
  },
  async getEventsWithPagination(page: number, limit: number) {
    return await AnalyticsEventRepository.findAllWithPagination(page, limit);
  },
  async getEventById(id: string): Promise<AnalyticsEvent | undefined> {
    return await AnalyticsEventRepository.findById(id);
  },
  // Add create, update, delete as needed
};
