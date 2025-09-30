import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface Comment {
  id: string;
  content_id: string;
  user_id: string;
  text: string;
  created_at: string;
  updated_at?: string;
  status: 'visible' | 'hidden' | 'deleted';
  parent_id?: string | null;
  user?: {
    id: string;
    email: string;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  contentId: string;
}

export default function CommentSection({ contentId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?contentId=${contentId}&page=${pageNum}&limit=10`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (append) {
          setComments(prev => [...prev, ...data.data]);
        } else {
          setComments(data.data);
        }
        
        setHasMore(data.data.length === 10);
      } else {
        throw new Error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1, false);
  }, [contentId]);

  const handleCommentAdded = (newComment: Comment) => {
    if (newComment.parent_id) {
      // This is a reply, add it to the appropriate parent comment
      setComments(prev => 
        prev.map(comment => 
          comment.id === newComment.parent_id
            ? { ...comment, replies: [...(comment.replies || []), newComment] }
            : comment
        )
      );
    } else {
      // This is a top-level comment
      setComments(prev => [newComment, ...prev]);
    }
  };

  const handleCommentUpdated = (updatedComment: Comment) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === updatedComment.id
          ? updatedComment
          : comment
      )
    );
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments(prev => 
      prev.filter(comment => comment.id !== commentId)
    );
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchComments(nextPage, true);
    }
  };

  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-xl font-semibold mb-6">Comments ({comments.length})</h3>
      
      {user && (
        <CommentForm 
          contentId={contentId}
          onCommentAdded={handleCommentAdded}
        />
      )}
      
      {!user && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">Please log in to leave a comment</p>
        </div>
      )}
      
      <CommentList
        comments={comments}
        onCommentUpdated={handleCommentUpdated}
        onCommentDeleted={handleCommentDeleted}
        onCommentAdded={handleCommentAdded}
      />
      
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Comments'}
          </button>
        </div>
      )}
    </div>
  );
}
