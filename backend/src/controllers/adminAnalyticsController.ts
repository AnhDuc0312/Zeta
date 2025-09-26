import { Request, Response } from 'express';
import { UserRepository } from '../repositories/userRepository';
import { ContentRepository } from '../repositories/contentRepository';
import { CommentRepository } from '../repositories/commentRepository';

export const AdminAnalyticsController = {
  async overview(req: Request, res: Response) {
    try {
      const users = await UserRepository.findAll();
      const content = await ContentRepository.findAll();
      const comments = await CommentRepository.findAll();
      
      // Calculate total views
      const totalViews = content.reduce((sum, item) => sum + (item.views || 0), 0);
      
      // Calculate active users (users with content)
      const activeUsers = users.filter(user => 
        content.some(item => item.author_id === user.id)
      ).length;
      
      // Calculate content by type
      const articles = content.filter(item => item.type === 'article').length;
      const documents = content.filter(item => item.type === 'document').length;
      const notes = content.filter(item => item.type === 'note').length;
      
      // Calculate content by status
      const published = content.filter(item => item.status === 'published').length;
      const draft = content.filter(item => item.status === 'draft').length;
      const archived = content.filter(item => item.status === 'archived').length;
      
      res.json({
        totalUsers: users.length,
        activeUsers,
        totalContent: content.length,
        totalViews,
        totalComments: comments.length,
        articles,
        documents,
        notes,
        published,
        draft,
        archived,
        // Growth rates (mock data for now)
        userGrowth: 12.5,
        contentGrowth: 8.3,
        viewGrowth: 15.7,
        engagementRate: 24.6,
      });
    } catch (error) {
      console.error('Error fetching overview analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
  },
  async content(req: Request, res: Response) {
    try {
      const content = await ContentRepository.findAll();
      
      // Get top 10 content by views with author names
      const topContent = content
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 10)
        .map(item => ({
          id: item.id,
          title: item.title,
          type: item.type?.charAt(0).toUpperCase() + item.type?.slice(1) || 'Unknown',
          views: item.views || 0,
          engagement: Math.round(((item.likes || 0) + (item.comments || 0)) / Math.max(item.views || 1, 1) * 100),
          author: item.author_email || 'Unknown',
        }));
      
      res.json({ topContent });
    } catch (error) {
      console.error('Error fetching content analytics:', error);
      res.status(500).json({ error: 'Failed to fetch content analytics' });
    }
  },
  async users(req: Request, res: Response) {
    try {
      const users = await UserRepository.findAll();
      const content = await ContentRepository.findAll();
      
      // Calculate content count per user
      const userStats = users.map(user => {
        const userContent = content.filter(item => item.author_id === user.id);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          contentCount: userContent.length,
          totalViews: userContent.reduce((sum, item) => sum + (item.views || 0), 0),
        };
      });
      
      // Sort by content count and take top 10
      const topUsers = userStats
        .sort((a, b) => b.contentCount - a.contentCount)
        .slice(0, 10);
      
      res.json({ topUsers });
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      res.status(500).json({ error: 'Failed to fetch user analytics' });
    }
  },
};
