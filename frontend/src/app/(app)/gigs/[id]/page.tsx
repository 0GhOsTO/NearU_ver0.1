import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import GigStatusBadge from '@/components/gigs/GigStatusBadge';
import Avatar from '@/components/ui/Avatar';
import { MapPin, Clock } from 'lucide-react';

const mockGig = {
  id: '1',
  title: 'Grocery run to Trader Joe\'s U-Village',
  description: 'I need someone to pick up a short list of groceries from Trader Joe\'s at U-Village. The list has about 8-10 items. I\'ll send the list via chat and coordinate details there.',
  location: 'U-Village Trader Joe\'s → McMahon Hall',
  deadline: 'Today by 6pm',
  poster: { name: 'Jamie Park', memberSince: 'Sep 2023', rating: 4.8 },
  status: 'open' as const,
  distance: '0.3 mi',
};

export default function GigDetailPage() {
  // TODO: wire up Supabase — fetch by params.id
  const gig = mockGig;

  return (
    <div>
      <PageHeader title="Gig Details" backHref="/gigs" />

      <div className="space-y-5">
        <div className="rounded-2xl border border-nu-border bg-nu-surface p-5 ">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-xl font-bold text-nu-text">{gig.title}</h2>
            <GigStatusBadge status={gig.status} />
          </div>
          <div className="space-y-2 text-sm text-nu-muted">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-nu-dim flex-shrink-0" />
              <span>{gig.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-nu-dim flex-shrink-0" />
              <span>Due: {gig.deadline}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-nu-border bg-nu-surface p-4">
          <h3 className="text-sm font-semibold text-nu-muted mb-2">Description</h3>
          <p className="text-sm text-nu-muted leading-relaxed">{gig.description}</p>
        </div>

        <div className="rounded-2xl border border-nu-border bg-nu-surface p-4">
          <h3 className="text-sm font-semibold text-nu-muted mb-3">Posted by</h3>
          <div className="flex items-center gap-3">
            <Avatar name={gig.poster.name} size="md" />
            <div>
              <p className="font-medium text-nu-text">{gig.poster.name}</p>
              <p className="text-xs text-nu-muted">Member since {gig.poster.memberSince} · ⭐ {gig.poster.rating}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="primary" size="lg" className="flex-1">
            Accept Gig
          </Button>
          <Button variant="secondary" size="lg" className="flex-1" href="/messages/poster">
            Message
          </Button>
        </div>
      </div>
    </div>
  );
}
