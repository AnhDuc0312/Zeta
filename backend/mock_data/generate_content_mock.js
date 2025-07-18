const fs = require('fs');
const path = require('path');

// 20 bản ghi gốc (copy từ file content.json hiện tại, sẽ được làm giàu thêm trường ở bước dưới)
const baseContent = [
  { "id": "1", "title": "Giới thiệu về Node.js", "type": "article", "status": "published", "author_id": "1", "category_id": "1" },
  { "id": "2", "title": "Học TypeScript cơ bản", "type": "article", "status": "draft", "author_id": "2", "category_id": "1" },
  { "id": "3", "title": "Du lịch Đà Lạt mùa hè", "type": "note", "status": "published", "author_id": "3", "category_id": "3" },
  { "id": "4", "title": "Công thức nấu phở bò", "type": "document", "status": "archived", "author_id": "4", "category_id": "4" },
  { "id": "5", "title": "React Hooks nâng cao", "type": "article", "status": "published", "author_id": "5", "category_id": "1" },
  { "id": "6", "title": "Học lập trình PostgreSQL", "type": "article", "status": "published", "author_id": "6", "category_id": "1" },
  { "id": "7", "title": "Phong cách sống tối giản", "type": "note", "status": "published", "author_id": "7", "category_id": "5" },
  { "id": "8", "title": "Học online hiệu quả", "type": "article", "status": "published", "author_id": "8", "category_id": "2" },
  { "id": "9", "title": "Ăn chay đúng cách", "type": "document", "status": "draft", "author_id": "9", "category_id": "4" },
  { "id": "10", "title": "Lập trình Express nâng cao", "type": "article", "status": "published", "author_id": "10", "category_id": "1" },
  { "id": "11", "title": "Cách học hiệu quả", "type": "note", "status": "published", "author_id": "1", "category_id": "2" },
  { "id": "12", "title": "Du lịch miền Tây", "type": "article", "status": "published", "author_id": "2", "category_id": "3" },
  { "id": "13", "title": "Ăn uống healthy", "type": "document", "status": "archived", "author_id": "3", "category_id": "4" },
  { "id": "14", "title": "Lập trình React", "type": "article", "status": "published", "author_id": "4", "category_id": "1" },
  { "id": "15", "title": "Sống xanh", "type": "note", "status": "published", "author_id": "5", "category_id": "5" },
  { "id": "16", "title": "Học lập trình web", "type": "article", "status": "published", "author_id": "6", "category_id": "2" },
  { "id": "17", "title": "Ẩm thực miền Trung", "type": "document", "status": "archived", "author_id": "7", "category_id": "4" },
  { "id": "18", "title": "Du lịch biển", "type": "note", "status": "published", "author_id": "8", "category_id": "3" },
  { "id": "19", "title": "Lập trình backend", "type": "article", "status": "published", "author_id": "9", "category_id": "1" },
  { "id": "20", "title": "Học ngoại ngữ online", "type": "article", "status": "published", "author_id": "10", "category_id": "2" }
];

const types = ['article', 'note', 'document'];
const statuses = ['published', 'draft', 'private', 'archived'];
const authorIds = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
const categoryIds = Array.from({ length: 5 }, (_, i) => (i + 1).toString());
const tagIds = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

function randomTags() {
  const n = Math.floor(Math.random() * 3) + 1;
  const shuffled = tagIds.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}
function pad(num) { return num.toString().padStart(2, '0'); }
function randomBool() { return Math.random() < 0.5; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomStr(prefix, i) { return `${prefix}_${i}_${Math.random().toString(36).substring(2, 8)}`; }

function enrichContent(item, i) {
  const day = pad(((i - 1) % 28) + 1);
  const month = pad(((i - 1) % 12) + 1);
  const created_at = `2024-${month}-${day}T10:00:00Z`;
  const updated_at = `2024-${month}-${day}T12:00:00Z`;
  const published_at = randomBool() ? `2024-${month}-${day}T15:00:00Z` : undefined;
  return {
    ...item,
    description: item.description || `Mô tả cho ${item.title}`,
    content: item.content || `Nội dung chi tiết cho ${item.title}`,
    file_url: randomBool() ? `https://files.example.com/file_${i}.pdf` : undefined,
    file_size: randomBool() ? `${randomInt(10, 500)}MB` : undefined,
    status: item.status || statuses[randomInt(0, statuses.length - 1)],
    author_email: randomBool() ? `user${item.author_id}@example.com` : undefined,
    created_at,
    updated_at,
    published_at,
    views: randomInt(0, 10000),
    likes: randomInt(0, 1000),
    comments: randomInt(0, 100),
    category_id: item.category_id || categoryIds[randomInt(0, categoryIds.length - 1)],
    featured: randomBool(),
    word_count: randomBool() ? randomInt(100, 3000) : undefined,
    seo_title: randomBool() ? `${item.title} SEO` : undefined,
    seo_description: randomBool() ? `SEO cho ${item.title}` : undefined,
    custom_url: randomBool() ? `/bai-viet/${item.id}` : undefined,
    allow_comments: randomBool(),
    tags: item.tags || randomTags(),
  };
}

const enrichedBase = baseContent.map((item, idx) => enrichContent(item, idx + 1));

const newContent = [];
for (let i = 21; i <= 220; i++) {
  const type = types[randomInt(0, types.length - 1)];
  const status = statuses[randomInt(0, statuses.length - 1)];
  const author_id = authorIds[randomInt(0, authorIds.length - 1)];
  const category_id = categoryIds[randomInt(0, categoryIds.length - 1)];
  const tags = randomTags();
  const day = pad(((i - 1) % 28) + 1);
  const month = pad(((i - 1) % 12) + 1);
  const created_at = `2024-${month}-${day}T10:00:00Z`;
  const updated_at = `2024-${month}-${day}T12:00:00Z`;
  const published_at = randomBool() ? `2024-${month}-${day}T15:00:00Z` : undefined;
  newContent.push({
    id: i.toString(),
    type,
    title: `Bài viết số ${i}`,
    description: `Mô tả cho bài viết số ${i}`,
    content: `Nội dung chi tiết cho bài viết số ${i}`,
    file_url: randomBool() ? `https://files.example.com/file_${i}.pdf` : undefined,
    file_size: randomBool() ? `${randomInt(10, 500)}MB` : undefined,
    status,
    author_id,
    author_email: randomBool() ? `user${author_id}@example.com` : undefined,
    created_at,
    updated_at,
    published_at,
    views: randomInt(0, 10000),
    likes: randomInt(0, 1000),
    comments: randomInt(0, 100),
    category_id,
    featured: randomBool(),
    word_count: randomBool() ? randomInt(100, 3000) : undefined,
    seo_title: randomBool() ? `Bài viết số ${i} SEO` : undefined,
    seo_description: randomBool() ? `SEO cho bài viết số ${i}` : undefined,
    custom_url: randomBool() ? `/bai-viet/${i}` : undefined,
    allow_comments: randomBool(),
    tags
  });
}

const allContent = [...enrichedBase, ...newContent];

fs.writeFileSync(
  path.join(__dirname, 'content.json'),
  JSON.stringify(allContent, null, 2),
  'utf-8'
);

console.log('Đã tạo file content.json với', allContent.length, 'bản ghi!'); 