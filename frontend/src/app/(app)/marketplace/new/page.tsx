import PageHeader from '@/components/layout/PageHeader';
import ListingForm from '@/components/marketplace/ListingForm';

export default function NewListingPage() {
  return (
    <div>
      <PageHeader title="New Listing" backHref="/marketplace" />
      <ListingForm />
    </div>
  );
}
