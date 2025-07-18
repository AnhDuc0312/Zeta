const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const mockDir = __dirname;

// Đọc file JSON
function readJSON(filename) {
  return JSON.parse(fs.readFileSync(path.join(mockDir, filename), 'utf-8'));
}
// Ghi file JSON
function writeJSON(filename, data) {
  fs.writeFileSync(path.join(mockDir, filename), JSON.stringify(data, null, 2), 'utf-8');
}

// Tạo map id cũ -> uuid cho từng loại
function createIdMap(arr, key = 'id') {
  const map = {};
  arr.forEach(item => {
    map[item[key]] = uuidv4();
  });
  return map;
}

// Đọc dữ liệu gốc
const users = readJSON('users.json');
const categories = readJSON('categories.json');
const tags = readJSON('tags.json');
const content = readJSON('content.json');
const comments = readJSON('comments.json');
const activityLogs = readJSON('activity_logs.json');
const analyticsEvents = readJSON('analytics_events.json');
const settings = readJSON('settings.json');

// Tạo map id cho từng loại
const userIdMap = createIdMap(users);
const categoryIdMap = createIdMap(categories);
const tagIdMap = createIdMap(tags);
const contentIdMap = createIdMap(content);
const commentIdMap = createIdMap(comments);
const activityLogIdMap = createIdMap(activityLogs);
const analyticsEventIdMap = createIdMap(analyticsEvents);
const settingsIdMap = createIdMap(settings);

// Helper thay id trong tags array
function mapTags(tagsArr) {
  if (!Array.isArray(tagsArr)) return tagsArr;
  return tagsArr.map(tid => tagIdMap[tid] || tid);
}

// Chuyển đổi users
const usersUUID = users.map(u => ({ ...u, id: userIdMap[u.id] }));

// Chuyển đổi categories
const categoriesUUID = categories.map(c => ({ ...c, id: categoryIdMap[c.id] }));

// Chuyển đổi tags
const tagsUUID = tags.map(t => ({ ...t, id: tagIdMap[t.id] }));

// Chuyển đổi content
const contentUUID = content.map(c => ({
  ...c,
  id: contentIdMap[c.id],
  author_id: userIdMap[c.author_id] || c.author_id,
  category_id: categoryIdMap[c.category_id] || c.category_id,
  tags: mapTags(c.tags)
}));

// Chuyển đổi comments
const commentsUUID = comments.map(c => ({
  ...c,
  id: commentIdMap[c.id],
  user_id: userIdMap[c.user_id] || c.user_id,
  content_id: contentIdMap[c.content_id] || c.content_id
}));

// Chuyển đổi activity_logs
const activityLogsUUID = activityLogs.map(l => ({
  ...l,
  id: activityLogIdMap[l.id],
  user_id: userIdMap[l.user_id] || l.user_id
}));

// Chuyển đổi analytics_events
const analyticsEventsUUID = analyticsEvents.map(e => ({
  ...e,
  id: analyticsEventIdMap[e.id],
  user_id: userIdMap[e.user_id] || e.user_id,
  content_id: contentIdMap[e.content_id] || e.content_id
}));

// Chuyển đổi settings
const settingsUUID = settings.map(s => ({ ...s, id: settingsIdMap[s.id] }));

// Ghi đè lại file
writeJSON('users.json', usersUUID);
writeJSON('categories.json', categoriesUUID);
writeJSON('tags.json', tagsUUID);
writeJSON('content.json', contentUUID);
writeJSON('comments.json', commentsUUID);
writeJSON('activity_logs.json', activityLogsUUID);
writeJSON('analytics_events.json', analyticsEventsUUID);
writeJSON('settings.json', settingsUUID);

console.log('Đã chuyển đổi mock data sang UUID và đồng bộ các liên kết!'); 