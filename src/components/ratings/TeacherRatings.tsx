import { useState } from "react";
import { motion } from "framer-motion";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRatings } from "@/hooks/useRatings";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface TeacherRatingsProps {
  schoolId?: string;
}

export const TeacherRatings = ({ schoolId }: TeacherRatingsProps) => {
  const { user, isGuest } = useAuth();
  const { teachers, loading, rateTeacher } = useRatings(schoolId);
  const [ratingTeacher, setRatingTeacher] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);

  const canRate = !!user && !isGuest;

  const handleRate = async (teacherId: string, score: number) => {
    if (!canRate) return;
    
    const { error } = await rateTeacher(teacherId, score);
    if (error) {
      toast.error("Failed to submit rating");
    } else {
      toast.success("Rating submitted!");
      setRatingTeacher(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading teachers...
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No teachers found for your school.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teachers.map((teacher, index) => (
        <motion.div
          key={teacher.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold">{teacher.name}</h3>
              <p className="text-sm text-muted-foreground">{teacher.subject || "General"}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= teacher.averageRating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {teacher.averageRating.toFixed(1)} ({teacher.totalRatings} reviews)
                </span>
              </div>

              {canRate && (
                <div className="mt-3">
                  {ratingTeacher === teacher.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Your rating:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => handleRate(teacher.id, star)}
                            className="p-0.5"
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                star <= (hoverRating || teacher.userRating || 0)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRatingTeacher(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRatingTeacher(teacher.id)}
                    >
                      {teacher.userRating ? "Update Rating" : "Rate Teacher"}
                    </Button>
                  )}
                </div>
              )}

              {teacher.userRating && ratingTeacher !== teacher.id && (
                <p className="text-xs text-muted-foreground mt-2">
                  You rated: {teacher.userRating}/5 ⭐
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
