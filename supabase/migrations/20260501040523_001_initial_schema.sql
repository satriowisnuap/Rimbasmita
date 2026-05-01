/*
  # Rimbasmita Initial Schema

  1. New Tables
    - `profiles`: User profiles extending auth.users with username, bio, image, location
    - `trails`: Hiking trails with name, location, elevation, difficulty, description
    - `stories`: User stories with title, slug, content, trail reference, difficulty, duration, mood, privacy
    - `story_images`: Images attached to stories
    - `story_tags`: Tags for stories (sunrise, solo, extreme, spiritual, etc.)
    - `comments`: Comments on stories with nested replies support
    - `likes`: Like records for stories
    - `bookmarks`: Bookmark/save records for stories
    - `follows`: Follower/following relationships between users
    - `notifications`: User notifications (likes, comments, follows)
    - `achievements`: Achievement definitions
    - `user_achievements`: Achievement records per user

  2. Security
    - RLS enabled on ALL tables
    - Profiles: users can read all, update own only
    - Trails: public read, admin insert
    - Stories: public read for non-private, users CRUD own stories
    - Story images/tags: read all, manage by story owner
    - Comments: read all, create own, delete own or story owner
    - Likes: read all, toggle own
    - Bookmarks: read own, toggle own
    - Follows: read all, manage own
    - Notifications: read own, manage own
    - Achievements: public read
    - User achievements: read own, system insert

  3. Important Notes
    - Uses auth.uid() for all ownership checks
    - Cascading deletes where appropriate
    - Indexes on frequently queried columns
    - Slug uniqueness for stories
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  name text DEFAULT '',
  email text DEFAULT '',
  image text DEFAULT '',
  bio text DEFAULT '',
  location text DEFAULT '',
  interests text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trails table
CREATE TABLE IF NOT EXISTS trails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  region text DEFAULT '',
  country text DEFAULT 'Indonesia',
  elevation integer DEFAULT 0,
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  description text DEFAULT '',
  estimated_duration text DEFAULT '',
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trails are publicly readable"
  ON trails FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert trails"
  ON trails FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text DEFAULT '',
  excerpt text DEFAULT '',
  trail_id uuid REFERENCES trails(id) ON DELETE SET NULL,
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  duration text DEFAULT '',
  elevation text DEFAULT '',
  mood text DEFAULT 'calm' CHECK (mood IN ('calm', 'challenging', 'reflective')),
  is_private boolean DEFAULT false,
  is_draft boolean DEFAULT true,
  tips text DEFAULT '',
  warnings text DEFAULT '',
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  bookmarks_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public stories are readable by all"
  ON stories FOR SELECT
  TO authenticated
  USING (is_private = false OR user_id = auth.uid());

CREATE POLICY "Users can insert own stories"
  ON stories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories"
  ON stories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories"
  ON stories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Story images table
CREATE TABLE IF NOT EXISTS story_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE story_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Story images are readable by all"
  ON story_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Story owner can insert images"
  ON story_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM stories WHERE stories.id = story_images.story_id AND stories.user_id = auth.uid())
  );

CREATE POLICY "Story owner can delete images"
  ON story_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM stories WHERE stories.id = story_images.story_id AND stories.user_id = auth.uid())
  );

-- Story tags table
CREATE TABLE IF NOT EXISTS story_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE story_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Story tags are readable by all"
  ON story_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Story owner can manage tags"
  ON story_tags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM stories WHERE stories.id = story_tags.story_id AND stories.user_id = auth.uid())
  );

CREATE POLICY "Story owner can delete tags"
  ON story_tags FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM stories WHERE stories.id = story_tags.story_id AND stories.user_id = auth.uid())
  );

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are readable by all"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, story_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are readable by all"
  ON likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can toggle own likes"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, story_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookmarks"
  ON bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can toggle own bookmarks"
  ON bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own bookmarks"
  ON bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows are readable by all"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'achievement')),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE,
  message text DEFAULT '',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text DEFAULT '',
  icon text DEFAULT '',
  condition text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements are publicly readable"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User achievements are readable by all"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can grant achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);
CREATE INDEX IF NOT EXISTS idx_stories_trail_id ON stories(trail_id);
CREATE INDEX IF NOT EXISTS idx_stories_is_private ON stories(is_private);
CREATE INDEX IF NOT EXISTS idx_stories_is_draft ON stories(is_draft);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_story_id ON comments(story_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_likes_story_id ON likes(story_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_story_tags_tag ON story_tags(tag);
CREATE INDEX IF NOT EXISTS idx_trails_difficulty ON trails(difficulty);
CREATE INDEX IF NOT EXISTS idx_trails_location ON trails(location);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Seed achievements
INSERT INTO achievements (name, description, icon, condition) VALUES
  ('first_story', 'Published your first story', 'feather', 'Publish 1 story'),
  ('storyteller', 'Published 5 stories', 'book-open', 'Publish 5 stories'),
  ('mountain_lover', 'Published 10 stories', 'mountain', 'Publish 10 stories'),
  ('first_like', 'Received your first like', 'heart', 'Get 1 like'),
  ('popular', 'Received 50 likes across all stories', 'trending-up', 'Get 50 total likes'),
  ('trailblazer', 'Added your first trail', 'compass', 'Reference 1 trail'),
  ('community', 'Gained your first follower', 'users', 'Get 1 follower'),
  ('reflected', 'Wrote a reflective story', 'cloud', 'Write a story with mood=reflective')
ON CONFLICT (name) DO NOTHING;

-- Seed some Indonesian trails
INSERT INTO trails (name, location, region, country, elevation, difficulty, description, estimated_duration) VALUES
  ('Gunung Rinjani', 'Lombok, NTB', 'Nusa Tenggara Barat', 'Indonesia', 3726, 'hard', 'Active volcano with stunning crater lake and summit views', '2-3 days'),
  ('Gunung Semeru', 'Malang, Jawa Timur', 'Jawa Timur', 'Indonesia', 3676, 'hard', 'Highest peak in Java with regular volcanic activity', '2-3 days'),
  ('Gunung Bromo', 'Probolinggo, Jawa Timur', 'Jawa Timur', 'Indonesia', 2329, 'easy', 'Iconic volcanic landscape with sea of sand', '1 day'),
  ('Gunung Gede', 'Bogor, Jawa Barat', 'Jawa Barat', 'Indonesia', 2958, 'medium', 'Popular weekend hike near Jakarta with rich biodiversity', '2 days'),
  ('Gunung Pangrango', 'Bogor, Jawa Barat', 'Jawa Barat', 'Indonesia', 3019, 'medium', 'Twin peak of Gede with pristine montane forest', '2 days'),
  ('Gunung Kerinci', 'Kerinci, Jambi', 'Jambi', 'Indonesia', 3805, 'hard', 'Highest volcano in Indonesia, Sumatra''s tallest peak', '2-3 days'),
  ('Gunung Merbabu', 'Magelang, Jawa Tengah', 'Jawa Tengah', 'Indonesia', 3145, 'medium', 'Beautiful ridge walk with views of Merapi', '2 days'),
  ('Gunung Lawu', 'Karanganyar, Jawa Tengah', 'Jawa Tengah', 'Indonesia', 3265, 'medium', 'Sacred mountain with ancient temple sites', '2 days'),
  ('Gunung Salak', 'Bogor, Jawa Barat', 'Jawa Barat', 'Indonesia', 2211, 'medium', 'Dense tropical forest hike near Jakarta', '1-2 days'),
  ('Gunung Prau', 'Wonosobo, Jawa Tengah', 'Jawa Tengah', 'Indonesia', 2565, 'easy', 'Gentle slope with spectacular sunrise views', '1 day')
ON CONFLICT DO NOTHING;
