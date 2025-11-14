'use client'

import { useState } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { getCommentsByTask, getUserById, Comment } from '../../data/mockData';
import { Send, Smile, AtSign, MoreVertical, Edit2, Trash2, CornerDownRight } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface CommentThreadProps {
  taskId: string;
  currentUserId: string;
}

const REACTION_EMOJIS = ['👍', '❤️', '🎉', '🚀', '👀', '😊'];

export function CommentThread({ taskId, currentUserId }: CommentThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; author: string } | null>(null);

  const comments = getCommentsByTask(taskId);
  const topLevelComments = comments.filter((c) => !c.parent_id);

  const getReplies = (commentId: string) => {
    return comments.filter((c) => c.parent_id === commentId);
  };

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    console.log('Post comment:', newComment, 'reply to:', replyTo?.id);
    setNewComment('');
    setReplyTo(null);
  };

  const handleReaction = (commentId: string, emoji: string) => {
    console.log('Add reaction:', emoji, 'to comment:', commentId);
  };

  const handleReply = (commentId: string, authorName: string) => {
    setReplyTo({ id: commentId, author: authorName });
  };

  const currentUserData = getUserById(currentUserId);

  return (
    <div className="space-y-4">
      {/* Comment input */}
      <div className="space-y-2">
        {replyTo && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <CornerDownRight className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-blue-900">
                Replying to <span className="font-medium">{replyTo.author}</span>
              </div>
              <div className="text-xs text-blue-700 mt-0.5">
                Your reply will be nested under their comment
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>
              Cancel
            </Button>
          </div>
        )}
        <div className="flex gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs">
              {currentUserData?.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder={
                replyTo
                  ? `Reply to ${replyTo.author}...`
                  : 'Add a comment... Use @ to mention someone'
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                    <div className="flex gap-1">
                      {REACTION_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setNewComment(newComment + emoji);
                          }}
                          className="text-xl hover:bg-muted p-2 rounded transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="ghost" size="sm">
                  <AtSign className="w-4 h-4" />
                </Button>
              </div>
              <Button size="sm" onClick={handleSubmit} disabled={!newComment.trim()}>
                <Send className="w-4 h-4 mr-2" />
                {replyTo ? 'Reply' : 'Comment'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {topLevelComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={getReplies(comment.id)}
            onReply={handleReply}
            onReact={handleReaction}
            currentUserId={currentUserId}
          />
        ))}
        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquareIcon />
            <p className="text-sm mt-2">No comments yet</p>
            <p className="text-xs mt-1">Start the discussion!</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  onReply: (commentId: string, authorName: string) => void;
  onReact: (commentId: string, emoji: string) => void;
  currentUserId: string;
  isReply?: boolean;
}

function CommentItem({
  comment,
  replies,
  onReply,
  onReact,
  currentUserId,
  isReply = false,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const author = getUserById(comment.author_id);
  const timeAgo = getTimeAgo(new Date(comment.created_at));
  const isOwnComment = comment.author_id === currentUserId;

  const handleEdit = () => {
    console.log('Edit comment:', comment.id, editedContent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    console.log('Delete comment:', comment.id);
  };

  const handleReactionClick = (emoji: string) => {
    onReact(comment.id, emoji);
    setShowReactionPicker(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Avatar className={`${isReply ? 'w-6 h-6' : 'w-8 h-8'} mt-1`}>
          <AvatarFallback className="text-xs">
            {author?.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={isReply ? 'text-xs' : 'text-sm'}>{author?.name}</span>
                <span className="text-xs text-muted-foreground">{timeAgo}</span>
                {author?.role && (
                  <Badge variant="secondary" className="text-xs">
                    {author.role.toUpperCase()}
                  </Badge>
                )}
              </div>
              {isOwnComment && !isEditing && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit2 className="w-3 h-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                      <Trash2 className="w-3 h-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-2 mt-2">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[60px]"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(comment.content);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleEdit}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className={`${isReply ? 'text-xs' : 'text-sm'} whitespace-pre-wrap`}>
                {comment.content}
              </p>
            )}
          </div>

          {/* Reactions */}
          {!isEditing && (
            <div className="flex items-center gap-2 flex-wrap">
              {comment.reactions.map((reaction, idx) => (
                <button
                  key={idx}
                  onClick={() => onReact(comment.id, reaction.emoji)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all ${
                    reaction.user_ids.includes(currentUserId)
                      ? 'bg-blue-100 border border-blue-300'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <span className="text-sm">{reaction.emoji}</span>
                  <span className="text-xs font-medium">{reaction.user_ids.length}</span>
                </button>
              ))}
              <Popover open={showReactionPicker} onOpenChange={setShowReactionPicker}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    <Smile className="w-3 h-3 mr-1" />
                    React
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <div className="flex gap-1">
                    {REACTION_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReactionClick(emoji)}
                        className="text-xl hover:bg-muted p-2 rounded transition-all hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => onReply(comment.id, author?.name || 'user')}
                >
                  Reply
                </Button>
              )}
            </div>
          )}

          {/* Replies */}
          {!isReply && replies.length > 0 && (
            <div className="space-y-3 ml-4 mt-3 border-l-2 border-blue-200 pl-4">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  replies={[]}
                  onReply={onReply}
                  onReact={onReact}
                  currentUserId={currentUserId}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageSquareIcon() {
  return (
    <svg
      className="w-12 h-12 mx-auto text-muted-foreground/50"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
