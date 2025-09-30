import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import CommentForm from './CommentForm';
import { 
  Reply, 
  Edit3, 
  Trash2, 
  MoreVertical, 
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';

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
    username: string;
    email: string;
  };
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  onCommentUpdated: (comment: Comment) => void;
  onCommentDeleted: (commentId: string) => void;
  onCommentAdded: (comment: Comment) => void;
}

export default function CommentItem({ 
  comment, 
  onCommentUpdated, 
  onCommentDeleted, 
  onCommentAdded 
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const isOwner = user?.id === comment.user_id;
  const hasReplies = comment.replies && comment.replies.length > 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onCommentDeleted(comment.id);
        toast({
          title: "Success",
          description: "Comment deleted successfully",
        });
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
    setShowMenu(false);
  };

  const handleUpdate = (updatedComment: Comment) => {
    onCommentUpdated(updatedComment);
    setIsEditing(false);
  };

  const handleReply = (replyComment: Comment) => {
    onCommentAdded(replyComment);
    setIsReplying(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
  };

  return (
    <div className={`${comment.parent_id ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-900">
                {comment.user?.email || 'Anonymous'}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(comment.created_at)}
              </span>
              {comment.updated_at && comment.updated_at !== comment.created_at && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>
            
            {isEditing ? (
              <CommentForm
                contentId={comment.content_id}
                parentId={comment.parent_id}
                onCommentAdded={handleUpdate}
                onCancel={handleCancelEdit}
                placeholder="Edit your comment..."
                initialText={comment.text}
                commentId={comment.id}
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
            )}
          </div>
          
          {isOwner && !isEditing && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleEdit}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <Reply className="w-3 h-3" />
              Reply
            </button>
            
            {hasReplies && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
              >
                {showReplies ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                {comment.replies?.length} {comment.replies?.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>
        )}
      </div>
      
      {isReplying && (
        <div className="mt-3">
          <CommentForm
            contentId={comment.content_id}
            parentId={comment.id}
            onCommentAdded={handleReply}
            onCancel={handleCancelReply}
            placeholder={`Reply to ${comment.user?.email || 'Anonymous'}...`}
          />
        </div>
      )}
      
      {hasReplies && showReplies && (
        <div className="mt-3 space-y-3">
          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onCommentUpdated={onCommentUpdated}
              onCommentDeleted={onCommentDeleted}
              onCommentAdded={onCommentAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
