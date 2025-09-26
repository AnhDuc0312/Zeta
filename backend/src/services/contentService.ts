import { ContentRepository } from '../repositories/contentRepository';
import { CategoryRepository } from '../repositories/categoryRepository';

const DEFAULT_CATEGORY_ID = 'c519880f-20aa-44db-a769-9d6efc291ee9';

async function normalizeContentPayload(data: any, req?: any) {
  const normalized: any = { ...data };
  // Map body -> content nếu chỉ có body
  if (typeof normalized.body === 'string' && !normalized.content) {
    normalized.content = normalized.body;
    delete normalized.body;
  }
  // Map content -> body nếu chỉ có content (nếu DB cần trường body)
  // Nếu chỉ cần content thì bỏ qua dòng này

  // Map category (name) -> category_id (UUID)
  if (normalized.category && !normalized.category_id) {
    const found = await CategoryRepository.findByName(normalized.category);
    if (found) {
      normalized.category_id = found.id;
    } else {
      normalized.category_id = DEFAULT_CATEGORY_ID;
    }
    delete normalized.category;
  }
  
  // Ensure category_id is valid UUID or use default
  if (!normalized.category_id || normalized.category_id === '') {
    normalized.category_id = DEFAULT_CATEGORY_ID;
  }
  // Đảm bảo tags là mảng
  if (typeof normalized.tags === 'string') {
    if (normalized.tags.trim() === '') normalized.tags = [];
    else {
      try {
        const parsed = JSON.parse(normalized.tags);
        if (Array.isArray(parsed)) normalized.tags = parsed;
        else normalized.tags = [normalized.tags];
      } catch {
        normalized.tags = [normalized.tags];
      }
    }
  } else if (!Array.isArray(normalized.tags)) {
    normalized.tags = [];
  }
  // Đảm bảo tags là JSON string khi lưu DB
  if (Array.isArray(normalized.tags) || typeof normalized.tags === 'object') {
    normalized.tags = JSON.stringify(normalized.tags);
  }
  // Map allowComments -> allow_comments
  if (typeof normalized.allowComments !== 'undefined') {
    normalized.allow_comments = normalized.allowComments;
    delete normalized.allowComments;
  }
  // Map seoTitle -> seo_title
  if (typeof normalized.seoTitle !== 'undefined') {
    normalized.seo_title = normalized.seoTitle;
    delete normalized.seoTitle;
  }
  // Map seoDescription -> seo_description
  if (typeof normalized.seoDescription !== 'undefined') {
    normalized.seo_description = normalized.seoDescription;
    delete normalized.seoDescription;
  }
  // Map customUrl -> custom_url
  if (typeof normalized.customUrl !== 'undefined') {
    normalized.custom_url = normalized.customUrl;
    delete normalized.customUrl;
  }
  // Map publishDate -> published_at
  if (typeof normalized.publishDate !== 'undefined') {
    normalized.published_at = normalized.publishDate;
    delete normalized.publishDate;
  }
  // Sinh các trường mặc định nếu chưa có
  const now = new Date();
  if (!normalized.created_at) normalized.created_at = now;
  if (!normalized.updated_at) normalized.updated_at = now;
  if (typeof normalized.views === 'undefined') normalized.views = 0;
  if (typeof normalized.likes === 'undefined') normalized.likes = 0;
  if (typeof normalized.comments === 'undefined') normalized.comments = 0;
  if (typeof normalized.featured === 'undefined') normalized.featured = false;
  if (typeof normalized.allow_comments === 'undefined') normalized.allow_comments = true;
  if (typeof normalized.status === 'undefined') normalized.status = 'draft';
  // author_id: nên lấy từ req.user ở controller, nếu không có thì để nguyên
  // Map author_id từ req.user nếu có
  if (req && req.user && req.user.id) {
    normalized.author_id = req.user.id;
  }
  // Loại bỏ trường author nếu có
  if (typeof normalized.author !== 'undefined') {
    delete normalized.author;
  }
  // Loại bỏ các trường không hợp lệ (nếu cần)
  return normalized;
}

export const ContentService = {
  async getAllContent(type?: string) {
    if (type) {
      return await ContentRepository.findAllWithPagination(1, 1000, type); // hoặc tuỳ ý limit lớn
    }
    return await ContentRepository.findAll();
  },
  async getContentWithPagination(page: number, limit: number, type?: string, filters?: any) {
    return await ContentRepository.findAllWithPagination(page, limit, type, filters);
  },
  async getContentById(id: string) {
    return await ContentRepository.findById(id);
  },
  async deleteContent(id: string) {
    return await ContentRepository.deleteById(id);
  },
  async createContent(data: Partial<any>, req?: any) {
    const normalized = await normalizeContentPayload(data, req);
    return await ContentRepository.create(normalized);
  },
  async updateContent(id: string, data: Partial<any>, req?: any) {
    const normalized = await normalizeContentPayload(data, req);
    return await ContentRepository.update(id, normalized);
  },
  async publishContent(id: string) {
    return await ContentRepository.publish(id);
  },
  async archiveContent(id: string) {
    return await ContentRepository.archive(id);
  },
  async duplicateContent(id: string) {
    return await ContentRepository.duplicate(id);
  },
  async getLatestByType(type: string, limit: number) {
    return await ContentRepository.findLatestByType(type, limit);
  },
  async likeContent(userId: string, contentId: string) {
    return await ContentRepository.likeContent(userId, contentId);
  },
  async unlikeContent(userId: string, contentId: string) {
    return await ContentRepository.unlikeContent(userId, contentId);
  },
  async getLikeStatus(userId: string, contentId: string) {
    return await ContentRepository.getLikeStatus(userId, contentId);
  },
  async getContentStats() {
    return await ContentRepository.getContentStats();
  },
  async incrementView(contentId: string, userId?: string) {
    return await ContentRepository.incrementView(contentId, userId);
  },
};
