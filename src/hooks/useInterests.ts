import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const AVAILABLE_INTERESTS = [
  "Gaming",
  "Anime",
  "Music",
  "Sports",
  "Programming",
  "Art",
  "Photography",
  "Reading",
  "Writing",
  "Science",
  "Math",
  "Languages",
  "Film",
  "Fashion",
  "Cooking",
  "Travel",
  "Fitness",
  "Dance",
  "Theater",
  "Debate",
];

export const useInterests = () => {
  const { user } = useAuth();
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) setUserProfileId(data.id);
    };
    fetchProfile();
  }, [user]);

  const fetchInterests = async () => {
    if (!userProfileId) return;

    setLoading(true);
    const { data } = await supabase
      .from("user_interests")
      .select("interest_tag")
      .eq("profile_id", userProfileId);

    setInterests(data?.map(i => i.interest_tag) || []);
    setLoading(false);
  };

  const addInterest = async (interest: string) => {
    if (!userProfileId) return { error: "Not authenticated" };

    const { error } = await supabase.from("user_interests").insert({
      profile_id: userProfileId,
      interest_tag: interest,
    });

    if (!error) {
      setInterests(prev => [...prev, interest]);
    }

    return { error: error?.message };
  };

  const removeInterest = async (interest: string) => {
    if (!userProfileId) return { error: "Not authenticated" };

    const { error } = await supabase
      .from("user_interests")
      .delete()
      .eq("profile_id", userProfileId)
      .eq("interest_tag", interest);

    if (!error) {
      setInterests(prev => prev.filter(i => i !== interest));
    }

    return { error: error?.message };
  };

  const toggleInterest = async (interest: string) => {
    if (interests.includes(interest)) {
      return removeInterest(interest);
    } else {
      return addInterest(interest);
    }
  };

  useEffect(() => {
    if (userProfileId) {
      fetchInterests();
    }
  }, [userProfileId]);

  return {
    interests,
    loading,
    addInterest,
    removeInterest,
    toggleInterest,
    availableInterests: AVAILABLE_INTERESTS,
    refetch: fetchInterests,
  };
};
