import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Notification {
  id: string;
  profile_id: string;
  type: string;
  title: string;
  body: string | null;
  link_url: string | null;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
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

  const fetchNotifications = async () => {
    if (!userProfileId) return;

    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("profile_id", userProfileId)
      .order("created_at", { ascending: false })
      .limit(50);

    const notifs = data || [];
    setNotifications(notifs);
    setUnreadCount(notifs.filter(n => !n.is_read).length);
    setLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (!error) {
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    return { error: error?.message };
  };

  const markAllAsRead = async () => {
    if (!userProfileId) return { error: "Not authenticated" };

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("profile_id", userProfileId)
      .eq("is_read", false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }

    return { error: error?.message };
  };

  useEffect(() => {
    if (userProfileId) {
      fetchNotifications();

      // Subscribe to realtime notifications
      const channel = supabase
        .channel("notifications")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `profile_id=eq.${userProfileId}`,
          },
          (payload) => {
            const newNotif = payload.new as Notification;
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userProfileId]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};
