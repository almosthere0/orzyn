import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Compass,
  MessageSquare,
  Trophy,
  User,
  Settings,
  LogOut,
  Sparkles,
  Users,
  Bell,
  ChevronLeft,
  GraduationCap,
  Flame,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Flame, label: "Feed", href: "/feed" },
  { icon: Compass, label: "Explore", href: "/explore" },
  { icon: MessageSquare, label: "Chats", href: "/chats" },
  { icon: Trophy, label: "Challenges", href: "/challenges" },
  { icon: Users, label: "Friends", href: "/friends" },
];

interface AppLayoutProps {
  children: React.ReactNode;
  profile?: {
    username: string | null;
    avatar_url?: string | null;
    reputation_points?: number | null;
    school_name?: string | null;
  } | null;
}

const SidebarContent = ({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { unreadCount } = useNotifications();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link
          to="/dashboard"
          className="flex items-center gap-3"
          onClick={onNavigate}
        >
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-lg">CampusVerse</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
              {item.badge && item.badge > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute right-2 text-xs h-5 px-1.5"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-border space-y-1">
        <Link
          to="/settings"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
            location.pathname === "/settings"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium">Settings</span>}
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground w-full"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export const AppLayout = ({ children, profile }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300 sticky top-0 h-screen",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent collapsed={sidebarCollapsed} />
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-border bg-card hidden lg:flex"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform",
              sidebarCollapsed && "rotate-180"
            )}
          />
        </Button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between h-14 px-4">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent
                  collapsed={false}
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {/* Spacer for desktop */}
            <div className="hidden lg:block" />

            {/* Right side */}
            <div className="flex items-center gap-2">
              <NotificationsDropdown />

              {/* Profile */}
              <Link to="/profile" className="flex items-center gap-3 pl-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">
                    {profile?.username || "Student"}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                    <span>⭐ {profile?.reputation_points || 0}</span>
                  </p>
                </div>
                <Avatar className="w-9 h-9">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback>
                    {profile?.username?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};
