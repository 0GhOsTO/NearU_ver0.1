'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

const FIELD = 'w-full rounded-xl border border-nu-border bg-white px-4 py-3 text-sm text-nu-text placeholder-nu-dim shadow-sm ring-0 ring-nu-blue/20 transition-all duration-200 focus:border-nu-blue focus:outline-none focus:ring-2 focus:ring-nu-blue/20';
const LABEL = 'mb-2 block text-[11px] font-semibold uppercase tracking-widest text-nu-muted';

export default function SupportTicketPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    school: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/support-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'Could not send request.');
        return;
      }

      setForm({ name: '', email: '', school: '', message: '' });
      setSuccess(data.message ?? 'Request sent.');
    } catch {
      setError('Could not send request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-nu-bg px-4 py-10"
      style={{ backgroundImage: 'radial-gradient(ellipse at 60% 0%, #EFF6FF 0%, transparent 60%), radial-gradient(ellipse at 10% 90%, #F0FDF4 0%, transparent 50%)' }}
    >
      {/* Top nav */}
      <div className="mx-auto mb-8 flex max-w-lg items-center justify-between">
        <Link
          href="/signup"
          className="flex items-center gap-1.5 text-sm font-semibold text-nu-muted transition-colors hover:text-nu-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign up
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-nu-blue shadow-blue">
            <MapPin className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold text-nu-text tracking-tight">NearU</span>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-lg">
        <div className="mb-7">
          <h1 className="mb-1.5 font-display text-3xl font-bold text-nu-text">Request school access</h1>
          <p className="text-sm text-nu-muted">
            Don&apos;t see your school? Fill out this form and we&apos;ll add it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={LABEL}>Name</label>
              <input
                className={FIELD}
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className={LABEL}>School email</label>
            <input
              className={FIELD}
              type="email"
              placeholder="you@school.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className={LABEL}>School name</label>
            <input
              className={FIELD}
              type="text"
              placeholder="e.g. MIT"
              value={form.school}
              onChange={(e) => setForm({ ...form, school: e.target.value })}
              required
            />
          </div>

          <div>
            <label className={LABEL}>Message</label>
            <textarea
              placeholder="Anything else we should know?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`${FIELD} min-h-[110px] resize-none`}
              required
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
          )}
          {success && (
            <p className="rounded-xl bg-green-50 px-4 py-2.5 text-sm text-green-700">{success}</p>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
            Send request
          </Button>
        </form>
      </div>
    </div>
  );
}
