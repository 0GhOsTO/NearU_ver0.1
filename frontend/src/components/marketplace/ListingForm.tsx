'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createListing } from '@/app/(app)/marketplace/actions';
import type { ListingCategory, ListingCondition } from '@/types';
import { ImagePlus } from 'lucide-react';

const SELECT_CLASS =
  'w-full rounded-xl border border-nu-border bg-nu-surface px-4 py-2.5 text-sm text-nu-text focus:border-nu-blue/60 focus:outline-none focus:ring-2 focus:ring-nu-blue/20';

export default function ListingForm() {
  const [form, setForm] = useState({
    title: '',
    category: '' as ListingCategory | '',
    price: '',
    condition: '' as ListingCondition | '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.condition) return;

    setSubmitting(true);
    setError('');

    try {
      // On success createListing redirects to /marketplace, so nothing is
      // returned; only a failure resolves with an error message.
      const result = await createListing({
        title: form.title,
        description: form.description,
        category: form.category,
        condition: form.condition,
        price: Number(form.price),
      });

      if (result?.error) {
        setError(result.error);
        setSubmitting(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not post your listing.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Title"
        placeholder="e.g. Used Calculus Textbook"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-nu-muted">Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as ListingCategory })}
          className={SELECT_CLASS}
          required
        >
          <option value="">Select a category</option>
          <option value="textbooks">Textbooks</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
          <option value="sports">Sports &amp; Outdoors</option>
          <option value="other">Other</option>
        </select>
      </div>

      <Input
        label="Price"
        type="number"
        placeholder="0.00"
        prefix="$"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        min="0"
        step="0.01"
        required
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-nu-muted">Condition</label>
        <select
          value={form.condition}
          onChange={(e) => setForm({ ...form, condition: e.target.value as ListingCondition })}
          className={SELECT_CLASS}
          required
        >
          <option value="">Select condition</option>
          <option value="new">New</option>
          <option value="like_new">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-nu-muted">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe your item..."
          rows={4}
          maxLength={2000}
          className="w-full resize-none rounded-xl border border-nu-border bg-nu-surface px-4 py-2.5 text-sm text-nu-text focus:border-nu-blue/60 focus:outline-none focus:ring-2 focus:ring-nu-blue/20"
          required
        />
      </div>

      {/* TODO: wire up Supabase Storage — listing photos need their own bucket
          (the avatars bucket is owner-scoped to profile images). */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-nu-muted">Photos</label>
        <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-nu-border bg-nu-elevated">
          <div className="text-center">
            <ImagePlus className="mx-auto h-8 w-8 text-nu-dim" />
            <p className="mt-1 text-sm text-nu-muted">Photo upload coming soon</p>
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" loading={submitting}>
        Post Listing
      </Button>
    </form>
  );
}
