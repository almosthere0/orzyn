import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Group {
  id: string;
  name: string;
  type: string;
  description: string | null;
  subject_code: string | null;
  grade_level: string | null;
  member_count: number;
  leader_id: string | null;
  is_private: boolean;
  created_at: string;
  isMember: boolean;
  school?: {
    name: string;
  };
}

export const useGroups = (schoolId?: string) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
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

  const fetchGroups = async () => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data: groupsData } = await supabase
      .from("groups")
      .select(`
        *,
        school:schools(name)
      `)
      .eq("school_id", schoolId)
      .order("type", { ascending: true });

    if (groupsData && userProfileId) {
      const { data: memberships } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("profile_id", userProfileId);

      const memberGroupIds = new Set(memberships?.map(m => m.group_id) || []);

      setGroups(
        groupsData.map(g => ({
          ...g,
          school: g.school as { name: string } | undefined,
          isMember: memberGroupIds.has(g.id),
        }))
      );
    } else if (groupsData) {
      setGroups(groupsData.map(g => ({ 
        ...g, 
        school: g.school as { name: string } | undefined,
        isMember: false 
      })));
    }

    setLoading(false);
  };

  const joinGroup = async (groupId: string) => {
    if (!userProfileId) return { error: "Not authenticated" };

    const { error } = await supabase.from("group_members").insert({
      group_id: groupId,
      profile_id: userProfileId,
    });

    if (!error) {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        await supabase
          .from("groups")
          .update({ member_count: group.member_count + 1 })
          .eq("id", groupId);
      }
      fetchGroups();
    }

    return { error: error?.message };
  };

  const leaveGroup = async (groupId: string) => {
    if (!userProfileId) return { error: "Not authenticated" };

    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("profile_id", userProfileId);

    if (!error) {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        await supabase
          .from("groups")
          .update({ member_count: Math.max(0, group.member_count - 1) })
          .eq("id", groupId);
      }
      fetchGroups();
    }

    return { error: error?.message };
  };

  const createGroup = async (data: {
    name: string;
    type: string;
    description?: string;
    subject_code?: string;
    grade_level?: string;
  }) => {
    if (!userProfileId || !schoolId) return { error: "Not authenticated or no school" };

    const { error } = await supabase.from("groups").insert({
      ...data,
      school_id: schoolId,
    });

    if (!error) {
      fetchGroups();
    }

    return { error: error?.message };
  };

  useEffect(() => {
    if (userProfileId !== null && schoolId) {
      fetchGroups();
    }
  }, [userProfileId, schoolId]);

  return { groups, loading, joinGroup, leaveGroup, createGroup, refetch: fetchGroups };
};
