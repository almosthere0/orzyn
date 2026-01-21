import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { GroupChatPanel } from "@/components/chat/GroupChatPanel";
import { MessageSquare } from "lucide-react";

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  school_id: string | null;
  grade_level: string | null;
  reputation_points: number | null;
}

interface School {
  name: string;
}

const Chats = () => {
  const { user, loading, isGuest } = useAuth();
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
        .select("id, username, avatar_url, school_id, grade_level, reputation_points")
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (isGuest) {
    return (
      <AppLayout profile={null}>
        <div className="max-w-2xl mx-auto text-center py-20">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold mb-2">Sign In to Chat</h1>
          <p className="text-muted-foreground mb-6">
            Create an account to join group chats with your classmates
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      profile={profile ? { ...profile, school_name: school?.name } : null}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-display font-bold mb-2">Group Chats</h1>
          <p className="text-muted-foreground">
            Real-time messaging with your classmates
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GroupChatPanel />
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Chats;
