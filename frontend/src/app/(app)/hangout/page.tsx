import Link from 'next/link';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import GroupCard from '@/components/group/GroupCard';

const hangouts = [
  { id: '1', title: 'Boba Run @ Tiger Sugar', destination: 'Tiger Sugar, U-Village', date: 'Today', time: '4:00 PM', maxPeople: 6, currentPeople: 3, type: 'hangout' as const },
  { id: '2', title: 'Study Group — CHEM 142', destination: 'Odegaard Library, 3rd Floor', date: 'Thu, May 8', time: '6:00 PM', maxPeople: 5, currentPeople: 4, type: 'hangout' as const },
  { id: '3', title: 'Board Games Night', destination: 'Lander Hall Lounge', date: 'Fri, May 9', time: '7:30 PM', maxPeople: 8, currentPeople: 5, type: 'hangout' as const },
];

export default function HangoutPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Hangouts" />
        <Link
          href="/hangout/new"
          className="flex items-center gap-1.5 rounded-xl bg-nu-blue px-4 py-2 text-sm font-medium text-white hover:bg-nu-blue-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Plan Hangout
        </Link>
      </div>
      <div className="space-y-4">
        {hangouts.map((h) => (
          <GroupCard key={h.id} {...h} />
        ))}
      </div>
    </div>
  );
}
