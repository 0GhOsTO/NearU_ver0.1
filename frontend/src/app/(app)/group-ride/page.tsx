import Link from 'next/link';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import GroupCard from '@/components/group/GroupCard';

const rides = [
  { id: '1', title: 'IKEA Renton Run', destination: 'IKEA Renton', date: 'Sat, May 10', time: '11:00 AM', maxPeople: 4, currentPeople: 2, type: 'ride' as const },
  { id: '2', title: 'Costco Kirkland Trip', destination: 'Costco Kirkland', date: 'Sun, May 11', time: '2:00 PM', maxPeople: 4, currentPeople: 3, type: 'ride' as const },
  { id: '3', title: 'Airport Drop-off (SEA-TAC)', destination: 'Seattle-Tacoma International Airport', date: 'Fri, May 9', time: '5:30 AM', maxPeople: 3, currentPeople: 1, type: 'ride' as const },
];

export default function GroupRidePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Group Rides" />
        <Link
          href="/group-ride/new"
          className="flex items-center gap-1.5 rounded-xl bg-nu-blue px-4 py-2 text-sm font-medium text-white hover:bg-nu-blue-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Ride
        </Link>
      </div>
      <div className="space-y-4">
        {rides.map((ride) => (
          <GroupCard key={ride.id} {...ride} />
        ))}
      </div>
    </div>
  );
}
