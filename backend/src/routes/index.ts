import express from 'express';
import userRoutes from './users';
import contentRoutes from './content';
import categoryRoutes from './categories';
import tagRoutes from './tags';
import commentRoutes from './comments';
import activityLogRoutes from './activityLogs';
import settingRoutes from './settings';
import analyticsEventRoutes from './analyticsEvents';
import authRoutes from './auth';
import searchRoutes from './search';
import uploadRoutes from './upload';
import healthRoutes from './health';
import adminUserRoutes from './adminUsers';
import adminAnalyticsRoutes from './adminAnalytics';
import adminActivityLogRoutes from './adminActivityLogs';
import adminSettingsRoutes from './adminSettings';
import accountRoutes from './account';
// Add other routers as needed

const routes = express.Router();

routes.use('/users', userRoutes);
routes.use('/content', contentRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/tags', tagRoutes);
routes.use('/comments', commentRoutes);
routes.use('/activity-logs', activityLogRoutes);
routes.use('/settings', settingRoutes);
routes.use('/analytics-events', analyticsEventRoutes);
routes.use('/auth', authRoutes);
routes.use('/search', searchRoutes);
routes.use('/upload', uploadRoutes);
routes.use('/health', healthRoutes);
routes.use('/account', accountRoutes);
routes.use('/admin/users', adminUserRoutes);
routes.use('/admin/analytics', adminAnalyticsRoutes);
routes.use('/admin/activity-logs', adminActivityLogRoutes);
routes.use('/admin/settings', adminSettingsRoutes);
// Add other routers as needed

export { routes };
