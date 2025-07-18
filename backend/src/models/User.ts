export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'inactive' | 'banned';
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  join_date: Date;
  last_active?: Date;
}
