import PageHeader from '@/components/layout/PageHeader';
import { CheckCircle, MessageCircle, Calendar, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const notifications = [
  {
    id: '1',
    icon: CheckCircle,
    iconClass: 'bg-nu-mint/15 text-nu-mint',
    title: 'Gig Accepted',
    description: 'Carlos accepted your airport pickup gig.',
    time: '5 minutes ago',
    read: false,
  },
  {
    id: '2',
    icon: ShieldCheck,
    iconClass: 'bg-nu-blue/15 text-nu-blue',
    title: 'Meetup Confirmed',
    description: 'Jamie Park confirmed the grocery handoff details.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    icon: MessageCircle,
    iconClass: 'bg-sky-500/15 text-sky-400',
    title: 'New Message',
    description: 'Priya Sharma: "Is the textbook still available?"',
    time: 'Yesterday, 1:44 PM',
    read: true,
  },
  {
    id: '4',
    icon: Calendar,
    iconClass: 'bg-pink-500/15 text-pink-400',
    title: 'RSVP Confirmed',
    description: 'Your RSVP for "Boba Run @ Tiger Sugar" is confirmed.',
    time: 'Yesterday, 3:00 PM',
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader title="Notifications" />
      <div className="space-y-2">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className={cn(
                'flex items-start gap-4 rounded-2xl border p-4 transition-colors',
                n.read
                  ? 'border-nu-border bg-nu-surface'
                  : 'border-nu-blue/25 bg-nu-blue/5'
              )}
            >
              <div className={cn('rounded-xl p-2.5 flex-shrink-0', n.iconClass)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold', n.read ? 'text-nu-muted' : 'text-nu-text')}>
                  {n.title}
                </p>
                <p className="text-sm text-nu-muted mt-0.5">{n.description}</p>
                <p className="text-xs text-nu-dim mt-1">{n.time}</p>
              </div>
              {!n.read && (
                <div className="h-2 w-2 rounded-full bg-nu-blue mt-1.5 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
