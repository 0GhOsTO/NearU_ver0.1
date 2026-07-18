'use server';

import { createClient } from '@/lib/supabase/server';
import type { ChatPartner, ConversationSummary, Message } from '@/types';

// Message rows carry only these columns; body length is enforced by the DB.
const MESSAGE_COLUMNS = 'id, conversation_id, sender_id, body, created_at';

// The other participant's identity comes from profiles_public only — the private
// profiles table holds sensitive and legacy columns that must never reach chat UI.
const PARTNER_COLUMNS = 'id, display_name, profile_photo_url';

const MESSAGE_PAGE_SIZE = 30;
const MAX_BODY_LENGTH = 4000;

/**
 * Inbox list. list_my_conversations() returns newest-first summaries with the
 * other user's id, last message, and the caller's unread count; this stitches
 * profiles_public for display name / avatar in a single follow-up query (the same
 * pattern as marketplace attachSellers, because the FK points to profiles).
 */
export async function getConversations(): Promise<ConversationSummary[]> {
  const supabase = await createClient();

  const { data: rows, error } = await supabase.rpc('list_my_conversations');
  if (error || !rows || rows.length === 0) return [];

  const otherIds = [...new Set(rows.map((row) => row.other_user_id))];

  const { data: partners } = await supabase
    .from('profiles_public')
    .select(PARTNER_COLUMNS)
    .in('id', otherIds);

  const partnerById = new Map<string, ChatPartner>(
    (partners ?? []).map((partner) => [partner.id, partner as ChatPartner]),
  );

  return rows.map((row) => ({
    conversation_id: row.conversation_id,
    other_user_id: row.other_user_id,
    last_message_body: row.last_message_body,
    last_message_at: row.last_message_at,
    unread_count: row.unread_count,
    other_user: partnerById.get(row.other_user_id) ?? null,
  }));
}

export interface ConversationView {
  conversationId: string;
  otherUser: ChatPartner | null;
  initialMessages: Message[];
}

/**
 * Resolves the /messages/[userId] counterpart to a conversation (creating it once
 * via the start_conversation RPC), then loads the other user's public profile and
 * the most recent page of history. Returns an error string on self/blocked/invalid
 * targets rather than throwing, so the page can render a friendly state.
 */
export async function getOrCreateConversation(
  otherUserId: string,
): Promise<{ data: ConversationView | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not authenticated.' };

  const { data: conversationId, error: rpcError } = await supabase.rpc('start_conversation', {
    p_other: otherUserId,
  });
  if (rpcError || !conversationId) {
    return { data: null, error: rpcError?.message ?? 'Could not open this conversation.' };
  }

  const { data: otherUser } = await supabase
    .from('profiles_public')
    .select(PARTNER_COLUMNS)
    .eq('id', otherUserId)
    .maybeSingle();

  const initialMessages = await getMessages(conversationId);

  return {
    data: {
      conversationId,
      otherUser: (otherUser as ChatPartner | null) ?? null,
      initialMessages,
    },
    error: null,
  };
}

/**
 * Paginated history, returned oldest-first for rendering. Pass `before` (an ISO
 * created_at) to fetch the page immediately older than what is already loaded.
 * RLS scopes rows to conversations the caller belongs to.
 */
export async function getMessages(
  conversationId: string,
  before?: string,
): Promise<Message[]> {
  const supabase = await createClient();

  let query = supabase
    .from('messages')
    .select(MESSAGE_COLUMNS)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(MESSAGE_PAGE_SIZE);

  if (before) query = query.lt('created_at', before);

  const { data, error } = await query;
  if (error || !data) return [];

  // Fetched newest-first for the limit; the UI renders oldest-first.
  return (data as Message[]).reverse();
}

/**
 * Inserts a message. sender_id is taken from the session, never the client; the
 * RLS insert policy re-checks it against auth.uid() and conversation membership.
 * Returns the inserted row so the client can reconcile its optimistic entry.
 */
export async function sendMessage(
  conversationId: string,
  body: string,
): Promise<{ data: Message | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not authenticated.' };

  const trimmed = body.trim();
  if (trimmed.length < 1) return { data: null, error: 'Message cannot be empty.' };
  if (trimmed.length > MAX_BODY_LENGTH) {
    return { data: null, error: 'Message is too long.' };
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: user.id, body: trimmed })
    .select(MESSAGE_COLUMNS)
    .single();

  if (error || !data) return { data: null, error: error?.message ?? 'Could not send message.' };

  return { data: data as Message, error: null };
}

/** Advances the caller's read cursor for the conversation, clearing its unread count. */
export async function markRead(conversationId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc('mark_conversation_read', { p_conversation: conversationId });
}
