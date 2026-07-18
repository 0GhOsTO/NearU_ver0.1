import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  content: string;
  isMine: boolean;
  timestamp: string;
}

export default function MessageBubble({ content, isMine, timestamp }: MessageBubbleProps) {
  return (
    <div className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
      <div className="max-w-xs lg:max-w-md">
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm',
            isMine
              ? 'bg-nu-blue text-white font-medium rounded-br-md'
              : 'bg-nu-elevated text-nu-text border border-nu-border rounded-bl-md'
          )}
        >
          {content}
        </div>
        <p className={cn('mt-1 text-xs text-nu-dim', isMine ? 'text-right' : 'text-left')}>
          {timestamp}
        </p>
      </div>
    </div>
  );
}
