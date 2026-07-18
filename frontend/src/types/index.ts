import type { Enums, Tables } from './database';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  neighborhood?: string;
  bio?: string;
  memberSince?: string;
  rating?: number;
}

// DB-aligned types — match public.listings. price_cents is display-only listing
// metadata; NearU does not process transactions.
export type ListingCondition = Enums<'listing_condition'>;
export type ListingCategory = Enums<'listing_category'>;
export type ListingStatus = Enums<'listing_status'>;

export type Listing = Tables<'listings'>;

// Seller identity comes from profiles_public, never from profiles — the browse
// and detail pages must not be able to pull private seller columns.
export type ListingSeller = Pick<
  ProfilePublic,
  'id' | 'display_name' | 'profile_photo_url' | 'trust_score' | 'number_of_reviews'
>;

export interface ListingWithSeller extends Listing {
  seller: ListingSeller | null;
}

export interface BorrowPost {
  id: string;
  title: string;
  description: string;
  availability: string;
  borrowDuration: string;
  type: 'lend' | 'request';
  poster: User;
  createdAt: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  location: string;
  deadline: string;
  poster: User;
  status: 'open' | 'in_progress' | 'completed';
  distance?: string;
  createdAt: string;
}

export interface SafeDropHolder {
  id: string;
  name: string;
  address: string;
  rating: number;
  capacity: number;
  currentLoad: number;
  availabilityHours: string;
  user: User;
}

export interface GroupRide {
  id: string;
  title: string;
  destination: string;
  date: string;
  time: string;
  maxPeople: number;
  currentPeople: number;
  organizer: User;
  participants: User[];
  createdAt: string;
}

export interface Hangout {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  maxAttendees: number;
  currentAttendees: number;
  description: string;
  organizer: User;
  participants: User[];
  createdAt: string;
}

// DB-aligned types — match public.messages. The messages table is the durable
// source of truth for chat history; Supabase Realtime only pushes live inserts.
export type Message = Tables<'messages'>;

// The other participant's public identity, read from profiles_public only.
export type ChatPartner = Pick<
  ProfilePublic,
  'id' | 'display_name' | 'profile_photo_url'
>;

// One row of the inbox list: shape of the list_my_conversations() RPC plus the
// other user's stitched public profile.
export interface ConversationSummary {
  conversation_id: string;
  other_user_id: string;
  last_message_body: string;
  last_message_at: string;
  unread_count: number;
  other_user: ChatPartner | null;
}

export interface Review {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

// DB-aligned types — match public.profiles (own-profile reads only)
export interface Profile {
  id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  bio: string | null;
  school_name: string | null;
  profile_photo_url: string | null;
  // Legacy payment columns are deliberately absent. The DB columns still exist
  // but are dormant and are never selected by app code.
  trust_score: number | null;
  number_of_reviews: number | null;
  completed_deals_count: number | null;
  is_onboarded: boolean | null;
  account_status: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

// DB-aligned types — match public.profiles_public (other-user reads via /profile/[userId])
export interface ProfilePublic {
  id: string;
  display_name: string | null;
  profile_photo_url: string | null;
  bio: string | null;
  school_name: string | null;
  trust_score: number | null;
  number_of_reviews: number | null;
  completed_deals_count: number | null;
  approximate_location: unknown;
}

// DB-aligned types — match public.allowed_email_domains
export interface AllowedEmailDomain {
  id: string;
  domain: string;
  school_name: string;
  active: boolean;
  created_at: string;
}

// DB-aligned types — match public.user_blocks
export interface UserBlock {
  user_id: string;
  blocked_user_id: string;
  created_at: string | null;
}

// DB-aligned types — match public.user_reports
export interface UserReport {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  created_at: string | null;
}
