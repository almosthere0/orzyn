import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunitiesList } from "@/components/communities/CommunitiesList";
import { GroupsList } from "@/components/groups/GroupsList";
import { Input } from "@/components/ui/input";
import { Globe, Users, School, Search } from "lucide-react";

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

const Explore = () => {
  const { user, loading, isGuest } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <AppLayout
      profile={profile ? { ...profile, school_name: school?.name } : null}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-display font-bold mb-2">Explore</h1>
          <p className="text-muted-foreground">
            Discover communities, groups, and connect with students
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search communities, groups, schools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="communities" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
              <TabsTrigger value="communities" className="gap-2">
                <Globe className="w-4 h-4" />
                Communities
              </TabsTrigger>
              <TabsTrigger value="groups" className="gap-2">
                <Users className="w-4 h-4" />
                School Groups
              </TabsTrigger>
            </TabsList>

            <TabsContent value="communities">
              <CommunitiesList />
            </TabsContent>

            <TabsContent value="groups">
              <GroupsList schoolId={profile?.school_id || undefined} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Explore;
