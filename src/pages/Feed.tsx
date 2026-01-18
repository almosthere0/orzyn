import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  Search, 
  Flame, 
  Clock, 
  TrendingUp,
  LogIn,
  Home
} from "lucide-react";
import { PostCard } from "@/components/posts/PostCard";
import { CreatePostForm } from "@/components/posts/CreatePostForm";
import { usePosts } from "@/hooks/usePosts";

const Feed = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"hot" | "new" | "trending">("hot");
  const { posts, loading, vote, createPost } = usePosts();

  const sortedPosts = [...posts].sort((a, b) => {
    if (activeTab === "hot") {
      return b.votes - a.votes;
    } else if (activeTab === "new") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      // Trending: combination of votes and recency
      const aScore = a.votes / (Date.now() - new Date(a.created_at).getTime());
      const bScore = b.votes / (Date.now() - new Date(b.created_at).getTime());
      return bScore - aScore;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">CampusConnect</span>
          </Link>

          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts, schools, communities..."
                className="pl-10 bg-muted border-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            ) : isGuest ? (
              <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            ) : (
              <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Guest Banner */}
      {isGuest && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border-b border-primary/20"
        >
          <div className="container py-3 flex items-center justify-between">
            <p className="text-sm">
              👋 You're browsing as a guest.{" "}
              <button
                onClick={() => navigate("/auth")}
                className="text-primary font-medium hover:underline"
              >
                Create an account
              </button>{" "}
              to post, vote, and join communities!
            </p>
          </div>
        </motion.div>
      )}

      <main className="container py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Create Post */}
            <CreatePostForm onSubmit={createPost} />

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6">
              {[
                { id: "hot" as const, icon: Flame, label: "Hot" },
                { id: "new" as const, icon: Clock, label: "New" },
                { id: "trending" as const, icon: TrendingUp, label: "Trending" },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="gap-2"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Posts */}
            {loading ? (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <div className="animate-pulse text-primary">Loading posts...</div>
              </div>
            ) : sortedPosts.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <Flame className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground text-sm">
                  Be the first to share something with the community!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} onVote={vote} index={index} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Communities */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <h3 className="font-display font-semibold mb-4">Popular Communities</h3>
              <div className="space-y-3">
                {[
                  { name: "SAT Prep", members: "12.5K" },
                  { name: "Study Memes", members: "45.2K" },
                  { name: "College Apps", members: "8.9K" },
                  { name: "STEM Nerds", members: "23.1K" },
                  { name: "Campus Life", members: "67.3K" },
                ].map((community) => (
                  <div
                    key={community.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  >
                    <span className="font-medium text-sm">{community.name}</span>
                    <span className="text-xs text-muted-foreground">{community.members}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                Browse All
              </Button>
            </motion.div>

            {/* Trending Schools */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <h3 className="font-display font-semibold mb-4">Trending Schools</h3>
              <div className="space-y-3">
                {[
                  { name: "Stanford", posts: 234 },
                  { name: "MIT", posts: 189 },
                  { name: "Harvard", posts: 156 },
                  { name: "UCLA", posts: 145 },
                ].map((school, index) => (
                  <div
                    key={school.name}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  >
                    <span className="text-lg font-bold text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <div className="flex-1">
                      <span className="font-medium text-sm">{school.name}</span>
                      <p className="text-xs text-muted-foreground">{school.posts} posts today</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Feed;
