import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, UserCheck, UserX, Users, Heart, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFriends, DiscoverableUser, FriendRequest, Friend } from "@/hooks/useFriends";

const UserCard = ({
  user,
  onAction,
  actionLabel,
  actionIcon: ActionIcon,
  variant = "default",
  showInterests = false,
}: {
  user: DiscoverableUser | Friend;
  onAction?: () => void;
  actionLabel?: string;
  actionIcon?: React.ElementType;
  variant?: "default" | "outline" | "destructive";
  showInterests?: boolean;
}) => {
  const discoverableUser = user as DiscoverableUser;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-4 hover:shadow-card transition-shadow"
    >
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user.avatar_url || undefined} />
          <AvatarFallback>
            {user.username?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{user.username || "Anonymous"}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {user.grade_level && <span>{user.grade_level}</span>}
            {user.reputation_points !== null && (
              <Badge variant="secondary" className="text-xs">
                ⭐ {user.reputation_points}
              </Badge>
            )}
          </div>
          {showInterests && discoverableUser.sharedInterests?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {discoverableUser.sharedInterests.slice(0, 3).map(interest => (
                <Badge key={interest} variant="outline" className="text-xs">
                  <Heart className="w-3 h-3 mr-1 text-accent" />
                  {interest}
                </Badge>
              ))}
              {discoverableUser.sharedInterests.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{discoverableUser.sharedInterests.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
        {onAction && actionLabel && (
          <Button size="sm" variant={variant} onClick={onAction}>
            {ActionIcon && <ActionIcon className="w-4 h-4 mr-1" />}
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

const RequestCard = ({
  request,
  onAccept,
  onReject,
}: {
  request: FriendRequest;
  onAccept: () => void;
  onReject: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-xl border border-border p-4"
  >
    <div className="flex items-center gap-4">
      <Avatar className="w-12 h-12">
        <AvatarImage src={request.sender?.avatar_url || undefined} />
        <AvatarFallback>
          {request.sender?.username?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">
          {request.sender?.username || "Anonymous"}
        </h3>
        <p className="text-sm text-muted-foreground">Wants to connect</p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="default" onClick={onAccept}>
          <UserCheck className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={onReject}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </motion.div>
);

export const FriendsPanel = () => {
  const {
    friends,
    pendingRequests,
    discoverableUsers,
    loading,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
  } = useFriends();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDiscoverable = discoverableUsers.filter(
    u =>
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !u.hasPendingRequest
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted" />
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Tabs defaultValue="discover" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="discover" className="gap-1">
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Discover</span>
        </TabsTrigger>
        <TabsTrigger value="friends" className="gap-1">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Friends</span>
          {friends.length > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {friends.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="requests" className="gap-1">
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Requests</span>
          {pendingRequests.length > 0 && (
            <Badge variant="destructive" className="ml-1 text-xs">
              {pendingRequests.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="discover" className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {filteredDiscoverable.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-semibold mb-2">No Students Found</h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery
                ? "Try a different search term"
                : "Add interests to your profile to find like-minded students!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDiscoverable.map(user => (
              <UserCard
                key={user.id}
                user={user}
                showInterests
                onAction={() => sendFriendRequest(user.id)}
                actionLabel="Connect"
                actionIcon={UserPlus}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="friends" className="space-y-3">
        {friends.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-semibold mb-2">No Friends Yet</h3>
            <p className="text-muted-foreground text-sm">
              Discover students from your school and connect with them!
            </p>
          </div>
        ) : (
          friends.map(friend => (
            <UserCard
              key={friend.id}
              user={friend}
              onAction={() => removeFriend(friend.id)}
              actionLabel="Remove"
              actionIcon={UserX}
              variant="outline"
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="requests" className="space-y-3">
        {pendingRequests.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-semibold mb-2">No Pending Requests</h3>
            <p className="text-muted-foreground text-sm">
              When someone wants to connect, you'll see it here
            </p>
          </div>
        ) : (
          pendingRequests.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              onAccept={() => acceptRequest(request.id)}
              onReject={() => rejectRequest(request.id)}
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};
