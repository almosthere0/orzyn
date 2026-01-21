import { motion } from "framer-motion";
import { Users, BookOpen, UserPlus, MessageSquare, GraduationCap, Beaker, Music, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGroups, Group } from "@/hooks/useGroups";

const typeIcons: Record<string, React.ElementType> = {
  CLASS: GraduationCap,
  SUBJECT: BookOpen,
  GRADE: Users,
  CLUB: Music,
  DEPARTMENT: Beaker,
};

const typeColors: Record<string, string> = {
  CLASS: "bg-blue-500/10 text-blue-600",
  SUBJECT: "bg-green-500/10 text-green-600",
  GRADE: "bg-purple-500/10 text-purple-600",
  CLUB: "bg-orange-500/10 text-orange-600",
  DEPARTMENT: "bg-red-500/10 text-red-600",
};

interface GroupCardProps {
  group: Group;
  onJoin: (id: string) => Promise<{ error?: string }>;
  onLeave: (id: string) => Promise<{ error?: string }>;
}

const GroupCard = ({ group, onJoin, onLeave }: GroupCardProps) => {
  const Icon = typeIcons[group.type] || Users;
  const colorClass = typeColors[group.type] || "bg-muted text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-4 hover:shadow-card transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{group.name}</h3>
            <Badge variant="outline" className="text-xs capitalize">
              {group.type.toLowerCase()}
            </Badge>
          </div>
          {group.description && (
            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
              {group.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {group.member_count}
              </span>
              {group.subject_code && (
                <span>{group.subject_code}</span>
              )}
            </div>
            {group.isMember ? (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="h-8 px-2">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onLeave(group.id)}
                >
                  Leave
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="default"
                onClick={() => onJoin(group.id)}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Join
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface GroupsListProps {
  schoolId?: string;
}

export const GroupsList = ({ schoolId }: GroupsListProps) => {
  const { groups, loading, joinGroup, leaveGroup } = useGroups(schoolId);

  if (!schoolId) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display font-semibold mb-2">Join a School First</h3>
        <p className="text-muted-foreground text-sm">
          Select your school to see available groups and class chats
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-muted" />
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const myGroups = groups.filter(g => g.isMember);
  const availableGroups = groups.filter(g => !g.isMember);

  if (groups.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display font-semibold mb-2">No Groups Yet</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Be the first to create a group for your school!
        </p>
        <Button>Create Group</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {myGroups.length > 0 && (
        <div>
          <h2 className="text-lg font-display font-semibold mb-3">My Groups</h2>
          <div className="space-y-3">
            {myGroups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onJoin={joinGroup}
                onLeave={leaveGroup}
              />
            ))}
          </div>
        </div>
      )}

      {availableGroups.length > 0 && (
        <div>
          <h2 className="text-lg font-display font-semibold mb-3">Available Groups</h2>
          <div className="space-y-3">
            {availableGroups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onJoin={joinGroup}
                onLeave={leaveGroup}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
