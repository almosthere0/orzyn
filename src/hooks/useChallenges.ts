import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  max_points: number;
  start_date: string;
  end_date: string | null;
}

export interface SchoolChallenge {
  id: string;
  school_id: string;
  challenge_id: string;
  current_points: number;
  school?: {
    name: string;
  };
  challenge?: Challenge;
}

export interface Rivalry {
  id: string;
  school_a_id: string;
  school_b_id: string;
  school_a?: {
    name: string;
  };
  school_b?: {
    name: string;
  };
  school_a_points: number;
  school_b_points: number;
}

export const useChallenges = (schoolId?: string) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [schoolChallenges, setSchoolChallenges] = useState<SchoolChallenge[]>([]);
  const [rivalries, setRivalries] = useState<Rivalry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChallenges = async () => {
    setLoading(true);

    const { data: challengesData } = await supabase
      .from("challenges")
      .select("*")
      .order("created_at", { ascending: false });

    if (challengesData) {
      setChallenges(challengesData);
    }

    let scQuery = supabase
      .from("school_challenges")
      .select(`
        id,
        school_id,
        challenge_id,
        current_points,
        school:schools(name),
        challenge:challenges(*)
      `);

    if (schoolId) {
      scQuery = scQuery.eq("school_id", schoolId);
    }

    const { data: scData } = await scQuery;

    if (scData) {
      setSchoolChallenges(scData.map(sc => ({
        ...sc,
        school: sc.school as { name: string } | undefined,
        challenge: sc.challenge as Challenge | undefined,
      })));
    }

    // Fetch rivalries
    let rivQuery = supabase
      .from("rivalries")
      .select(`
        id,
        school_a_id,
        school_b_id,
        school_a:schools!rivalries_school_a_id_fkey(name),
        school_b:schools!rivalries_school_b_id_fkey(name)
      `);

    if (schoolId) {
      rivQuery = rivQuery.or(`school_a_id.eq.${schoolId},school_b_id.eq.${schoolId}`);
    }

    const { data: rivData } = await rivQuery;

    if (rivData) {
      const rivalriesWithPoints = await Promise.all(
        rivData.map(async (riv) => {
          const { data: aPoints } = await supabase
            .from("school_challenges")
            .select("current_points")
            .eq("school_id", riv.school_a_id);

          const { data: bPoints } = await supabase
            .from("school_challenges")
            .select("current_points")
            .eq("school_id", riv.school_b_id);

          return {
            ...riv,
            school_a: riv.school_a as { name: string } | undefined,
            school_b: riv.school_b as { name: string } | undefined,
            school_a_points: aPoints?.reduce((sum, p) => sum + p.current_points, 0) || 0,
            school_b_points: bPoints?.reduce((sum, p) => sum + p.current_points, 0) || 0,
          };
        })
      );

      setRivalries(rivalriesWithPoints);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchChallenges();
  }, [schoolId]);

  return { challenges, schoolChallenges, rivalries, loading, refetch: fetchChallenges };
};
