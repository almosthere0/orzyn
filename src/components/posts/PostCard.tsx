import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Share2, Bookmark, MoreHorizontal, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import type { Post } from "@/hooks/usePosts";
import { CommentsSection } from "./CommentsSection";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  index: number;
}

export const PostCard = ({ post, onVote, index }: PostCardProps) => {
  const { user, isGuest } = useAuth();
  const [showComments, setShowComments] = useState(false);

  const isHot = post.votes > 50;
  const canVote = !!user && !isGuest;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-xl border border-border shadow-card overflow-hidden hover:border-primary/30 transition-colors"
    >
      <div className="p-4">
        <div className="flex gap-4">
          {/* Votes */}
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <button
              className={`hover:text-primary disabled:opacity-50 ${post.userVote === 'up' ? 'text-primary' : ''}`}
              disabled={!canVote}
              onClick={() => canVote && onVote(post.id, 'up')}
              title={!canVote ? "Sign in to vote" : "Upvote"}
            >
              ▲
            </button>
            <span className={`text-sm font-bold ${post.votes > 0 ? 'text-primary' : post.votes < 0 ? 'text-destructive' : ''}`}>
              {post.votes}
            </span>
            <button
              className={`hover:text-destructive disabled:opacity-50 ${post.userVote === 'down' ? 'text-destructive' : ''}`}
              disabled={!canVote}
              onClick={() => canVote && onVote(post.id, 'down')}
              title={!canVote ? "Sign in to vote" : "Downvote"}
            >
              ▼
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {isHot && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-orange-500/20 text-orange-500">
                  <Flame className="w-3 h-3" /> Hot
                </span>
              )}
              {post.school && (
                <span className="text-xs text-muted-foreground">
                  {post.school.name}
                </span>
              )}
            </div>

            <p className="text-foreground mb-3">{post.content}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>by {post.author?.username || "Anonymous"}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="w-4 h-4" />
            {post.commentCount} Comments
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Bookmark className="w-4 h-4" />
            Save
          </Button>
          <Button variant="ghost" size="icon" className="ml-auto">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showComments && (
        <CommentsSection postId={post.id} />
      )}
    </motion.article>
  );
};
