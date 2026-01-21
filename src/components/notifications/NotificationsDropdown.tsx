import { Bell, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

const notificationIcons: Record<string, string> = {
  mention: "💬",
  reply: "↩️",
  vote: "👍",
  challenge: "🏆",
  election: "🗳️",
  new_message: "✉️",
  friend_request: "👋",
  friend_accepted: "🤝",
};

export const NotificationsDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => markAllAsRead()}
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No notifications yet
            </div>
          ) : (
            notifications.slice(0, 10).map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className={`flex items-start gap-3 p-3 cursor-pointer ${
                  !notif.is_read ? "bg-muted/50" : ""
                }`}
                onClick={() => !notif.is_read && markAsRead(notif.id)}
              >
                <span className="text-lg">
                  {notificationIcons[notif.type] || "📌"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{notif.title}</p>
                  {notif.body && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notif.body}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                  </p>
                </div>
                {!notif.is_read && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
