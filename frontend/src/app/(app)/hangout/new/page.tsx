'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function NewHangoutPage() {
  const [form, setForm] = useState({
    eventName: '',
    location: '',
    date: '',
    time: '',
    maxAttendees: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up Supabase
    alert('Hangout created! (placeholder)');
  };

  return (
    <div>
      <PageHeader title="Plan a Hangout" backHref="/hangout" />
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Event Name"
          placeholder="e.g. Boba Run, Study Group, Game Night"
          value={form.eventName}
          onChange={(e) => setForm({ ...form, eventName: e.target.value })}
          required
        />
        <Input
          label="Location"
          placeholder="e.g. Tiger Sugar, Odegaard Library"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <Input
            label="Time"
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            required
          />
        </div>
        <Input
          label="Max Attendees"
          type="number"
          placeholder="e.g. 8"
          value={form.maxAttendees}
          onChange={(e) => setForm({ ...form, maxAttendees: e.target.value })}
          min="2"
          required
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-nu-muted">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Tell people what to expect..."
            rows={3}
            className="w-full rounded-xl border border-nu-border bg-nu-surface px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full">
          Create Hangout
        </Button>
      </form>
    </div>
  );
}
