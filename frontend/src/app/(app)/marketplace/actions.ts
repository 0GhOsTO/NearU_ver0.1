'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type {
  ListingCategory,
  ListingCondition,
  ListingSeller,
  ListingWithSeller,
} from '@/types';

const LISTING_COLUMNS =
  'id, seller_id, title, description, price_cents, category, condition, image_url, status, created_at, updated_at';

// Seller identity is read from profiles_public only. The private profiles table
// holds sensitive and legacy columns that must never reach browse/detail pages.
const SELLER_COLUMNS = 'id, display_name, profile_photo_url, trust_score, number_of_reviews';

export interface CreateListingPayload {
  title: string;
  description: string;
  category: ListingCategory;
  condition: ListingCondition;
  /** Dollars, as typed into the form. Converted to integer cents before insert. */
  price: number;
}

const CATEGORIES: ListingCategory[] = [
  'textbooks',
  'electronics',
  'furniture',
  'clothing',
  'sports',
  'other',
];
const CONDITIONS: ListingCondition[] = ['new', 'like_new', 'good', 'fair'];

const MAX_PRICE_CENTS = 100_000_000; // mirrors the listings_price_range constraint

/**
 * Attaches each listing's public seller profile. Done as a second query rather
 * than a PostgREST embed because listings.seller_id has its FK to profiles, not
 * to profiles_public.
 */
async function attachSellers(
  supabase: Awaited<ReturnType<typeof createClient>>,
  listings: Omit<ListingWithSeller, 'seller'>[],
): Promise<ListingWithSeller[]> {
  if (listings.length === 0) return [];

  const sellerIds = [...new Set(listings.map((listing) => listing.seller_id))];

  const { data: sellers } = await supabase
    .from('profiles_public')
    .select(SELLER_COLUMNS)
    .in('id', sellerIds);

  const sellerById = new Map<string, ListingSeller>(
    (sellers ?? []).map((seller) => [seller.id, seller as ListingSeller]),
  );

  return listings.map((listing) => ({
    ...listing,
    seller: sellerById.get(listing.seller_id) ?? null,
  }));
}

export async function getListings(): Promise<ListingWithSeller[]> {
  const supabase = await createClient();

  // RLS already limits this to active listings (plus the caller's own rows);
  // the explicit filter keeps the browse feed to active only.
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_COLUMNS)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return attachSellers(supabase, data);
}

export async function getListing(id: string): Promise<ListingWithSeller | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;

  const [listing] = await attachSellers(supabase, [data]);
  return listing ?? null;
}

export async function getMyListings(): Promise<ListingWithSeller[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_COLUMNS)
    .eq('seller_id', user.id)
    .neq('status', 'removed')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return attachSellers(supabase, data);
}

export async function createListing(
  payload: CreateListingPayload,
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return { error: 'Not authenticated.' };

  const title = payload.title.trim();
  const description = payload.description.trim();

  // Validate here as well as in the DB constraints: a CHECK violation surfaces
  // as an opaque Postgres error, which is not a usable message for the seller.
  if (title.length < 3 || title.length > 120) {
    return { error: 'Title must be between 3 and 120 characters.' };
  }
  if (description.length < 1 || description.length > 2000) {
    return { error: 'Description must be between 1 and 2000 characters.' };
  }
  if (!CATEGORIES.includes(payload.category)) {
    return { error: 'Please choose a valid category.' };
  }
  if (!CONDITIONS.includes(payload.condition)) {
    return { error: 'Please choose a valid condition.' };
  }
  if (!Number.isFinite(payload.price) || payload.price < 0) {
    return { error: 'Please enter a valid price.' };
  }

  const priceCents = Math.round(payload.price * 100);
  if (priceCents > MAX_PRICE_CENTS) {
    return { error: 'Price is too high.' };
  }

  // seller_id is taken from the session, never from the client. The RLS insert
  // policy re-checks it against auth.uid().
  const { error } = await supabase.from('listings').insert({
    seller_id: user.id,
    title,
    description,
    category: payload.category,
    condition: payload.condition,
    price_cents: priceCents,
  });

  if (error) return { error: error.message };

  revalidatePath('/marketplace');
  redirect('/marketplace');
}
