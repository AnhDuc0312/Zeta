import { Request, Response } from 'express';

export const HealthController = {
  async health(req: Request, res: Response) {
    res.json({ status: 'ok' });
  },
};
