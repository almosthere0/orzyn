
-- Posts system
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.schools(id),
  content TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.post_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Teachers and ratings system
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_type TEXT NOT NULL CHECK (target_type IN ('teacher', 'class')),
  target_id UUID NOT NULL,
  rater_id UUID NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(target_type, target_id, rater_id)
);

-- School challenges system
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  max_points INTEGER NOT NULL DEFAULT 100,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.school_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  current_points INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, challenge_id)
);

CREATE TABLE public.rivalries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_a_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  school_b_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (school_a_id <> school_b_id)
);

-- Group chat system
CREATE TABLE public.group_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  grade_level TEXT,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.group_chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rivalries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Anyone can view posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (author_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (author_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Post votes policies
CREATE POLICY "Anyone can view votes" ON public.post_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote" ON public.post_votes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can change own vote" ON public.post_votes FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can remove own vote" ON public.post_votes FOR DELETE USING (user_id = auth.uid());

-- Comments policies
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (author_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Teachers policies
CREATE POLICY "Anyone can view teachers" ON public.teachers FOR SELECT USING (true);

-- Ratings policies (anonymous - no link to rater visible)
CREATE POLICY "Anyone can view ratings" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users can rate" ON public.ratings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own rating" ON public.ratings FOR UPDATE USING (rater_id = auth.uid());

-- Challenges policies
CREATE POLICY "Anyone can view challenges" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Anyone can view school challenges" ON public.school_challenges FOR SELECT USING (true);
CREATE POLICY "Anyone can view rivalries" ON public.rivalries FOR SELECT USING (true);

-- Group chat policies (users can only access chats from their school)
CREATE POLICY "Users can view chats from their school" ON public.group_chats FOR SELECT 
  USING (school_id IN (SELECT school_id FROM public.profiles WHERE user_id = auth.uid()));

-- Messages policies
CREATE POLICY "Users can view messages in their school chats" ON public.messages FOR SELECT 
  USING (chat_id IN (
    SELECT gc.id FROM public.group_chats gc 
    JOIN public.profiles p ON gc.school_id = p.school_id 
    WHERE p.user_id = auth.uid()
  ));
CREATE POLICY "Users can send messages to their school chats" ON public.messages FOR INSERT 
  WITH CHECK (
    chat_id IN (
      SELECT gc.id FROM public.group_chats gc 
      JOIN public.profiles p ON gc.school_id = p.school_id 
      WHERE p.user_id = auth.uid()
    ) AND
    sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create triggers for updated_at
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_school_challenges_updated_at BEFORE UPDATE ON public.school_challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.teachers (school_id, name, subject) 
SELECT id, 'Mr. Johnson', 'Mathematics' FROM public.schools WHERE name = 'Stanford University'
UNION ALL
SELECT id, 'Ms. Garcia', 'Physics' FROM public.schools WHERE name = 'Stanford University'
UNION ALL
SELECT id, 'Dr. Smith', 'Computer Science' FROM public.schools WHERE name = 'MIT';

INSERT INTO public.challenges (title, description, max_points, end_date)
VALUES 
  ('Study Marathon', 'Log the most study hours this week', 500, now() + interval '7 days'),
  ('Community Builder', 'Get the most upvotes on helpful posts', 300, now() + interval '14 days'),
  ('Knowledge Share', 'Answer the most questions correctly', 400, now() + interval '7 days');

INSERT INTO public.group_chats (school_id, grade_level, name)
SELECT id, 'Freshman', 'Freshman Chat' FROM public.schools WHERE name = 'Stanford University'
UNION ALL
SELECT id, 'Sophomore', 'Sophomore Chat' FROM public.schools WHERE name = 'Stanford University'
UNION ALL
SELECT id, 'Freshman', 'Freshman Chat' FROM public.schools WHERE name = 'MIT';

INSERT INTO public.rivalries (school_a_id, school_b_id)
SELECT s1.id, s2.id FROM public.schools s1, public.schools s2 
WHERE s1.name = 'Stanford University' AND s2.name = 'MIT';

INSERT INTO public.school_challenges (school_id, challenge_id, current_points)
SELECT s.id, c.id, floor(random() * 200)::int
FROM public.schools s
CROSS JOIN public.challenges c;
