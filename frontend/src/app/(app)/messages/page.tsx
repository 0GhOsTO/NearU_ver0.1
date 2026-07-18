import { MessageCircle } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import ConversationListClient from '@/components/messages/ConversationListClient';
import { createClient } from '@/lib/supabase/server';
import { getConversations } from './actions';

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const conversations = user ? await getConversations() : [];

  return (
    <div>
      <PageHeader title="Messages" />

      {conversations.length === 0 ? (
        <div className="rounded-2xl border border-nu-border bg-nu-surface p-10 text-center shadow-card">
          <MessageCircle className="mx-auto h-8 w-8 text-nu-dim" />
          <p className="mt-3 font-display text-lg font-bold text-nu-text">No messages yet</p>
          <p className="mt-1 text-sm text-nu-muted">
            Start a conversation from a listing or someone&apos;s profile.
          </p>
        </div>
      ) : (
        <ConversationListClient initial={conversations} myId={user!.id} />
      )}
    </div>
  );
}
