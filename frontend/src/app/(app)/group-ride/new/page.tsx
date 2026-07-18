'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function NewGroupRidePage() {
  const [form, setForm] = useState({
    destination: '',
    date: '',
    time: '',
    maxRiders: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up Supabase
    alert('Ride created! (placeholder)');
  };

  return (
    <div>
      <PageHeader title="New Group Ride" backHref="/group-ride" />
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Destination"
          placeholder="e.g. IKEA Renton, Costco Kirkland"
          value={form.destination}
          onChange={(e) => setForm({ ...form, destination: e.target.value })}
          required
        />
        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <Input
          label="Departure Time"
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          required
        />
        <Input
          label="Max Riders (including you)"
          type="number"
          placeholder="e.g. 4"
          value={form.maxRiders}
          onChange={(e) => setForm({ ...form, maxRiders: e.target.value })}
          min="2"
          max="8"
          required
        />
        <Button type="submit" variant="primary" size="lg" className="w-full">
          Create Ride
        </Button>
      </form>
    </div>
  );
}
