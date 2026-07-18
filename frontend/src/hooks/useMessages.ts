'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { sendMessage } from '@/app/(app)/messages/actions';
import type { Message } from '@/types';

/** A message plus client-only delivery state for optimistic sends. */
export type ChatMessage = Message & { pending?: boolean; failed?: boolean };

function sortByCreated(list: ChatMessage[]): ChatMessage[] {
  return [...list].sort((a, b) => a.created_at.localeCompare(b.created_at));
}

/**
 * Live chat state for one conversation.
 *
 * The durable history is loaded server-side and passed in as `initialMessages`,
 * so a dropped realtime event never loses data — the table is the source of truth.
 * On top of that we subscribe to Realtime INSERTs (scoped to this conversation,
 * and further scoped by RLS) for the recipient's live updates, and append the
 * sender's own message optimistically so it appears with no perceived latency.
 */
export function useMessages(
  conversationId: string,
  myId: string,
  initialMessages: Message[],
) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    sortByCreated(initialMessages),
  );

  // Re-seed when navigating between conversations without a full remount. This is
  // the React-recommended "adjust state during render" pattern, not an effect.
  const [seededFor, setSeededFor] = useState(conversationId);
  if (seededFor !== conversationId) {
    setSeededFor(conversationId);
    setMessages(sortByCreated(initialMessages));
  }

  // Adds a row unless one with the same id is already present (dedupes the
  // sender's own realtime echo against the reconciled optimistic row).
  const upsert = useCallback((row: ChatMessage) => {
    setMessages((prev) =>
      prev.some((m) => m.id === row.id) ? prev : sortByCreated([...prev, row]),
    );
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => upsert(payload.new as Message),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, upsert]);

  const send = useCallback(
    async (body: string) => {
      const text = body.trim();
      if (!text) return;

      const tempId = `temp-${crypto.randomUUID()}`;
      const optimistic: ChatMessage = {
        id: tempId,
        conversation_id: conversationId,
        sender_id: myId,
        body: text,
        created_at: new Date().toISOString(),
        pending: true,
      };
      setMessages((prev) => sortByCreated([...prev, optimistic]));

      const { data, error } = await sendMessage(conversationId, text);

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempId);
        if (error || !data) {
          return sortByCreated([...withoutTemp, { ...optimistic, pending: false, failed: true }]);
        }
        // Realtime may have already delivered the real row; avoid a duplicate.
        if (withoutTemp.some((m) => m.id === data.id)) return withoutTemp;
        return sortByCreated([...withoutTemp, data]);
      });
    },
    [conversationId, myId],
  );

  return { messages, send };
}
