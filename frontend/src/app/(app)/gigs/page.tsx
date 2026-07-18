import Link from 'next/link';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import GigCard from '@/components/gigs/GigCard';

const gigs = [
  { id: '1', title: 'Grocery run to Trader Joe\'s U-Village', distance: '0.3 mi', poster: 'Jamie Park', status: 'open' as const },
  { id: '2', title: 'Help move furniture up 2 flights of stairs', distance: '0.7 mi', poster: 'Lena Zhou', status: 'open' as const },
  { id: '3', title: 'Airport pickup from SEA-TAC (Sunday 9am)', distance: '14 mi', poster: 'Carlos R.', status: 'open' as const },
  { id: '4', title: 'IKEA run — need help loading a KALLAX shelf', distance: '4.2 mi', poster: 'Nadia B.', status: 'in_progress' as const },
];

export default function GigsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Gigs" />
        <Link
          href="/gigs/new"
          className="flex items-center gap-1.5 rounded-xl bg-nu-blue px-4 py-2 text-sm font-semibold text-white hover:bg-nu-blue-dark transition-all"
        >
          <Plus className="h-4 w-4" />
          Post Gig
        </Link>
      </div>
      <div className="space-y-4">
        {gigs.map((gig) => (
          <GigCard key={gig.id} {...gig} />
        ))}
      </div>
    </div>
  );
}
