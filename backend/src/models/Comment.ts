export interface Comment {
  id: string;
  content_id: string;
  user_id: string;
  text: string;
  created_at: Date;
  updated_at?: Date;
  status: 'visible' | 'hidden' | 'deleted';
  parent_id?: string | null;
  user?: {
    id: string;
    email: string;
  };
  replies?: Comment[];
}
