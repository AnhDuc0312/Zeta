import pool from '../db';
import { Tag } from '../models/Tag';

export const TagRepository = {
  async findAll(): Promise<Tag[]> {
    const { rows } = await pool.query('SELECT * FROM tags');
    return rows;
  },
  async findAllWithPagination(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const dataResult = await pool.query('SELECT * FROM tags ORDER BY name ASC LIMIT $1 OFFSET $2', [
      limit,
      offset,
    ]);
    const totalResult = await pool.query('SELECT COUNT(*) FROM tags');
    return {
      data: dataResult.rows,
      total: parseInt(totalResult.rows[0].count, 10),
    };
  },
  async findById(id: string): Promise<Tag | undefined> {
    const { rows } = await pool.query('SELECT * FROM tags WHERE id = $1', [id]);
    return rows[0];
  },
  async create(data: Partial<Tag>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const columns = keys.map((k) => `"${k}"`).join(', ');
    const params = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO tags (${columns}) VALUES (${params}) RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  async update(id: string, data: Partial<Tag>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    if (keys.length === 0) return;
    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    values.push(id);
    const query = `UPDATE tags SET ${setClause} WHERE id = $${values.length} RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  async delete(id: string) {
    await pool.query('DELETE FROM tags WHERE id = $1', [id]);
  },
};
