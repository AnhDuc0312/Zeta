import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { Send, X } from 'lucide-react';

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

interface CommentFormProps {
  contentId: string;
  parentId?: string | null;
  onCommentAdded: (comment: Comment) => void;
  onCancel?: () => void;
  placeholder?: string;
  initialText?: string;
  commentId?: string;
}

export default function CommentForm({ 
  contentId, 
  parentId = null, 
  onCommentAdded, 
  onCancel,
  placeholder = "Write a comment...",
  initialText = '',
  commentId
}: CommentFormProps) {
  const [text, setText] = useState(initialText);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const isEditing = !!commentId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      let response;
      if (isEditing) {
        response = await fetch(`/api/comments/${commentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            body: text.trim()
          }),
        });
      } else {
        response = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            contentId,
            body: text.trim(),
            parentId
          }),
        });
      }

      if (response.ok) {
        const comment = await response.json();
        onCommentAdded(comment);
        setText('');
        if (onCancel) onCancel();
        
        toast({
          title: "Success",
          description: isEditing 
            ? "Comment updated!" 
            : parentId 
              ? "Reply posted!" 
              : "Comment posted!",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${isEditing ? 'update' : 'post'} comment`);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-3">
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isSubmitting}
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          {isSubmitting 
            ? (isEditing ? 'Updating...' : 'Posting...') 
            : isEditing 
              ? 'Update' 
              : (parentId ? 'Reply' : 'Comment')
          }
        </button>
      </div>
    </form>
  );
}
