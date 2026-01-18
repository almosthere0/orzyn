import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: {
    username: string | null;
  };
}

export const useComments = (postId: string) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("comments")
      .select(`
        id,
        post_id,
        author_id,
        content,
        created_at,
        author:profiles!comments_author_id_fkey(username)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (data) {
      setComments(data.map(c => ({
        ...c,
        author: c.author as { username: string | null } | undefined,
      })));
    }

    setLoading(false);
  };

  const addComment = async (content: string) => {
    if (!user) return { error: "Not authenticated" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile) return { error: "Profile not found" };

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      author_id: profile.id,
      content,
    });

    if (!error) {
      fetchComments();
    }

    return { error: error?.message };
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return { comments, loading, addComment, refetch: fetchComments };
};
