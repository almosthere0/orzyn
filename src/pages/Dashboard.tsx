import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Trophy, 
  Flame, 
  Users, 
  LogOut, 
  Settings, 
  Sparkles,
  ChevronRight,
  Star,
  TrendingUp
} from "lucide-react";

interface Profile {
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
        .select("username, school_id, grade_level, reputation_points")
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

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Class Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <MessageSquare className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display font-semibold">My Class Chat</h2>
                  <p className="text-sm text-muted-foreground">{profile?.grade_level || "Your Class"}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Open <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="p-4 space-y-3">
              {[
                { user: "Alex M.", message: "Anyone got the notes from today?", time: "2m ago" },
                { user: "Sarah K.", message: "Yeah I'll share them in a sec", time: "1m ago" },
                { user: "Jordan T.", message: "Thanks! Also did you guys see the challenge announcement?", time: "Just now" },
              ].map((msg, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                    {msg.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{msg.user}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* School Challenges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl border border-border shadow-card overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-accent">
                <Trophy className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h2 className="font-display font-semibold">School Challenges</h2>
                <p className="text-sm text-muted-foreground">Active now</p>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">🏫 Your School</span>
                  <span className="text-lg font-bold text-primary">2,450</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-3">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">🎯 Rival School</span>
                  <span className="text-lg font-bold text-accent">1,890</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-3">
                  <div className="bg-accent h-2 rounded-full" style={{ width: "50%" }} />
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View All Challenges
              </Button>
            </div>
          </motion.div>

          {/* Hot Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-3 bg-card rounded-xl border border-border shadow-card overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="font-display font-semibold">Hot Posts</h2>
                  <p className="text-sm text-muted-foreground">Trending in your school</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/feed")}>
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="divide-y divide-border">
              {[
                { title: "Final exam study group forming!", votes: 42, comments: 18, tag: "Study" },
                { title: "Basketball team made it to finals! 🏀", votes: 156, comments: 34, tag: "Sports" },
                { title: "New cafeteria menu review", votes: 23, comments: 45, tag: "Campus Life" },
              ].map((post, index) => (
                <div key={index} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <button className="hover:text-primary">▲</button>
                      <span className="text-sm font-medium">{post.votes}</span>
                      <button className="hover:text-destructive">▼</button>
                    </div>
                    <div className="flex-1">
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-primary/20 text-primary mb-2">
                        {post.tag}
                      </span>
                      <h3 className="font-medium mb-1">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">{post.comments} comments</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
