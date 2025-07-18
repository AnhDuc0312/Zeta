import { Request, Response } from 'express';
import { SettingRepository } from '../repositories/settingRepository';
import { randomUUID } from 'crypto';

export const AdminSettingsController = {
  async list(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 18;
    const all = await SettingRepository.findAll();
    const total = all.length;
    const data = all.slice((page - 1) * limit, page * limit);
    res.json({ data, total, page, limit });
  },
  async get(req: Request, res: Response) {
    const setting = await SettingRepository.findById(req.params.id);
    if (!setting) return res.status(404).json({ error: 'Setting not found' });
    res.json(setting);
  },
  async create(req: Request, res: Response) {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ error: 'Key is required' });
    const id = randomUUID();
    await SettingRepository.create({ id, key, value });
    res.status(201).json({ message: 'Setting created' });
  },
  async update(req: Request, res: Response) {
    const { key, value } = req.body;
    await SettingRepository.update(req.params.id, { key, value });
    res.json({ message: 'Setting updated' });
  },
  async remove(req: Request, res: Response) {
    await SettingRepository.delete(req.params.id);
    res.status(204).send();
  },
};
