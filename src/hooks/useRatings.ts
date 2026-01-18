import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Teacher {
  id: string;
  school_id: string;
  name: string;
  subject: string | null;
  averageRating: number;
  totalRatings: number;
  userRating?: number;
}

export interface Rating {
  id: string;
  target_type: string;
  target_id: string;
  score: number;
  comment: string | null;
  created_at: string;
}

export const useRatings = (schoolId?: string) => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    setLoading(true);

    let query = supabase.from("teachers").select("*");
    if (schoolId) {
      query = query.eq("school_id", schoolId);
    }

    const { data: teachersData } = await query;

    if (teachersData) {
      const teachersWithRatings = await Promise.all(
        teachersData.map(async (teacher) => {
          const { data: ratings } = await supabase
            .from("ratings")
            .select("score")
            .eq("target_type", "teacher")
            .eq("target_id", teacher.id);

          let userRating: number | undefined;
          if (user) {
            const { data: userRatingData } = await supabase
              .from("ratings")
              .select("score")
              .eq("target_type", "teacher")
              .eq("target_id", teacher.id)
              .eq("rater_id", user.id)
              .maybeSingle();
            userRating = userRatingData?.score;
          }

          const totalRatings = ratings?.length || 0;
          const averageRating = totalRatings > 0
            ? ratings!.reduce((sum, r) => sum + r.score, 0) / totalRatings
            : 0;

          return {
            ...teacher,
            averageRating,
            totalRatings,
            userRating,
          };
        })
      );

      setTeachers(teachersWithRatings);
    }

    setLoading(false);
  };

  const rateTeacher = async (teacherId: string, score: number, comment?: string) => {
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase.from("ratings").upsert({
      target_type: "teacher",
      target_id: teacherId,
      rater_id: user.id,
      score,
      comment,
    }, { onConflict: 'target_type,target_id,rater_id' });

    if (!error) {
      fetchTeachers();
    }

    return { error: error?.message };
  };

  useEffect(() => {
    fetchTeachers();
  }, [user, schoolId]);

  return { teachers, loading, rateTeacher, refetch: fetchTeachers };
};
