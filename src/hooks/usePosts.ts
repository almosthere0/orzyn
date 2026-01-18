import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Post {
  id: string;
  author_id: string;
  school_id: string | null;
  content: string;
  image_urls: string[];
  created_at: string;
  author?: {
    username: string | null;
  };
  school?: {
    name: string;
  };
  votes: number;
  userVote: 'up' | 'down' | null;
  commentCount: number;
}

export const usePosts = (schoolId?: string) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    
    let query = supabase
      .from("posts")
      .select(`
        id,
        author_id,
        school_id,
        content,
        image_urls,
        created_at,
        author:profiles!posts_author_id_fkey(username),
        school:schools(name)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (schoolId) {
      query = query.eq("school_id", schoolId);
    }

    const { data: postsData } = await query;

    if (postsData) {
      const postsWithVotes = await Promise.all(
        postsData.map(async (post) => {
          const { data: votes } = await supabase
            .from("post_votes")
            .select("vote_type")
            .eq("post_id", post.id);

          const { count: commentCount } = await supabase
            .from("comments")
            .select("id", { count: "exact", head: true })
            .eq("post_id", post.id);

          let userVote: 'up' | 'down' | null = null;
          if (user) {
            const { data: userVoteData } = await supabase
              .from("post_votes")
              .select("vote_type")
              .eq("post_id", post.id)
              .eq("user_id", user.id)
              .maybeSingle();
            userVote = userVoteData?.vote_type as 'up' | 'down' | null;
          }

          const upvotes = votes?.filter(v => v.vote_type === 'up').length || 0;
          const downvotes = votes?.filter(v => v.vote_type === 'down').length || 0;

          return {
            ...post,
            author: post.author as { username: string | null } | undefined,
            school: post.school as { name: string } | undefined,
            votes: upvotes - downvotes,
            userVote,
            commentCount: commentCount || 0,
          };
        })
      );

      setPosts(postsWithVotes);
    }

    setLoading(false);
  };

  const createPost = async (content: string, imageUrls: string[] = []) => {
    if (!user) return { error: "Not authenticated" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, school_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile) return { error: "Profile not found" };

    const { error } = await supabase.from("posts").insert({
      author_id: profile.id,
      school_id: profile.school_id,
      content,
      image_urls: imageUrls,
    });

    if (!error) {
      fetchPosts();
    }

    return { error: error?.message };
  };

  const vote = async (postId: string, voteType: 'up' | 'down') => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.userVote === voteType) {
      await supabase
        .from("post_votes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("post_votes")
        .upsert({
          post_id: postId,
          user_id: user.id,
          vote_type: voteType,
        }, { onConflict: 'post_id,user_id' });
    }

    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, [user, schoolId]);

  return { posts, loading, createPost, vote, refetch: fetchPosts };
};
