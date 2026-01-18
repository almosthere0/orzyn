import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface GroupChat {
  id: string;
  school_id: string;
  grade_level: string | null;
  name: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    username: string | null;
  };
}

export const useGroupChat = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<GroupChat[]>([]);
  const [currentChat, setCurrentChat] = useState<GroupChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from("group_chats")
      .select("*")
      .order("name");

    if (data) {
      setChats(data);
      if (data.length > 0 && !currentChat) {
        setCurrentChat(data[0]);
      }
    }

    setLoading(false);
  }, [user, currentChat]);

  const fetchMessages = useCallback(async () => {
    if (!currentChat) return;

    const { data } = await supabase
      .from("messages")
      .select(`
        id,
        chat_id,
        sender_id,
        content,
        created_at,
        sender:profiles!messages_sender_id_fkey(username)
      `)
      .eq("chat_id", currentChat.id)
      .order("created_at", { ascending: true })
      .limit(100);

    if (data) {
      setMessages(data.map(m => ({
        ...m,
        sender: m.sender as { username: string | null } | undefined,
      })));
    }
  }, [currentChat]);

  const sendMessage = async (content: string) => {
    if (!user || !currentChat) return { error: "Not ready" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile) return { error: "Profile not found" };

    const { error } = await supabase.from("messages").insert({
      chat_id: currentChat.id,
      sender_id: profile.id,
      content,
    });

    return { error: error?.message };
  };

  // Realtime subscription for messages
  useEffect(() => {
    if (!currentChat) return;

    const channel = supabase
      .channel(`messages:${currentChat.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${currentChat.id}`,
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          
          // Fetch sender info
          const { data: sender } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", newMessage.sender_id)
            .maybeSingle();

          setMessages((prev) => [
            ...prev,
            { ...newMessage, sender: sender || { username: null } },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentChat]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    chats,
    currentChat,
    setCurrentChat,
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages,
  };
};
