export interface AnalyticsEvent {
  id: string;
  event_type: string;
  user_id?: string;
  content_id?: string;
  timestamp: Date;
  meta?: any;
}
