import { Setting } from '../models/Setting';
import { SettingRepository } from '../repositories/settingRepository';

export const SettingService = {
  async getAllSettings(): Promise<Setting[]> {
    return await SettingRepository.findAll();
  },
  async getSettingById(id: string): Promise<Setting | undefined> {
    return await SettingRepository.findById(id);
  },
  // Add create, update, delete as needed
};
