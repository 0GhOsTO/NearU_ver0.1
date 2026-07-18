import PageHeader from '@/components/layout/PageHeader';
import GigForm from '@/components/gigs/GigForm';

export default function NewGigPage() {
  return (
    <div>
      <PageHeader title="Post a Gig" backHref="/gigs" />
      <GigForm />
    </div>
  );
}
