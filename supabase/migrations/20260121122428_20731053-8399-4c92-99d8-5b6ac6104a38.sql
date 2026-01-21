-- ============================================
-- 1. ENHANCE SCHOOLS TABLE
-- ============================================
ALTER TABLE public.schools 
ADD COLUMN IF NOT EXISTS location_country TEXT,
ADD COLUMN IF NOT EXISTS location_city TEXT,
ADD COLUMN IF NOT EXISTS location_state TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Update verified_status to be text instead of boolean
ALTER TABLE public.schools 
ALTER COLUMN verified_status TYPE TEXT USING 
  CASE WHEN verified_status = true THEN 'verified' 
       WHEN verified_status = false THEN 'pending' 
       ELSE 'pending' END;

ALTER TABLE public.schools 
ADD CONSTRAINT schools_verified_status_check 
CHECK (verified_status IN ('pending', 'verified', 'rejected'));

-- ============================================
-- 2. ENHANCE PROFILES TABLE
-- ============================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS class_section TEXT,
ADD COLUMN IF NOT EXISTS total_contributions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_anonymous_mode BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- 3. COMMUNITIES (Global Subreddit-style)
-- ============================================
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  banner_url TEXT,
  is_global BOOLEAN DEFAULT true,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT community_school_logic CHECK (
    (is_global = true AND school_id IS NULL) OR
    (is_global = false AND school_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_communities_slug ON public.communities(slug);
CREATE INDEX IF NOT EXISTS idx_communities_global ON public.communities(is_global) WHERE is_global = true;

-- ============================================
-- 4. COMMUNITY MEMBERSHIPS
-- ============================================
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(community_id, profile_id)
);

CREATE INDEX IF NOT EXISTS idx_community_members_profile ON public.community_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_community_members_community ON public.community_members(community_id);

-- ============================================
-- 5. ENHANCED GROUPS (Class chats, grade chats, clubs)
-- ============================================
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('CLASS', 'SUBJECT', 'GRADE', 'CLUB', 'DEPARTMENT')),
  name TEXT NOT NULL,
  description TEXT,
  subject_code TEXT,
  grade_level TEXT,
  class_section TEXT,
  leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  member_count INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_groups_school ON public.groups(school_id);
CREATE INDEX IF NOT EXISTS idx_groups_type ON public.groups(type);

-- ============================================
-- 6. GROUP MEMBERSHIPS
-- ============================================
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'leader')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  contribution_score INTEGER DEFAULT 0,
  
  UNIQUE(group_id, profile_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_profile ON public.group_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);

-- ============================================
-- 7. USER INTERESTS (For friend discovery)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  interest_tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(profile_id, interest_tag)
);

