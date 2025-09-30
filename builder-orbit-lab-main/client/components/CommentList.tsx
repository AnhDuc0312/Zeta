import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import CommentItem from './CommentItem';

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

interface CommentListProps {
  comments: Comment[];
  onCommentUpdated: (comment: Comment) => void;
  onCommentDeleted: (commentId: string) => void;
  onCommentAdded: (comment: Comment) => void;
}

export default function CommentList({ 
  comments, 
  onCommentUpdated, 
  onCommentDeleted, 
  onCommentAdded 
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onCommentUpdated={onCommentUpdated}
          onCommentDeleted={onCommentDeleted}
          onCommentAdded={onCommentAdded}
        />
      ))}
    </div>
  );
}
