'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import MessageBubble from '@/components/messages/MessageBubble';
import ChatInput from '@/components/messages/ChatInput';
import { useMessages } from '@/hooks/useMessages';
import { markRead } from '@/app/(app)/messages/actions';
import type { ChatPartner, Message } from '@/types';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function ChatRoom({
  conversationId,
  myId,
  otherUser,
  initialMessages,
}: {
  conversationId: string;
  myId: string;
  otherUser: ChatPartner | null;
  initialMessages: Message[];
}) {
  const router = useRouter();
  const { messages, send } = useMessages(conversationId, myId, initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const name = otherUser?.display_name ?? 'NearU member';

  // Mark read on open and whenever a new message arrives while the thread is open.
  useEffect(() => {
    markRead(conversationId);
  }, [conversationId, messages.length]);

  // Keep the latest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col -mx-4 -my-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-nu-border bg-nu-surface px-4 py-3">
        <button
          onClick={() => router.push('/messages')}
          className="rounded-xl p-1.5 text-nu-dim hover:bg-nu-elevated"
          aria-label="Back to messages"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar src={otherUser?.profile_photo_url} name={name} size="sm" />
        <p className="text-sm font-semibold text-nu-text">{name}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            content={msg.body}
            isMine={msg.sender_id === myId}
            timestamp={msg.failed ? 'Failed to send' : formatTime(msg.created_at)}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={send} />
    </div>
  );
}
