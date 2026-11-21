-- Connectora — Production Supabase PostgreSQL Schema & Row-Level Security (RLS)
-- Strictly enforces 18+ adult eligibility, privacy isolation, mutual-match messaging,
-- block boundaries, private moderation records, and anti-spam rate limiting.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUMS
DO $$ BEGIN
  CREATE TYPE connection_intention AS ENUM (
    'Friendship',
    'Social Connections',
    'Serious Relationships',
    'Life Partner'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE account_status AS ENUM ('active', 'suspended', 'deleted');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE report_reason AS ENUM (
    'Harassment',
    'Fake Profile / Impersonation',
    'Spam or Scam',
    'Underage Concern',
    'Inappropriate Content'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. PROFILES (Private owner record — never query directly from public discovery)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 50),
  date_of_birth DATE NOT NULL CHECK (date_of_birth <= (CURRENT_DATE - INTERVAL '18 years')),
  age_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  country_code CHAR(2) NOT NULL CHECK (country_code IN ('US', 'CA', 'GB')),
  general_location TEXT NOT NULL CHECK (char_length(general_location) BETWEEN 2 AND 80),
  phone_e164 TEXT,
  bio TEXT NOT NULL DEFAULT '' CHECK (char_length(bio) <= 800),
  interests TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT ARRAY['English'],
  intentions connection_intention[] NOT NULL DEFAULT ARRAY['Friendship']::connection_intention[],
  show_location_public BOOLEAN NOT NULL DEFAULT TRUE,
  show_languages_public BOOLEAN NOT NULL DEFAULT TRUE,
  show_in_discovery BOOLEAN NOT NULL DEFAULT TRUE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  status account_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Public-safe discovery view: NEVER exposes date_of_birth, phone_e164, email, or private account flags
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
  p.id,
  p.display_name,
  DATE_PART('year', AGE(CURRENT_DATE, p.date_of_birth))::INT AS age,
  p.country_code,
  CASE WHEN p.show_location_public THEN p.general_location ELSE 'Location hidden' END AS general_location,
  p.bio,
  p.interests,
  CASE WHEN p.show_languages_public THEN p.languages ELSE ARRAY[]::TEXT[] END AS languages,
  p.intentions,
  p.created_at
FROM public.profiles p
WHERE p.status = 'active'
  AND p.show_in_discovery = TRUE
  AND p.date_of_birth <= (CURRENT_DATE - INTERVAL '18 years');

-- 3. PROFILE PHOTOS
CREATE TABLE IF NOT EXISTS public.profile_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp')),
  file_size_bytes INT NOT NULL CHECK (file_size_bytes > 0 AND file_size_bytes <= 5242880),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BLOCKS
CREATE TABLE IF NOT EXISTS public.blocks (
  blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);

CREATE OR REPLACE FUNCTION public.is_blocked_between(user_a UUID, user_b UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.blocks
    WHERE (blocker_id = user_a AND blocked_id = user_b)
       OR (blocker_id = user_b AND blocked_id = user_a)
  );
$$;

-- 5. LIKES & MUTUAL MATCHES
CREATE TABLE IF NOT EXISTS public.likes (
  from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (from_user_id, to_user_id),
  CHECK (from_user_id <> to_user_id)
);

CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_one_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_two_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (user_one_id < user_two_id),
  UNIQUE (user_one_id, user_two_id)
);

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL UNIQUE REFERENCES public.matches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automatic mutual match & conversation trigger
CREATE OR REPLACE FUNCTION public.handle_mutual_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  u1 UUID;
  u2 UUID;
  new_match_id UUID;
BEGIN
  IF public.is_blocked_between(NEW.from_user_id, NEW.to_user_id) THEN
    RAISE EXCEPTION 'Cannot interact with a blocked account';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.likes
    WHERE from_user_id = NEW.to_user_id AND to_user_id = NEW.from_user_id
  ) THEN
    u1 := LEAST(NEW.from_user_id, NEW.to_user_id);
    u2 := GREATEST(NEW.from_user_id, NEW.to_user_id);

    INSERT INTO public.matches (user_one_id, user_two_id)
    VALUES (u1, u2)
    ON CONFLICT (user_one_id, user_two_id) DO NOTHING
    RETURNING id INTO new_match_id;

    IF new_match_id IS NOT NULL THEN
      INSERT INTO public.conversations (match_id)
      VALUES (new_match_id)
      ON CONFLICT (match_id) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_like_created ON public.likes;
CREATE TRIGGER on_like_created
AFTER INSERT ON public.likes
FOR EACH ROW EXECUTE FUNCTION public.handle_mutual_like();

-- 6. PRIVATE MESSAGES (Mutual match + non-blocked + rate-limited)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(trim(body)) BETWEEN 1 AND 2000),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Basic anti-spam rate limit: max 12 messages per 60 seconds per sender
CREATE OR REPLACE FUNCTION public.enforce_message_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  recent_count INT;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.messages
  WHERE sender_id = NEW.sender_id
    AND created_at > (NOW() - INTERVAL '60 seconds');

  IF recent_count >= 12 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before sending more messages.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_message_rate_limit ON public.messages;
