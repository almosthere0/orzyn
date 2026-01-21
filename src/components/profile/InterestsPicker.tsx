import { Badge } from "@/components/ui/badge";
import { useInterests, AVAILABLE_INTERESTS } from "@/hooks/useInterests";
import { cn } from "@/lib/utils";

export const InterestsPicker = () => {
  const { interests, toggleInterest, loading } = useInterests();

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-8 w-20 bg-muted rounded-full animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select your interests to find like-minded students
      </p>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_INTERESTS.map(interest => {
          const isSelected = interests.includes(interest);
          return (
            <Badge
              key={interest}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all hover:scale-105",
                isSelected && "gradient-primary text-primary-foreground"
              )}
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </Badge>
          );
        })}
      </div>
      {interests.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {interests.length} interest{interests.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
};