CREATE INDEX IF NOT EXISTS idx_user_interests_profile ON public.user_interests(profile_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_tag ON public.user_interests(interest_tag);

-- ============================================
-- 8. FRIEND REQUESTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(sender_id, receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_friend_requests_sender ON public.friend_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON public.friend_requests(receiver_id);

-- ============================================
-- 9. FRIENDSHIPS (Accepted friends)
-- ============================================
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id_1 UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  profile_id_2 UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_friendship UNIQUE(profile_id_1, profile_id_2),
  CONSTRAINT ordered_friendship CHECK (profile_id_1 < profile_id_2)
);

CREATE INDEX IF NOT EXISTS idx_friendships_profile1 ON public.friendships(profile_id_1);
CREATE INDEX IF NOT EXISTS idx_friendships_profile2 ON public.friendships(profile_id_2);

-- ============================================
-- 10. NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mention', 'reply', 'vote', 'challenge', 'election', 'new_message', 'friend_request', 'friend_accepted')),
  title TEXT NOT NULL,
  body TEXT,
  link_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_profile ON public.notifications(profile_id, is_read, created_at DESC);

-- ============================================
-- 11. ELECTIONS (Leader elections)
-- ============================================
CREATE TABLE IF NOT EXISTS public.elections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  election_type TEXT DEFAULT 'monthly' CHECK (election_type IN ('monthly', 'semester', 'manual')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_elections_group ON public.elections(group_id);

-- ============================================
-- 12. ENHANCE POSTS TABLE
-- ============================================
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'text',
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS hot_score NUMERIC DEFAULT 0;

-- ============================================
-- 13. ENHANCE COMMENTS TABLE
-- ============================================
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0;

-- ============================================
-- 14. ENABLE RLS ON NEW TABLES
-- ============================================
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 15. RLS POLICIES - COMMUNITIES
-- ============================================
CREATE POLICY "Anyone can view communities"
  ON public.communities FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create communities"
  ON public.communities FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- 16. RLS POLICIES - COMMUNITY MEMBERS
-- ============================================
CREATE POLICY "Anyone can view community members"
  ON public.community_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join communities"
  ON public.community_members FOR INSERT
  WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can leave communities"
  ON public.community_members FOR DELETE
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- ============================================
-- 17. RLS POLICIES - GROUPS
-- ============================================
CREATE POLICY "Users can view groups from their school"
  ON public.groups FOR SELECT
  USING (
    school_id IN (SELECT school_id FROM profiles WHERE user_id = auth.uid())
    OR is_private = false
  );

CREATE POLICY "Authenticated users can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- 18. RLS POLICIES - GROUP MEMBERS
-- ============================================
CREATE POLICY "Users can view group members from same school"
  ON public.group_members FOR SELECT
  USING (
    group_id IN (
      SELECT g.id FROM groups g 
      JOIN profiles p ON g.school_id = p.school_id 
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join groups from their school"
  ON public.group_members FOR INSERT
  WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    AND group_id IN (
      SELECT g.id FROM groups g 
      JOIN profiles p ON g.school_id = p.school_id 
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can leave groups"
  ON public.group_members FOR DELETE
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- ============================================
-- 19. RLS POLICIES - USER INTERESTS
-- ============================================
CREATE POLICY "Anyone can view user interests"
  ON public.user_interests FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own interests"
  ON public.user_interests FOR INSERT
  WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete their own interests"
  ON public.user_interests FOR DELETE
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- ============================================
-- 20. RLS POLICIES - FRIEND REQUESTS
-- ============================================
CREATE POLICY "Users can view their friend requests"
  ON public.friend_requests FOR SELECT
  USING (
    sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR receiver_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can send friend requests"
  ON public.friend_requests FOR INSERT
  WITH CHECK (
    sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update friend requests they received"
  ON public.friend_requests FOR UPDATE
  USING (
    receiver_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete their friend requests"
  ON public.friend_requests FOR DELETE
  USING (
    sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR receiver_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- ============================================
-- 21. RLS POLICIES - FRIENDSHIPS
-- ============================================
CREATE POLICY "Users can view their friendships"
  ON public.friendships FOR SELECT
  USING (
    profile_id_1 IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR profile_id_2 IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create friendships"
  ON public.friendships FOR INSERT
  WITH CHECK (
    profile_id_1 IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR profile_id_2 IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can remove friendships"
  ON public.friendships FOR DELETE
  USING (
    profile_id_1 IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR profile_id_2 IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- ============================================
-- 22. RLS POLICIES - NOTIFICATIONS
-- ============================================
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- ============================================
-- 23. RLS POLICIES - ELECTIONS
-- ============================================
CREATE POLICY "Users can view elections from their school groups"
  ON public.elections FOR SELECT
  USING (
    group_id IN (
      SELECT g.id FROM groups g 
      JOIN profiles p ON g.school_id = p.school_id 
      WHERE p.user_id = auth.uid()
    )
  );

-- ============================================
-- 24. SEED GLOBAL COMMUNITIES
-- ============================================
INSERT INTO public.communities (name, slug, description, is_global, icon_url) VALUES
  ('SAT Prep', 'sat-prep', 'Study materials, tips, and discussions for SAT preparation', true, NULL),
  ('AP Exams', 'ap-exams', 'AP courses discussion, study groups, and exam prep', true, NULL),
  ('Mental Health', 'mental-health', 'A safe space to discuss mental health, stress, and wellbeing', true, NULL),
  ('Study Tips', 'study-tips', 'Share and discover effective study techniques', true, NULL),
  ('College Applications', 'college-apps', 'Advice on applications, essays, and admissions', true, NULL),
  ('STEM Nerds', 'stem-nerds', 'For math, science, and tech enthusiasts', true, NULL),
  ('Arts & Creativity', 'arts-creativity', 'Art, music, drama, and creative expression', true, NULL),
  ('Sports Talk', 'sports-talk', 'High school and college sports discussions', true, NULL)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 25. ENABLE REALTIME FOR NEW TABLES
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.friend_requests;