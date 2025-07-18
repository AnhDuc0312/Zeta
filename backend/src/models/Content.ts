export interface Content {
  id: string;
  type: 'article' | 'document' | 'note';
  title: string;
  description?: string;
  content?: string;
  file_url?: string;
  file_size?: string;
  status: 'published' | 'draft' | 'private' | 'archived';
  author_id: string;
  author_email?: string;
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
  views: number;
  likes: number;
  comments: number;
  category_id?: string;
  featured: boolean;
  word_count?: number;
  seo_title?: string;
  seo_description?: string;
  custom_url?: string;
  allow_comments: boolean;
}
