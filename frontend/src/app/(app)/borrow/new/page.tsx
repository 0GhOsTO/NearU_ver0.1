'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function NewBorrowPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    availability: '',
    duration: '',
    type: 'lend' as 'lend' | 'request',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up Supabase
    alert('Post submitted! (placeholder)');
  };

  return (
    <div>
      <PageHeader title="Borrow / Lend Post" backHref="/borrow" />
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Toggle */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-nu-muted">I want to...</label>
          <div className="flex rounded-xl border border-nu-border overflow-hidden">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'lend' })}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${form.type === 'lend' ? 'bg-nu-blue text-nu-bg' : 'text-nu-muted hover:bg-nu-elevated'}`}
            >
              Lend an item
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'request' })}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${form.type === 'request' ? 'bg-nu-blue text-nu-bg' : 'text-nu-muted hover:bg-nu-elevated'}`}
            >
              Request to borrow
            </button>
          </div>
        </div>

        <Input
          label="Item Name"
          placeholder="e.g. Electric Drill, Camping Tent"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-nu-muted">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the item and any conditions for borrowing..."
            rows={3}
            className="w-full rounded-xl border border-nu-border bg-nu-surface px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />
        </div>

        <Input
          label="Availability"
          placeholder="e.g. Weekends, Weekday evenings"
          value={form.availability}
          onChange={(e) => setForm({ ...form, availability: e.target.value })}
          required
        />

        <Input
          label="Max Borrow Duration"
          placeholder="e.g. Up to 3 days, Weekend only"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          required
        />

        <Button type="submit" variant="primary" size="lg" className="w-full">
          {form.type === 'lend' ? 'Post Item to Lend' : 'Post Borrow Request'}
        </Button>
      </form>
    </div>
  );
}
