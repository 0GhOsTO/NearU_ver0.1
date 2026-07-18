import Link from 'next/link';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';

const items = [
  { id: '1', title: 'Aluminum Extension Ladder',   description: '16ft ladder, great for gutter cleaning or holiday lights.', type: 'lend'    as const, poster: 'George T.',  duration: 'Up to 3 days' },
  { id: '2', title: 'Dewalt Cordless Drill Kit',   description: 'Full kit with bits. Perfect for furniture assembly.',        type: 'lend'    as const, poster: 'Marcus C.',  duration: 'Weekend' },
  { id: '3', title: 'Coleman Camping Tent (4-person)', description: 'Looking to borrow a tent for a camping trip this weekend.', type: 'request' as const, poster: 'Alicia B.',  duration: '3 nights' },
  { id: '4', title: 'Portable Projector',          description: 'Have a 4K projector to lend. Great for movie nights!',      type: 'lend'    as const, poster: 'Dev P.',     duration: 'Up to 2 days' },
];

export default function BorrowPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Borrow & Lend" />
        <Link
          href="/borrow/new"
          className="flex items-center gap-1.5 rounded-xl bg-nu-blue px-4 py-2 text-sm font-semibold text-white hover:bg-nu-blue-dark transition-all"
        >
          <Plus className="h-4 w-4" />
          Post
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <Link key={item.id} href={`/borrow/${item.id}`}>
            <div className="group rounded-2xl border border-nu-border bg-nu-surface p-4 transition-all hover:border-nu-border/80 hover:bg-nu-elevated">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-nu-text group-hover:text-nu-blue transition-colors">{item.title}</h3>
                <Badge
                  label={item.type === 'lend' ? 'Offering' : 'Requesting'}
                  variant={item.type === 'lend' ? 'success' : 'warning'}
                />
              </div>
              <p className="text-sm text-nu-muted line-clamp-2">{item.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name={item.poster} size="sm" />
                  <span className="text-xs text-nu-muted">{item.poster}</span>
                </div>
                <span className="text-xs text-nu-dim">{item.duration}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
