import express from 'express';
import { addBookmark, removeBookmark, getBookmarkStatus, getUserBookmarks, getBookmarkStats } from '../controllers/bookmarkController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Bookmark content
router.post('/content/:id/bookmark', authenticateJWT, addBookmark);

// Remove bookmark
router.delete('/content/:id/bookmark', authenticateJWT, removeBookmark);

// Check bookmark status
router.get('/content/:id/bookmark-status', authenticateJWT, getBookmarkStatus);

// Get user bookmarks
router.get('/user/bookmarks', authenticateJWT, getUserBookmarks);

// Get bookmark statistics
router.get('/user/bookmarks/stats', authenticateJWT, getBookmarkStats);

export default router;
