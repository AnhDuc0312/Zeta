import pool from '../db';
import { Setting } from '../models/Setting';

export const SettingRepository = {
  async findAll(): Promise<Setting[]> {
    const { rows } = await pool.query('SELECT * FROM settings');
    return rows;
  },
  async findById(id: string): Promise<Setting | undefined> {
    const { rows } = await pool.query('SELECT * FROM settings WHERE id = $1', [id]);
    return rows[0];
  },
  async create(setting: any) {
    const keys = Object.keys(setting);
    const values = Object.values(setting);
    const columns = keys.map((k) => `"${k}"`).join(', ');
    const params = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO settings (${columns}) VALUES (${params})`;
    await pool.query(query, values);
  },
  async update(id: string, data: any) {
    const keys = Object.keys(data).filter((k) => data[k] !== undefined);
    if (keys.length === 0) return;
    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    const values = keys.map((k) => data[k]);
    values.push(id);
    const query = `UPDATE settings SET ${setClause} WHERE id = $${values.length}`;
    await pool.query(query, values);
  },
  async delete(id: string) {
    await pool.query('DELETE FROM settings WHERE id = $1', [id]);
  },
};
