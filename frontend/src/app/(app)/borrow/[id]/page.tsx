import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';

const mockItem = {
  id: '1',
  title: 'Aluminum Extension Ladder',
  description: '16ft Werner aluminum ladder. Great condition. Can hold up to 250 lbs. Perfect for gutter cleaning, painting, or hanging holiday lights. Please return the same day unless we agree otherwise.',
  type: 'lend' as const,
  availability: 'Weekends and after 6pm on weekdays',
  duration: 'Up to 3 days',
  poster: { name: 'George T.', memberSince: 'Jan 2024', rating: 4.7 },
};

export default function BorrowDetailPage() {
  // TODO: wire up Supabase — fetch by params.id
  const item = mockItem;

  return (
    <div>
      <PageHeader title="Item Details" backHref="/borrow" />

      {/* Image placeholder */}
      <div className="aspect-video w-full rounded-2xl bg-nu-elevated flex items-center justify-center mb-6">
        <span className="text-6xl">🪜</span>
      </div>

      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold text-nu-text">{item.title}</h2>
          <Badge
            label={item.type === 'lend' ? 'Available to Borrow' : 'Wanted to Borrow'}
            variant={item.type === 'lend' ? 'success' : 'warning'}
          />
        </div>

        <div className="rounded-2xl border border-nu-border bg-nu-surface p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-nu-muted uppercase tracking-wide">Description</p>
            <p className="mt-1 text-sm text-nu-muted leading-relaxed">{item.description}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-nu-muted uppercase tracking-wide">Availability</p>
            <p className="mt-1 text-sm text-nu-muted">{item.availability}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-nu-muted uppercase tracking-wide">Max Duration</p>
            <p className="mt-1 text-sm text-nu-muted">{item.duration}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-nu-border bg-nu-surface p-4">
          <h3 className="text-sm font-semibold text-nu-muted mb-3">Owner</h3>
          <div className="flex items-center gap-3">
            <Avatar name={item.poster.name} size="md" />
            <div>
              <p className="font-medium text-nu-text">{item.poster.name}</p>
              <p className="text-xs text-nu-muted">Member since {item.poster.memberSince} · ⭐ {item.poster.rating}</p>
            </div>
          </div>
        </div>

        <Button variant="primary" size="lg" className="w-full">
          Request to Borrow
        </Button>
      </div>
    </div>
  );
}
