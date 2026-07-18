'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function GigForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    deadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up Supabase
    alert('Gig posted! (placeholder)');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Gig Title"
        placeholder="e.g. Help me move furniture to 2nd floor"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-nu-muted">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe what you need done..."
          rows={4}
          className="w-full rounded-xl border border-nu-border bg-nu-surface px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
          required
        />
      </div>

      <Input
        label="Location"
        placeholder="e.g. McMahon Hall, UW Campus"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        required
      />

      <Input
        label="Deadline"
        type="datetime-local"
        value={form.deadline}
        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        required
      />

      <Button type="submit" variant="primary" size="lg" className="w-full">
        Post Gig
      </Button>
    </form>
  );
}
