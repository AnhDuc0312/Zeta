import pool from '../db';
import { AnalyticsEvent } from '../models/AnalyticsEvent';

export const AnalyticsEventRepository = {
  async findAll(): Promise<AnalyticsEvent[]> {
    const { rows } = await pool.query('SELECT * FROM analytics_events');
    return rows;
  },
  async findAllWithPagination(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const dataResult = await pool.query(
      'SELECT * FROM analytics_events ORDER BY timestamp DESC LIMIT $1 OFFSET $2',
      [limit, offset],
    );
    const totalResult = await pool.query('SELECT COUNT(*) FROM analytics_events');
    return {
      data: dataResult.rows,
      total: parseInt(totalResult.rows[0].count, 10),
    };
  },
  async findById(id: string): Promise<AnalyticsEvent | undefined> {
    const { rows } = await pool.query('SELECT * FROM analytics_events WHERE id = $1', [id]);
    return rows[0];
  },
  // Add create, update, delete as needed
};
