'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function NewHolderPage() {
  const [form, setForm] = useState({
    address: '',
    maxPackages: '',
    availabilityHours: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up Supabase
    alert('Registered as holder! (placeholder)');
  };

  return (
    <div>
      <PageHeader title="Become a Holder" backHref="/safedrop" />
      <p className="text-sm text-nu-muted mb-6">Help trusted neighbors coordinate package holds while they&apos;re away.</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Pickup Address"
          placeholder="e.g. 4532 17th Ave NE, Unit 3"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
        <Input
          label="Max Packages at a Time"
          type="number"
          placeholder="e.g. 5"
          value={form.maxPackages}
          onChange={(e) => setForm({ ...form, maxPackages: e.target.value })}
          min="1"
          required
        />
        <Input
          label="Availability Hours"
          placeholder="e.g. 9am–8pm daily, Mon–Fri 8am–6pm"
          value={form.availabilityHours}
          onChange={(e) => setForm({ ...form, availabilityHours: e.target.value })}
          required
        />
        <Button type="submit" variant="primary" size="lg" className="w-full">
          Register as Holder
        </Button>
      </form>
    </div>
  );
}
