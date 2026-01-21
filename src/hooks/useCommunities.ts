import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  banner_url: string | null;
  is_global: boolean;
  member_count: number;
  post_count: number;
  created_at: string;
  isMember: boolean;
}

export const useCommunities = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileId = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) setUserProfileId(data.id);
    };
    fetchProfileId();
  }, [user]);

  const fetchCommunities = async () => {
    setLoading(true);

    const { data: communitiesData } = await supabase
      .from("communities")
      .select("*")
      .eq("is_global", true)
      .order("member_count", { ascending: false });

    if (communitiesData && userProfileId) {
      const { data: memberships } = await supabase
        .from("community_members")
        .select("community_id")
        .eq("profile_id", userProfileId);

      const memberCommunityIds = new Set(memberships?.map(m => m.community_id) || []);

      setCommunities(
        communitiesData.map(c => ({
          ...c,
          isMember: memberCommunityIds.has(c.id),
        }))
      );
    } else if (communitiesData) {
      setCommunities(communitiesData.map(c => ({ ...c, isMember: false })));
    }

    setLoading(false);
  };

  const joinCommunity = async (communityId: string) => {
    if (!userProfileId) return { error: "Not authenticated" };

    const { error } = await supabase.from("community_members").insert({
      community_id: communityId,
      profile_id: userProfileId,
    });

    if (!error) {
      await supabase
        .from("communities")
        .update({ member_count: communities.find(c => c.id === communityId)!.member_count + 1 })
        .eq("id", communityId);
      fetchCommunities();
    }

    return { error: error?.message };
  };

  const leaveCommunity = async (communityId: string) => {
    if (!userProfileId) return { error: "Not authenticated" };

    const { error } = await supabase
      .from("community_members")
      .delete()
      .eq("community_id", communityId)
      .eq("profile_id", userProfileId);

    if (!error) {
      await supabase
        .from("communities")
        .update({ member_count: Math.max(0, communities.find(c => c.id === communityId)!.member_count - 1) })
        .eq("id", communityId);
      fetchCommunities();
    }

    return { error: error?.message };
  };

  useEffect(() => {
    if (userProfileId !== null) {
      fetchCommunities();
    }
  }, [userProfileId]);

  return { communities, loading, joinCommunity, leaveCommunity, refetch: fetchCommunities };
};
