import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import RatingStars from '@/components/profile/RatingStars';
import Avatar from '@/components/ui/Avatar';
import { MapPin, Package, Clock } from 'lucide-react';

const mockHolder = {
  id: '1',
  name: 'Rachel Kim',
  address: '4532 17th Ave NE, Unit 3, Seattle WA 98105',
  rating: 4.9,
  capacity: 5,
  currentLoad: 2,
  availabilityHours: '8am – 9pm daily',
  bio: 'Graduate student at UW. Home most of the day. Happy to help neighbors hold packages safely.',
};

export default function HolderDetailPage() {
  // TODO: wire up Supabase — fetch by params.id
  const holder = mockHolder;

  return (
    <div>
      <PageHeader title="Holder Profile" backHref="/safedrop" />

      <div className="space-y-5">
        <div className="rounded-2xl border border-nu-border bg-nu-surface p-5 ">
          <div className="flex items-center gap-4 mb-4">
            <Avatar name={holder.name} size="lg" />
            <div>
              <h2 className="text-xl font-bold text-nu-text">{holder.name}</h2>
              <RatingStars rating={holder.rating} showNumber />
            </div>
          </div>
          <p className="text-sm text-nu-muted">{holder.bio}</p>
        </div>

        <div className="rounded-2xl border border-nu-border bg-nu-surface p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-nu-muted">
            <MapPin className="h-4 w-4 text-nu-dim" />
            <span>{holder.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-nu-muted">
            <Package className="h-4 w-4 text-nu-dim" />
            <span>{holder.currentLoad} of {holder.capacity} slots used</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-nu-muted">
            <Clock className="h-4 w-4 text-nu-dim" />
            <span>{holder.availabilityHours}</span>
          </div>
        </div>

        <div className="rounded-xl bg-nu-blue/10 p-4">
          <span className="text-sm font-medium text-nu-blue">Coordinate package details in chat</span>
        </div>

        <Button variant="primary" size="lg" className="w-full">
          Message Holder
        </Button>
      </div>
    </div>
  );
}
