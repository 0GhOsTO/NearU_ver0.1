import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import ParticipantAvatars from '@/components/group/ParticipantAvatars';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

const mockRide = {
  id: '1',
  title: 'IKEA Renton Run',
  destination: 'IKEA Renton, 601 SW 41st St, Renton, WA',
  date: 'Saturday, May 10',
  time: '11:00 AM',
  maxPeople: 4,
  currentPeople: 2,
  organizer: 'Tommy Lee',
  participants: [
    { name: 'Tommy Lee' },
    { name: 'Zoe Park' },
  ],
};

export default function RideDetailPage() {
  // TODO: wire up Supabase — fetch by params.id
  const ride = mockRide;

  return (
    <div>
      <PageHeader title="Ride Details" backHref="/group-ride" />

      <div className="space-y-5">
        <div className="rounded-2xl border border-nu-border bg-nu-surface p-5 ">
          <h2 className="text-xl font-bold text-nu-text mb-1">{ride.title}</h2>
          <p className="text-sm text-nu-muted mb-4">Organized by {ride.organizer}</p>

          <div className="space-y-2.5 text-sm text-nu-muted">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-nu-dim flex-shrink-0" />
              <span>{ride.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-nu-dim" />
              <span>{ride.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-nu-dim" />
              <span>{ride.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-nu-dim" />
              <span>{ride.currentPeople}/{ride.maxPeople} riders</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-nu-blue/10 p-4">
          <span className="text-sm font-medium text-nu-blue">Coordinate ride details in chat</span>
        </div>

        <div className="rounded-2xl border border-nu-border bg-nu-surface p-4">
          <h3 className="text-sm font-semibold text-nu-muted mb-3">Riders so far</h3>
          <ParticipantAvatars participants={ride.participants} />
        </div>

        <Button variant="primary" size="lg" className="w-full">
          Join Ride
        </Button>
      </div>
    </div>
  );
}
