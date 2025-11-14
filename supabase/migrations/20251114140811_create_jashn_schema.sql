/*
  # Jashn Event Management Platform Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `full_name` (text)
      - `role` (text: 'client', 'planner', 'admin')
      - `phone` (text)
      - `avatar_url` (text)
      - `created_at` (timestamptz)
      
    - `events`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references profiles)
      - `planner_id` (uuid, references profiles, nullable)
      - `title` (text)
      - `event_type` (text)
      - `date` (timestamptz)
      - `location` (text)
      - `guest_count` (integer)
      - `budget` (numeric)
      - `status` (text: 'planning', 'in_progress', 'completed', 'cancelled')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
    - `vendors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `description` (text)
      - `rating` (numeric)
      - `price_range` (text)
      - `image_url` (text)
      - `services` (jsonb)
      - `created_at` (timestamptz)
      
    - `bookings`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `vendor_id` (uuid, references vendors)
      - `service_name` (text)
      - `price` (numeric)
      - `status` (text: 'pending', 'confirmed', 'cancelled')
      - `created_at` (timestamptz)
      
    - `messages`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `sender_id` (uuid, references profiles)
      - `message` (text)
      - `created_at` (timestamptz)
      
    - `reviews`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, references vendors)
      - `client_id` (uuid, references profiles)
      - `event_id` (uuid, references events)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamptz)
      
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `message` (text)
      - `read` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'client',
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  planner_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  event_type text NOT NULL,
  date timestamptz NOT NULL,
  location text NOT NULL,
  guest_count integer NOT NULL DEFAULT 0,
  budget numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'planning',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  rating numeric DEFAULT 0,
  price_range text,
  image_url text,
  services jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  service_name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Clients can view own events"
  ON events FOR SELECT
  TO authenticated
  USING (client_id = auth.uid() OR planner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Clients can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients and planners can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (client_id = auth.uid() OR planner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (client_id = auth.uid() OR planner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Everyone can view vendors"
  ON vendors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage vendors"
  ON vendors FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can view bookings for their events"
  ON bookings FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events WHERE events.id = bookings.event_id 
    AND (events.client_id = auth.uid() OR events.planner_id = auth.uid())
  ) OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can create bookings for their events"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM events WHERE events.id = bookings.event_id 
    AND (events.client_id = auth.uid() OR events.planner_id = auth.uid())
  ));

CREATE POLICY "Users can view messages for their events"
  ON messages FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events WHERE events.id = messages.event_id 
    AND (events.client_id = auth.uid() OR events.planner_id = auth.uid())
  ));

CREATE POLICY "Users can send messages for their events"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM events WHERE events.id = messages.event_id 
    AND (events.client_id = auth.uid() OR events.planner_id = auth.uid())
  ) AND sender_id = auth.uid());

CREATE POLICY "Everyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Clients can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());