import pool from '../db';
import { Category } from '../models/Category';

export const CategoryRepository = {
  async findAll(): Promise<Category[]> {
    const { rows } = await pool.query('SELECT * FROM categories');
    return rows;
  },
  async findAllWithPagination(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const dataResult = await pool.query(
      'SELECT * FROM categories ORDER BY name ASC LIMIT $1 OFFSET $2',
      [limit, offset],
    );
    const totalResult = await pool.query('SELECT COUNT(*) FROM categories');
    return {
      data: dataResult.rows,
      total: parseInt(totalResult.rows[0].count, 10),
    };
  },
  async findById(id: string): Promise<Category | undefined> {
    const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return rows[0];
  },
  async findByName(name: string): Promise<Category | undefined> {
    const { rows } = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
    return rows[0];
  },
  async create(data: Partial<Category>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const columns = keys.map((k) => `"${k}"`).join(', ');
    const params = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO categories (${columns}) VALUES (${params}) RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  async update(id: string, data: Partial<Category>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    if (keys.length === 0) return;
    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    values.push(id);
    const query = `UPDATE categories SET ${setClause} WHERE id = $${values.length} RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  async delete(id: string) {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
  },
};
