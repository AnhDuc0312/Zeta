import pool from '../db';
import { ActivityLog } from '../models/ActivityLog';

export const ActivityLogRepository = {
  async findAll(): Promise<ActivityLog[]> {
    const { rows } = await pool.query('SELECT * FROM activity_logs');
    return rows;
  },
  async findAllWithPagination(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const dataResult = await pool.query(
      'SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT $1 OFFSET $2',
      [limit, offset],
    );
    const totalResult = await pool.query('SELECT COUNT(*) FROM activity_logs');
    return {
      data: dataResult.rows,
      total: parseInt(totalResult.rows[0].count, 10),
    };
  },
  async findById(id: string): Promise<ActivityLog | undefined> {
    const { rows } = await pool.query('SELECT * FROM activity_logs WHERE id = $1', [id]);
    return rows[0];
  },
  async create(log: Partial<ActivityLog>) {
    const keys = Object.keys(log);
    const values = Object.values(log);
    const columns = keys.map((k) => `"${k}"`).join(', ');
    const params = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO activity_logs (${columns}) VALUES (${params})`;
    await pool.query(query, values);
  },
  // Add create, update, delete as needed
};
