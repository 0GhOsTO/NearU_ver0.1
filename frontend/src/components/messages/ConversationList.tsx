import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

interface Conversation {
  userId: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
}

interface ConversationListProps {
  conversations: Conversation[];
}

export default function ConversationList({ conversations }: ConversationListProps) {
  return (
    <div className="divide-y divide-nu-border/40">
      {conversations.map((conv) => (
        <Link key={conv.userId} href={`/messages/${conv.userId}`}>
          <div className="flex items-center gap-3 px-0 py-3.5 hover:bg-nu-elevated rounded-xl transition-colors">
            <Avatar src={conv.avatar} name={conv.name} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={cn('text-sm', conv.unread > 0 ? 'font-semibold text-nu-text' : 'font-medium text-nu-muted')}>
                  {conv.name}
                </span>
                <span className="text-xs text-nu-dim flex-shrink-0">{conv.timestamp}</span>
              </div>
              <p className={cn('text-sm truncate mt-0.5', conv.unread > 0 ? 'text-nu-muted' : 'text-nu-dim')}>
                {conv.lastMessage}
              </p>
            </div>
            {conv.unread > 0 && (
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-nu-blue flex items-center justify-center">
                <span className="text-xs text-white font-bold">{conv.unread}</span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
