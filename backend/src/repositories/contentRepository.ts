import pool from '../db';
import { Content } from '../models/Content';

export const ContentRepository = {
  async findAll(): Promise<Content[]> {
    const { rows } = await pool.query('SELECT * FROM content');
    return rows;
  },
  async findAllWithPagination(page: number, limit: number, type?: string) {
    const offset = (page - 1) * limit;
    let dataResult, totalResult;
    if (type) {
      dataResult = await pool.query(
        'SELECT * FROM content WHERE type = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [type, limit, offset]
      );
      totalResult = await pool.query('SELECT COUNT(*) FROM content WHERE type = $1', [type]);
    } else {
      dataResult = await pool.query(
        'SELECT * FROM content ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      totalResult = await pool.query('SELECT COUNT(*) FROM content');
    }
    return {
      data: dataResult.rows,
      total: parseInt(totalResult.rows[0].count, 10),
    };
  },
  async findById(id: string): Promise<Content | undefined> {
    const { rows } = await pool.query('SELECT * FROM content WHERE id = $1', [id]);
    return rows[0];
  },
  async deleteById(id: string) {
    await pool.query('DELETE FROM content WHERE id = $1', [id]);
  },
  async create(content: Partial<Content>) {
    const keys = Object.keys(content);
    const values = Object.values(content);
    const columns = keys.map((k) => `"${k}"`).join(', ');
    const params = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO content (${columns}) VALUES (${params}) RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  async update(id: string, data: Partial<Content>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    if (keys.length === 0) return;
    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    values.push(id);
    const query = `UPDATE content SET ${setClause} WHERE id = $${values.length} RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  async publish(id: string) {
    const { rows } = await pool.query(
      'UPDATE content SET status = $1, published_at = NOW() WHERE id = $2 RETURNING *',
      ['published', id]
    );
    return rows[0];
  },
  async archive(id: string) {
    const { rows } = await pool.query(
      'UPDATE content SET status = $1 WHERE id = $2 RETURNING *',
      ['archived', id]
    );
    return rows[0];
  },
  async duplicate(id: string) {
    // Lấy content gốc
    const { rows } = await pool.query('SELECT * FROM content WHERE id = $1', [id]);
    if (!rows[0]) return null;
    const orig = rows[0];
    // Xóa id, cập nhật created_at, updated_at
    delete orig.id;
    orig.created_at = new Date();
    orig.updated_at = new Date();
    orig.title = orig.title + ' (Copy)';
    // Tạo content mới
    return await this.create(orig);
  },
  async findLatestByType(type: string, limit: number) {
    const { rows } = await pool.query(
      'SELECT * FROM content WHERE type = $1 ORDER BY created_at DESC LIMIT $2',
      [type, limit]
    );
    return rows;
  },
};
