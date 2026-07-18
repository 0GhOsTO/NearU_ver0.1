import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import ParticipantAvatars from '@/components/group/ParticipantAvatars';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

const mockHangout = {
  id: '1',
  title: 'Boba Run @ Tiger Sugar',
  location: 'Tiger Sugar, U-Village, 2673 NE University Village St',
  date: 'Today, May 5',
  time: '4:00 PM',
  maxAttendees: 6,
  currentAttendees: 3,
  description: 'Craving boba? Come join! We\'ll meet at the entrance of U-Village at 3:55pm and walk over together. Any drink is fine, no pressure on what to order!',
  organizer: 'Sofia Reyes',
  participants: [
    { name: 'Sofia Reyes' },
    { name: 'Kevin Liu' },
    { name: 'Aisha Johnson' },
  ],
};

export default function HangoutDetailPage() {
  // TODO: wire up Supabase — fetch by params.id
  const h = mockHangout;

  return (
    <div>
      <PageHeader title="Hangout Details" backHref="/hangout" />

      <div className="space-y-5">
        <div className="rounded-2xl border border-nu-border bg-nu-surface p-5 ">
          <h2 className="text-xl font-bold text-nu-text mb-1">{h.title}</h2>
          <p className="text-sm text-nu-muted mb-4">Organized by {h.organizer}</p>

          <div className="space-y-2.5 text-sm text-nu-muted">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-nu-dim flex-shrink-0" />
              <span>{h.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-nu-dim" />
              <span>{h.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-nu-dim" />
              <span>{h.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-nu-dim" />
              <span>{h.currentAttendees}/{h.maxAttendees} going</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-nu-border bg-nu-surface p-4">
          <h3 className="text-sm font-semibold text-nu-muted mb-2">About</h3>
          <p className="text-sm text-nu-muted leading-relaxed">{h.description}</p>
        </div>

        <div className="rounded-2xl border border-nu-border bg-nu-surface p-4">
          <h3 className="text-sm font-semibold text-nu-muted mb-3">Going</h3>
          <ParticipantAvatars participants={h.participants} />
        </div>

        <Button variant="primary" size="lg" className="w-full">
          RSVP — I&apos;m In!
        </Button>
      </div>
    </div>
  );
}
