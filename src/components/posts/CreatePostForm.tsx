import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Send, ImagePlus } from "lucide-react";
import { toast } from "sonner";

interface CreatePostFormProps {
  onSubmit: (content: string, imageUrls: string[]) => Promise<{ error?: string }>;
}

export const CreatePostForm = ({ onSubmit }: CreatePostFormProps) => {
  const { user, isGuest } = useAuth();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canPost = !!user && !isGuest;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting || !canPost) return;

    setSubmitting(true);
    const { error } = await onSubmit(content.trim(), []);
    
    if (error) {
      toast.error("Failed to create post");
    } else {
      toast.success("Post created!");
      setContent("");
    }
    
    setSubmitting(false);
  };

  if (!canPost) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-4 mb-6">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] mb-4 resize-none"
      />
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="sm" className="gap-2">
          <ImagePlus className="w-4 h-4" />
          Add Image
        </Button>
        <Button type="submit" disabled={!content.trim() || submitting} className="gap-2">
          <Send className="w-4 h-4" />
          Post
        </Button>
      </div>
    </form>
  );
};
