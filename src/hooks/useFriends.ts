import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  sender?: {
    username: string | null;
    avatar_url: string | null;
    school_id: string | null;
  };
  receiver?: {
    username: string | null;
    avatar_url: string | null;
    school_id: string | null;
  };
}

export interface Friend {
  id: string;
  username: string | null;
  avatar_url: string | null;
  school_id: string | null;
  grade_level: string | null;
  reputation_points: number | null;
}

export interface DiscoverableUser {
  id: string;
  username: string | null;
  avatar_url: string | null;
  school_id: string | null;
  grade_level: string | null;
  reputation_points: number | null;
  school?: { name: string };
  sharedInterests: string[];
  isFriend: boolean;
  hasPendingRequest: boolean;
}

export const useFriends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [discoverableUsers, setDiscoverableUsers] = useState<DiscoverableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);
  const [userSchoolId, setUserSchoolId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("id, school_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setUserProfileId(data.id);
        setUserSchoolId(data.school_id);
      }
    };
    fetchProfile();
  }, [user]);

  const fetchFriends = async () => {
    if (!userProfileId) return;

    const { data: friendships1 } = await supabase
      .from("friendships")
      .select(`
        profile_id_2,
        friend:profiles!friendships_profile_id_2_fkey(id, username, avatar_url, school_id, grade_level, reputation_points)
      `)
      .eq("profile_id_1", userProfileId);

    const { data: friendships2 } = await supabase
      .from("friendships")
      .select(`
        profile_id_1,
        friend:profiles!friendships_profile_id_1_fkey(id, username, avatar_url, school_id, grade_level, reputation_points)
      `)
      .eq("profile_id_2", userProfileId);

    const allFriends: Friend[] = [];
    
    friendships1?.forEach(f => {
      if (f.friend) {
        const friend = f.friend as unknown as Friend;
        allFriends.push(friend);
      }
    });
    
    friendships2?.forEach(f => {
      if (f.friend) {
        const friend = f.friend as unknown as Friend;
        allFriends.push(friend);
      }
    });

    setFriends(allFriends);
  };

  const fetchRequests = async () => {
    if (!userProfileId) return;

    const { data: pending } = await supabase
      .from("friend_requests")
      .select(`
        *,
        sender:profiles!friend_requests_sender_id_fkey(username, avatar_url, school_id)
      `)
      .eq("receiver_id", userProfileId)
      .eq("status", "pending");

    const { data: sent } = await supabase
      .from("friend_requests")
      .select(`
        *,
        receiver:profiles!friend_requests_receiver_id_fkey(username, avatar_url, school_id)
      `)
      .eq("sender_id", userProfileId)
      .eq("status", "pending");

    setPendingRequests((pending || []).map(p => ({
      ...p,
      sender: p.sender as FriendRequest['sender'],
    })));
    setSentRequests((sent || []).map(s => ({
      ...s,
      receiver: s.receiver as FriendRequest['receiver'],
    })));
  };

  const fetchDiscoverableUsers = async () => {
    if (!userProfileId || !userSchoolId) return;

    // Get users from same school
    const { data: schoolmates } = await supabase
      .from("profiles")
      .select(`
        id, username, avatar_url, school_id, grade_level, reputation_points,
        school:schools(name)
      `)
      .eq("school_id", userSchoolId)
      .neq("id", userProfileId)
      .limit(50);

    // Get user's interests
    const { data: myInterests } = await supabase
      .from("user_interests")
      .select("interest_tag")
      .eq("profile_id", userProfileId);

    const myInterestTags = new Set(myInterests?.map(i => i.interest_tag) || []);

    // Get friend IDs
    const friendIds = new Set(friends.map(f => f.id));
    const pendingIds = new Set([
      ...pendingRequests.map(r => r.sender_id),
      ...sentRequests.map(r => r.receiver_id),
    ]);

    // Calculate shared interests for each user
    const usersWithInterests = await Promise.all(
      (schoolmates || []).map(async (user) => {
        const { data: userInterests } = await supabase
          .from("user_interests")
          .select("interest_tag")
          .eq("profile_id", user.id);

        const sharedInterests = (userInterests || [])
          .filter(i => myInterestTags.has(i.interest_tag))
          .map(i => i.interest_tag);

        return {
          ...user,
          school: user.school as { name: string } | undefined,
          sharedInterests,
          isFriend: friendIds.has(user.id),
          hasPendingRequest: pendingIds.has(user.id),
        };
      })
    );

    // Sort by shared interests, then reputation
    usersWithInterests.sort((a, b) => {
      if (b.sharedInterests.length !== a.sharedInterests.length) {
        return b.sharedInterests.length - a.sharedInterests.length;
      }
      return (b.reputation_points || 0) - (a.reputation_points || 0);
    });

    setDiscoverableUsers(usersWithInterests.filter(u => !u.isFriend));
  };

  const sendFriendRequest = async (receiverId: string) => {
    if (!userProfileId) return { error: "Not authenticated" };

    const { error } = await supabase.from("friend_requests").insert({
      sender_id: userProfileId,
      receiver_id: receiverId,
    });

    if (!error) {
      fetchRequests();
      fetchDiscoverableUsers();
    }

    return { error: error?.message };
  };

  const acceptRequest = async (requestId: string) => {
    if (!userProfileId) return { error: "Not authenticated" };

    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return { error: "Request not found" };

    // Update request status
    const { error: updateError } = await supabase
      .from("friend_requests")
      .update({ status: "accepted" })
      .eq("id", requestId);

    if (updateError) return { error: updateError.message };

    // Create friendship (ensure ordered)
    const [id1, id2] = [request.sender_id, userProfileId].sort();
    const { error: friendshipError } = await supabase.from("friendships").insert({
      profile_id_1: id1,
      profile_id_2: id2,
    });

    if (!friendshipError) {
      fetchFriends();
      fetchRequests();
      fetchDiscoverableUsers();
    }

    return { error: friendshipError?.message };
  };

  const rejectRequest = async (requestId: string) => {
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: "rejected" })
      .eq("id", requestId);

    if (!error) {
      fetchRequests();
    }

    return { error: error?.message };
  };

  const removeFriend = async (friendId: string) => {
    if (!userProfileId) return { error: "Not authenticated" };

    const [id1, id2] = [friendId, userProfileId].sort();

    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("profile_id_1", id1)
      .eq("profile_id_2", id2);

    if (!error) {
      fetchFriends();
      fetchDiscoverableUsers();
    }

    return { error: error?.message };
  };

  useEffect(() => {
    if (userProfileId) {
      setLoading(true);
      Promise.all([fetchFriends(), fetchRequests()]).then(() => {
        setLoading(false);
      });
    }
  }, [userProfileId]);

  useEffect(() => {
    if (userProfileId && userSchoolId && friends.length >= 0) {
      fetchDiscoverableUsers();
    }
  }, [userProfileId, userSchoolId, friends, pendingRequests, sentRequests]);

  return {
    friends,
    pendingRequests,
    sentRequests,
    discoverableUsers,
    loading,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
    refetch: () => {
      fetchFriends();
      fetchRequests();
      fetchDiscoverableUsers();
    },
  };
};
