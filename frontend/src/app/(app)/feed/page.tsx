import FeedCard from '@/components/feed/FeedCard';
import FeedFilter from '@/components/feed/FeedFilter';
import { MapPin } from 'lucide-react';

const mockFeed = [
  {
    id: '1',
    type: 'gig' as const,
    title: 'Grocery run to Trader Joe\'s',
    description: 'Need someone to grab a short list of groceries from the U-Village Trader Joe\'s. I can share the list in chat.',
    user: 'Jamie Park',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'marketplace' as const,
    title: 'MATH 126 Textbook — Stewart Calculus 9th Ed',
    description: 'Barely used, great condition. Perfect for anyone in MATH 126 this quarter.',
    user: 'Priya Sharma',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    price: 45,
  },
  {
    id: '3',
    type: 'borrow' as const,
    title: 'Offering: Power Drill (18V)',
    description: 'Happy to lend my Dewalt drill for weekend projects. Just return it in good condition!',
    user: 'Marcus Chen',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'hangout' as const,
    title: 'Boba run to Tiger Sugar',
    description: 'Heading to Tiger Sugar around 4pm today. Come join! The more the merrier.',
    user: 'Sofia Reyes',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

export default function FeedPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-nu-text">Nearby Activity</h1>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-nu-muted">
          <MapPin className="h-3.5 w-3.5 text-nu-blue" />
          <span>University District · {mockFeed.length} recent posts</span>
        </div>
      </div>
      <div className="mb-5">
        <FeedFilter />
      </div>
      <div className="space-y-3">
        {mockFeed.map((item) => (
          <FeedCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
