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
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  LogIn,
  Home
} from "lucide-react";

const Feed = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"hot" | "new" | "trending">("hot");

  const posts = [
    {
      id: 1,
      title: "Who else is stressed about finals? Drop your study tips below 📚",
      content: "I've been pulling all-nighters but nothing seems to stick. What's everyone's secret?",
      author: "StudyGrind247",
      school: "Stanford University",
      votes: 234,
      comments: 89,
      tag: "Study Tips",
      time: "2h ago",
      isHot: true,
    },
    {
      id: 2,
      title: "Our team just won the inter-school debate championship! 🏆",
      content: "So proud of everyone who participated. Next stop: nationals!",
      author: "DebateKing",
      school: "Harvard University",
      votes: 567,
      comments: 123,
      tag: "Achievement",
      time: "4h ago",
      isHot: true,
    },
    {
      id: 3,
      title: "Honest review: The new campus coffee shop",
      content: "Finally tried it out. Here's what I think about the prices, quality, and vibe...",
      author: "CaffeineAddict",
      school: "MIT",
      votes: 145,
      comments: 56,
      tag: "Campus Life",
      time: "6h ago",
      isHot: false,
    },
    {
      id: 4,
      title: "Anyone want to start a coding club? 💻",
      content: "Looking for people interested in hackathons, competitive programming, or just learning together.",
      author: "CodeNewbie",
      school: "UCLA",
      votes: 89,
      comments: 34,
      tag: "Clubs",
      time: "8h ago",
      isHot: false,
    },
    {
      id: 5,
      title: "The cafeteria mystery meat strikes again",
      content: "Day 47 of trying to figure out what they actually serve. Any guesses?",
      author: "FoodDetective",
      school: "Yale University",
      votes: 432,
      comments: 201,
      tag: "Memes",
      time: "1d ago",
      isHot: true,
    },
  ];

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
            <div className="space-y-4">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
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
                          className="hover:text-primary disabled:opacity-50"
                          disabled={isGuest && !user}
                          title={isGuest ? "Sign in to vote" : "Upvote"}
                        >
                          ▲
                        </button>
                        <span className="text-sm font-bold">{post.votes}</span>
                        <button 
                          className="hover:text-destructive disabled:opacity-50"
                          disabled={isGuest && !user}
                          title={isGuest ? "Sign in to vote" : "Downvote"}
                        >
                          ▼
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/20 text-primary">
                            {post.tag}
                          </span>
                          {post.isHot && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-orange-500/20 text-orange-500">
                              <Flame className="w-3 h-3" /> Hot
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {post.school}
                          </span>
                        </div>

                        <h2 className="font-display font-semibold text-lg mb-2 cursor-pointer hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {post.content}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>by {post.author}</span>
                          <span>•</span>
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments} Comments
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
                </motion.article>
              ))}
            </div>
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
