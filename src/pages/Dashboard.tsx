import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Trophy, 
  Flame, 
  Users, 
  LogOut, 
  Settings, 
  Sparkles,
  Star,
  TrendingUp,
  GraduationCap
} from "lucide-react";
import { GroupChatPanel } from "@/components/chat/GroupChatPanel";
import { ChallengeBoard } from "@/components/challenges/ChallengeBoard";
import { TeacherRatings } from "@/components/ratings/TeacherRatings";
import { PostCard } from "@/components/posts/PostCard";
import { CreatePostForm } from "@/components/posts/CreatePostForm";
import { usePosts } from "@/hooks/usePosts";

interface Profile {
  id: string;
  username: string | null;
  school_id: string | null;
  grade_level: string | null;
  reputation_points: number | null;
}

interface School {
  name: string;
}

const Dashboard = () => {
  const { user, signOut, loading, isGuest } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const { posts, vote, createPost } = usePosts(profile?.school_id || undefined);

  useEffect(() => {
    if (!loading && !user && !isGuest) {
      navigate("/auth");
    }
  }, [user, loading, isGuest, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, school_id, grade_level, reputation_points")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);

        if (profileData.school_id) {
          const { data: schoolData } = await supabase
            .from("schools")
            .select("name")
            .eq("id", profileData.school_id)
            .maybeSingle();

          setSchool(schoolData);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="text-center py-20">
            <h1 className="text-3xl font-display font-bold mb-4">Guest Mode</h1>
            <p className="text-muted-foreground mb-8">
              Sign up to access your personalized dashboard
            </p>
            <Button variant="hero" onClick={() => navigate("/auth")}>
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            Welcome back, {profile?.username || "Student"}! 👋
          </h1>
          <p className="text-muted-foreground">
            {school?.name || "Your School"} • {profile?.grade_level || "Student"}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: Star, label: "Reputation", value: profile?.reputation_points || 0, color: "text-yellow-500" },
            { icon: Trophy, label: "Rank", value: "#42", color: "text-primary" },
            { icon: TrendingUp, label: "Weekly XP", value: "+150", color: "text-green-500" },
            { icon: Users, label: "Connections", value: "23", color: "text-accent" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="bg-card rounded-xl p-4 border border-border shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="feed" className="gap-2">
              <Flame className="w-4 h-4" />
              <span className="hidden sm:inline">Feed</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="ratings" className="gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Ratings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            <CreatePostForm onSubmit={createPost} />
            {posts.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <Flame className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground text-sm">
                  Be the first to post something in your school!
                </p>
              </div>
            ) : (
              posts.slice(0, 5).map((post, index) => (
                <PostCard key={post.id} post={post} onVote={vote} index={index} />
              ))
            )}
            {posts.length > 5 && (
              <Button variant="outline" className="w-full" onClick={() => navigate("/feed")}>
                View All Posts
              </Button>
            )}
          </TabsContent>

          <TabsContent value="chat">
            <GroupChatPanel />
          </TabsContent>

          <TabsContent value="challenges">
            <ChallengeBoard schoolId={profile?.school_id || undefined} />
          </TabsContent>

          <TabsContent value="ratings">
            <TeacherRatings schoolId={profile?.school_id || undefined} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
