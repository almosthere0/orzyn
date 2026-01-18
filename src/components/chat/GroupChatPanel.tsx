import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, Users, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGroupChat } from "@/hooks/useGroupChat";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

export const GroupChatPanel = () => {
  const { user, isGuest } = useAuth();
  const { chats, currentChat, setCurrentChat, messages, loading, sendMessage } = useGroupChat();
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const canChat = !!user && !isGuest;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !canChat) return;

    setSending(true);
    await sendMessage(newMessage.trim());
    setNewMessage("");
    setSending(false);
  };

  if (!user) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display font-semibold mb-2">Sign in to Chat</h3>
        <p className="text-muted-foreground text-sm">
          Join your school's group chats to connect with classmates.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <div className="animate-pulse text-primary">Loading chats...</div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display font-semibold mb-2">No Chats Available</h3>
        <p className="text-muted-foreground text-sm">
          No group chats found for your school yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden h-[500px] flex">
      {/* Chat List Sidebar */}
      <div className="w-48 border-r border-border bg-muted/30">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="w-4 h-4" />
            Chats
          </div>
        </div>
        <div className="p-2 space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setCurrentChat(chat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                currentChat?.id === chat.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Hash className="w-4 h-4 shrink-0" />
              <span className="truncate">{chat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-3 border-b border-border flex items-center gap-2">
          <Hash className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{currentChat?.name}</span>
          {currentChat?.grade_level && (
            <span className="text-xs text-muted-foreground">
              • {currentChat.grade_level}
            </span>
          )}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium shrink-0">
                    {(message.sender?.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm">
                        {message.sender?.username || "User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        {canChat ? (
          <form onSubmit={handleSend} className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder={`Message #${currentChat?.name}`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!newMessage.trim() || sending}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-3 border-t border-border text-center text-sm text-muted-foreground">
            Sign in to send messages
          </div>
        )}
      </div>
    </div>
  );
};
