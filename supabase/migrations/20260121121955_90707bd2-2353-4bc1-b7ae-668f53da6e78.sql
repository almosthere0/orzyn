-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a more restrictive policy: users can see their own profile OR profiles from same school
CREATE POLICY "Users can view profiles from same school"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  school_id IN (
    SELECT p.school_id 
    FROM public.profiles p 
    WHERE p.user_id = auth.uid()
  )
);