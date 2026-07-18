'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { formatRelativeTime } from '@/lib/utils';
import ConversationList from './ConversationList';
import type { ConversationSummary, Message } from '@/types';

/**
 * Inbox list with live updates. The initial summaries are server-rendered; this
 * subscribes to message INSERTs (RLS delivers only rows from the viewer's own
 * conversations, so no client-side filtering is needed) to move the affected
 * thread to the top, refresh its preview, and bump its unread count in place.
 * Reads clear on the next server fetch when the viewer returns to the inbox.
 */
export default function ConversationListClient({
  initial,
  myId,
}: {
  initial: ConversationSummary[];
  myId: string;
}) {
  const [items, setItems] = useState<ConversationSummary[]>(initial);
  const router = useRouter();

  // When the server refetches (e.g. after router.refresh()), `initial` is a fresh
  // reference — adopt it, discarding local realtime patches. Render-phase reset,
  // not an effect, so it stays in sync without a cascading render.
  const [seenInitial, setSeenInitial] = useState(initial);
  if (seenInitial !== initial) {
    setSeenInitial(initial);
    setItems(initial);
  }

  useEffect(() => {
    const channel = supabase
      .channel('inbox')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new as Message;
          setItems((prev) => {
            const idx = prev.findIndex((c) => c.conversation_id === msg.conversation_id);
            // A message for a conversation not yet in the list (e.g. someone
            // messaging the viewer for the first time): re-fetch from the server.
            if (idx === -1) {
              router.refresh();
              return prev;
            }
            const conv = prev[idx];
            const updated: ConversationSummary = {
              ...conv,
              last_message_body: msg.body,
              last_message_at: msg.created_at,
              unread_count:
                msg.sender_id === myId ? conv.unread_count : conv.unread_count + 1,
            };
            return [updated, ...prev.filter((_, i) => i !== idx)];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [myId, router]);

  const conversations = items.map((c) => ({
    userId: c.other_user_id,
    name: c.other_user?.display_name ?? 'NearU member',
    avatar: c.other_user?.profile_photo_url ?? undefined,
    lastMessage: c.last_message_body,
    timestamp: formatRelativeTime(new Date(c.last_message_at)),
    unread: c.unread_count,
  }));

  return <ConversationList conversations={conversations} />;
}
