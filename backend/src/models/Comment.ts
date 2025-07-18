export interface Comment {
  id: string;
  content_id: string;
  user_id: string;
  text: string;
  created_at: Date;
  status: 'visible' | 'hidden' | 'deleted';
}
