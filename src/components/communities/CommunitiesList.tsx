import { motion } from "framer-motion";
import { Users, BookOpen, FlaskConical, Brain, Palette, Medal, Heart, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCommunities, Community } from "@/hooks/useCommunities";

const iconMap: Record<string, React.ElementType> = {
  "sat-prep": BookOpen,
  "ap-exams": GraduationCap,
  "mental-health": Heart,
  "study-tips": Brain,
  "college-apps": GraduationCap,
  "stem-nerds": FlaskConical,
  "arts-creativity": Palette,
  "sports-talk": Medal,
};

interface CommunityCardProps {
  community: Community;
  onJoin: (id: string) => Promise<{ error?: string }>;
  onLeave: (id: string) => Promise<{ error?: string }>;
}

const CommunityCard = ({ community, onJoin, onLeave }: CommunityCardProps) => {
  const Icon = iconMap[community.slug] || Users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-4 hover:shadow-card transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-semibold truncate">{community.name}</h3>
            {community.is_global && (
              <Badge variant="secondary" className="text-xs">Global</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {community.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {community.member_count.toLocaleString()} members
            </span>
            {community.isMember ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onLeave(community.id)}
              >
                Leave
              </Button>
            ) : (
              <Button
                size="sm"
                variant="default"
                onClick={() => onJoin(community.id)}
              >
                Join
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const CommunitiesList = () => {
  const { communities, loading, joinCommunity, leaveCommunity } = useCommunities();

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted" />
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-1/2 mb-2" />
                <div className="h-4 bg-muted rounded w-full mb-1" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const joinedCommunities = communities.filter(c => c.isMember);
  const discoverCommunities = communities.filter(c => !c.isMember);

  return (
    <div className="space-y-8">
      {joinedCommunities.length > 0 && (
        <div>
          <h2 className="text-lg font-display font-semibold mb-4">Your Communities</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {joinedCommunities.map(community => (
              <CommunityCard
                key={community.id}
                community={community}
                onJoin={joinCommunity}
                onLeave={leaveCommunity}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-display font-semibold mb-4">
          {joinedCommunities.length > 0 ? "Discover More" : "Global Communities"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {discoverCommunities.map(community => (
            <CommunityCard
              key={community.id}
              community={community}
              onJoin={joinCommunity}
              onLeave={leaveCommunity}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
