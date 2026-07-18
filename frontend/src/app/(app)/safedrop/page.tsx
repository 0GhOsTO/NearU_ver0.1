import Link from 'next/link';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import HolderMap from '@/components/safedrop/HolderMap';
import HolderCard from '@/components/safedrop/HolderCard';

const holders = [
  { id: '1', name: 'Rachel Kim', address: '4532 17th Ave NE, Unit 3', rating: 4.9, capacity: 5 },
  { id: '2', name: 'Tom Nguyen', address: '1420 NE 45th St, Apt 12', rating: 4.7, capacity: 3 },
  { id: '3', name: 'Maya Patel', address: 'McMahon Hall, Room 214', rating: 5.0, capacity: 10 },
];

export default function SafeDropPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="SafeDrop" />
        <Link
          href="/safedrop/new"
          className="flex items-center gap-1.5 rounded-xl bg-nu-blue px-4 py-2 text-sm font-medium text-white hover:bg-nu-blue-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Become a Holder
        </Link>
      </div>
      <p className="text-nu-muted text-sm mb-5">Find a Package Holder Near You</p>
      <HolderMap />
      <h3 className="mt-6 mb-4 font-semibold text-nu-text">Available Holders</h3>
      <div className="space-y-4">
        {holders.map((h) => (
          <HolderCard key={h.id} {...h} />
        ))}
      </div>
    </div>
  );
}
