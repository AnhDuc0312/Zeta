export interface ActivityLog {
  id: string;
  timestamp: Date;
  user_id: string;
  action: string;
  resource?: string;
  ip?: string;
  user_agent?: string;
  status: 'success' | 'warning' | 'error' | 'info';
  details?: string;
}
