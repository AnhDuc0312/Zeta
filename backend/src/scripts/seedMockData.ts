import fs from 'fs';
import path from 'path';
import pool from '../db';

const mockDir = path.join(__dirname, '../../mock_data');

function readJSON(filename: string) {
  return JSON.parse(fs.readFileSync(path.join(mockDir, filename), 'utf-8'));
}

async function seedUsers() {
  const users = readJSON('users.json');
  for (const u of users) {
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role, status, avatar, bio, location, website, join_date, last_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (id) DO NOTHING`,
      [
        u.id,
        u.name,
        u.email,
        u.password_hash,
        u.role,
        u.status,
        u.avatar,
        u.bio,
        u.location,
        u.website,
        u.join_date,
        u.last_active,
      ],
    );
  }
}

async function seedCategories() {
  const categories = readJSON('categories.json');
  for (const c of categories) {
    await pool.query(
      `INSERT INTO categories (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
      [c.id, c.name],
    );
  }
}

async function seedTags() {
  const tags = readJSON('tags.json');
  for (const t of tags) {
    await pool.query(`INSERT INTO tags (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`, [
      t.id,
      t.name,
    ]);
  }
}

async function seedContent() {
  const contents = readJSON('content.json');
  for (const c of contents) {
    await pool.query(
      `INSERT INTO content (
        id, type, title, description, content, file_url, file_size, status, author_id, author_email, created_at, updated_at, published_at, views, likes, comments, category_id, featured, word_count, seo_title, seo_description, custom_url, allow_comments, tags
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24
      ) ON CONFLICT (id) DO NOTHING`,
      [
        c.id,
        c.type,
        c.title,
        c.description,
        c.content,
        c.file_url,
        c.file_size,
        c.status,
        c.author_id,
        c.author_email,
        c.created_at,
        c.updated_at,
        c.published_at,
        c.views,
        c.likes,
        c.comments,
        c.category_id,
        c.featured,
        c.word_count,
        c.seo_title,
        c.seo_description,
        c.custom_url,
        c.allow_comments,
        JSON.stringify(c.tags),
      ],
    );
  }
}

async function seedComments() {
  const comments = readJSON('comments.json');
  for (const c of comments) {
    await pool.query(
      `INSERT INTO comments (id, content_id, user_id, text, created_at, status)
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
      [c.id, c.content_id, c.user_id, c.text, c.created_at, c.status],
    );
  }
}

async function seedActivityLogs() {
  const logs = readJSON('activity_logs.json');
  for (const l of logs) {
    await pool.query(
      `INSERT INTO activity_logs (id, timestamp, user_id, action, resource, ip, user_agent, status, details)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id) DO NOTHING`,
      [l.id, l.timestamp, l.user_id, l.action, l.resource, l.ip, l.user_agent, l.status, l.details],
    );
  }
}

async function seedSettings() {
  const settings = readJSON('settings.json');
  for (const s of settings) {
    await pool.query(
      `INSERT INTO settings (id, key, value) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
      [s.id, s.key, s.value],
    );
  }
}

async function seedAnalyticsEvents() {
  const events = readJSON('analytics_events.json');
  for (const e of events) {
    await pool.query(
      `INSERT INTO analytics_events (id, event_type, user_id, content_id, timestamp, meta)
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
      [
        e.id,
        e.event_type,
        e.user_id,
        e.content_id,
        e.timestamp,
        e.meta ? JSON.stringify(e.meta) : null,
      ],
    );
  }
}

async function main() {
  await seedUsers();
  await seedCategories();
  await seedTags();
  await seedContent();
  await seedComments();
  await seedActivityLogs();
  await seedSettings();
  await seedAnalyticsEvents();
  await pool.end();
  console.log('Seeded all mock data!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
