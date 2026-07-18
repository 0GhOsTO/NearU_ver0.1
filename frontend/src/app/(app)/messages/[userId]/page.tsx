import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import ChatRoom from '@/components/messages/ChatRoom';
import { createClient } from '@/lib/supabase/server';
import { getOrCreateConversation } from '../actions';

export default async function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = user
    ? await getOrCreateConversation(userId)
    : { data: null, error: 'Not authenticated.' };

  if (!user || !data) {
    return (
      <div>
        <PageHeader title="Messages" backHref="/messages" />
        <div className="rounded-2xl border border-nu-border bg-nu-surface p-10 text-center shadow-card">
          <p className="font-display text-lg font-bold text-nu-text">
            Can&apos;t open this conversation
          </p>
          <p className="mt-1 text-sm text-nu-muted">
            {error ?? 'This user is unavailable.'}
          </p>
          <Link
            href="/messages"
            className="mt-4 inline-block rounded-xl bg-nu-blue px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-nu-blue-dark"
          >
            Back to messages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ChatRoom
      conversationId={data.conversationId}
      myId={user.id}
      otherUser={data.otherUser}
      initialMessages={data.initialMessages}
    />
  );
}
