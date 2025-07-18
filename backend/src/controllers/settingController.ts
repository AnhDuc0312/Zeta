import { Request, Response } from 'express';
import { SettingService } from '../services/settingService';

export const SettingController = {
  async list(req: Request, res: Response) {
    const settings = await SettingService.getAllSettings();
    res.json(settings);
  },
  async get(req: Request, res: Response) {
    const setting = await SettingService.getSettingById(req.params.id);
    if (!setting) return res.status(404).json({ error: 'Setting not found' });
    res.json(setting);
  },
  async create(req: Request, res: Response) {
    res.status(201).json({ message: 'Setting created (stub)' });
  },
  async update(req: Request, res: Response) {
    res.json({ message: 'Setting updated (stub)' });
  },
  async remove(req: Request, res: Response) {
    res.status(204).send();
  },
};