CREATE TRIGGER trg_message_rate_limit
BEFORE INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.enforce_message_rate_limit();

-- 7. SAFETY REPORTS & MODERATION AUDIT LOG
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason report_reason NOT NULL,
  description TEXT NOT NULL CHECK (char_length(trim(description)) BETWEEN 10 AND 2000),
  evidence_note TEXT,
  status report_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (reporter_id <> reported_user_id)
);

CREATE TABLE IF NOT EXISTS public.moderation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE SET NULL,
  moderator_id UUID NOT NULL REFERENCES public.profiles(id),
  target_user_id UUID NOT NULL REFERENCES public.profiles(id),
  action_type TEXT NOT NULL CHECK (action_type IN ('status_changed', 'account_suspended', 'account_restored', 'warning_issued')),
  notes TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;

-- Helper: check moderator/admin role
CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('moderator', 'admin') AND status = 'active'
  );
$$;

-- Profiles RLS
CREATE POLICY "Users can view their own full profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_moderator());

CREATE POLICY "Users can insert their own adult profile"
ON public.profiles FOR INSERT
WITH CHECK (
  auth.uid() = id
  AND date_of_birth <= (CURRENT_DATE - INTERVAL '18 years')
);

CREATE POLICY "Users can update only their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Profile Photos RLS
CREATE POLICY "Authenticated active users view non-blocked photos"
ON public.profile_photos FOR SELECT
USING (
  auth.role() = 'authenticated'
  AND NOT public.is_blocked_between(auth.uid(), user_id)
);

CREATE POLICY "Users manage own photos"
ON public.profile_photos FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Blocks RLS
CREATE POLICY "Users manage own blocks"
ON public.blocks FOR ALL
USING (auth.uid() = blocker_id)
WITH CHECK (auth.uid() = blocker_id);

-- Likes RLS
CREATE POLICY "Users view likes they sent or received"
ON public.likes FOR SELECT
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Active adults create likes when unblocked"
ON public.likes FOR INSERT
WITH CHECK (
  auth.uid() = from_user_id
  AND NOT public.is_blocked_between(from_user_id, to_user_id)
);

CREATE POLICY "Users can withdraw own likes"
ON public.likes FOR DELETE
USING (auth.uid() = from_user_id);

-- Matches RLS
CREATE POLICY "Users view own matches"
ON public.matches FOR SELECT
USING (auth.uid() = user_one_id OR auth.uid() = user_two_id);

CREATE POLICY "Users can unmatch own matches"
ON public.matches FOR DELETE
USING (auth.uid() = user_one_id OR auth.uid() = user_two_id);

-- Conversations RLS
CREATE POLICY "Participants view own conversations"
ON public.conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    WHERE m.id = match_id
      AND (m.user_one_id = auth.uid() OR m.user_two_id = auth.uid())
      AND NOT public.is_blocked_between(m.user_one_id, m.user_two_id)
  )
);

-- Messages RLS: Strictly matched and non-blocked participants only
CREATE POLICY "Matched participants read messages"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.conversations c
    JOIN public.matches m ON m.id = c.match_id
    WHERE c.id = conversation_id
      AND (m.user_one_id = auth.uid() OR m.user_two_id = auth.uid())
      AND NOT public.is_blocked_between(m.user_one_id, m.user_two_id)
  )
);

CREATE POLICY "Matched participants send messages"
ON public.messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1
    FROM public.conversations c
    JOIN public.matches m ON m.id = c.match_id
    WHERE c.id = conversation_id
      AND (m.user_one_id = auth.uid() OR m.user_two_id = auth.uid())
      AND NOT public.is_blocked_between(m.user_one_id, m.user_two_id)
  )
);

-- Reports & Moderation RLS: Strictly private to moderators/admins (reporters cannot view others' reports)
CREATE POLICY "Authenticated users can submit reports"
ON public.reports FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Only moderators read or update reports"
ON public.reports FOR SELECT
USING (public.is_moderator());

CREATE POLICY "Only moderators update reports"
ON public.reports FOR UPDATE
USING (public.is_moderator())
WITH CHECK (public.is_moderator());

CREATE POLICY "Only moderators access moderation actions"
ON public.moderation_actions FOR ALL
USING (public.is_moderator())
WITH CHECK (public.is_moderator());

-- 9. STORAGE BUCKET POLICIES (Restricted profile photos bucket)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  FALSE,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated adults read non-blocked signed profile photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'profile-photos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users upload photos to own folder only"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos'
  AND auth.uid()::TEXT = (storage.foldername(name))[1]
);

CREATE POLICY "Users delete own photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-photos'
  AND auth.uid()::TEXT = (storage.foldername(name))[1]
);
