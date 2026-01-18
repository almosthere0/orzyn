import { motion } from "framer-motion";
import { Trophy, Target, Swords } from "lucide-react";
import { useChallenges } from "@/hooks/useChallenges";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";

interface ChallengeBoardProps {
  schoolId?: string;
}

export const ChallengeBoard = ({ schoolId }: ChallengeBoardProps) => {
  const { challenges, schoolChallenges, rivalries, loading } = useChallenges(schoolId);

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading challenges...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rivalries */}
      {rivalries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/20">
              <Swords className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="font-display font-semibold">School Rivalries</h2>
          </div>
          <div className="p-4 space-y-4">
            {rivalries.map((rivalry) => {
              const total = rivalry.school_a_points + rivalry.school_b_points || 1;
              const aPercent = (rivalry.school_a_points / total) * 100;
              
              return (
                <div key={rivalry.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏫</span>
                      <div>
                        <p className="font-medium">{rivalry.school_a?.name}</p>
                        <p className="text-lg font-bold text-primary">{rivalry.school_a_points} pts</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-muted-foreground">VS</div>
                    <div className="flex items-center gap-2 text-right">
                      <div>
                        <p className="font-medium">{rivalry.school_b?.name}</p>
                        <p className="text-lg font-bold text-accent">{rivalry.school_b_points} pts</p>
                      </div>
                      <span className="text-2xl">🎯</span>
                    </div>
                  </div>
                  <div className="relative h-4 bg-accent/30 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
                      style={{ width: `${aPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Active Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-accent">
            <Trophy className="w-5 h-5 text-accent-foreground" />
          </div>
          <h2 className="font-display font-semibold">Active Challenges</h2>
        </div>
        <div className="divide-y divide-border">
          {challenges.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No active challenges at the moment.
            </div>
          ) : (
            challenges.map((challenge) => {
              const schoolChallenge = schoolChallenges.find(
                (sc) => sc.challenge_id === challenge.id
              );
              const progress = schoolChallenge
                ? (schoolChallenge.current_points / challenge.max_points) * 100
                : 0;

              return (
                <div key={challenge.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {challenge.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-primary font-medium">
                          {schoolChallenge?.current_points || 0} / {challenge.max_points} pts
                        </span>
                        {challenge.end_date && (
                          <span className="text-muted-foreground">
                            Ends {formatDistanceToNow(new Date(challenge.end_date), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      <Progress value={progress} className="mt-2 h-2" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/20">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <h2 className="font-display font-semibold">School Leaderboard</h2>
        </div>
        <div className="divide-y divide-border">
          {schoolChallenges
            .reduce((acc, sc) => {
              const existing = acc.find((s) => s.school_id === sc.school_id);
              if (existing) {
                existing.total_points += sc.current_points;
              } else {
                acc.push({
                  school_id: sc.school_id,
                  school_name: sc.school?.name || "Unknown School",
                  total_points: sc.current_points,
                });
              }
              return acc;
            }, [] as { school_id: string; school_name: string; total_points: number }[])
            .sort((a, b) => b.total_points - a.total_points)
            .slice(0, 10)
            .map((school, index) => (
              <div key={school.school_id} className="p-4 flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0
                      ? "bg-yellow-500 text-yellow-950"
                      : index === 1
                      ? "bg-gray-300 text-gray-700"
                      : index === 2
                      ? "bg-amber-600 text-amber-50"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{school.school_name}</p>
                </div>
                <div className="text-lg font-bold text-primary">
                  {school.total_points} pts
                </div>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  );
};
