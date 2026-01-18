import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useComments } from "@/hooks/useComments";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";

interface CommentsSectionProps {
  postId: string;
}

export const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const { user, isGuest } = useAuth();
  const { comments, loading, addComment } = useComments(postId);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    const { error } = await addComment(newComment.trim());
    if (!error) {
      setNewComment("");
    }
    setSubmitting(false);
  };

  const canComment = !!user && !isGuest;

  return (
    <div className="border-t border-border bg-muted/30 p-4">
      {canComment && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newComment.trim() || submitting}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      )}

      {!canComment && (
        <p className="text-sm text-muted-foreground mb-4">
          Sign in to leave a comment
        </p>
      )}

      {loading ? (
        <div className="text-center py-4 text-muted-foreground">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">No comments yet. Be the first!</div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium shrink-0">
                {(comment.author?.username || "A").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.author?.username || "Anonymous"}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-foreground">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
