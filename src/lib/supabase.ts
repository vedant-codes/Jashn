import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  role: 'client' | 'planner' | 'admin';
  phone?: string;
  avatar_url?: string;
  created_at: string;
};

export type Event = {
  id: string;
  client_id: string;
  planner_id?: string;
  title: string;
  event_type: string;
  date: string;
  location: string;
  guest_count: number;
  budget: number;
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type Vendor = {
  id: string;
  name: string;
  category: string;
  description?: string;
  rating: number;
  price_range?: string;
  image_url?: string;
  services: Array<{ name: string; price: number }>;
  created_at: string;
};

export type Booking = {
  id: string;
  event_id: string;
  vendor_id: string;
  service_name: string;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
};

export type Message = {
  id: string;
  event_id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

export type Review = {
  id: string;
  vendor_id: string;
  client_id: string;
  event_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};