'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import type { School } from '@/app/(auth)/onboarding/actions';

const FIELD = 'w-full rounded-xl border border-nu-border bg-white px-4 py-3 text-sm text-nu-text placeholder-nu-dim shadow-sm ring-0 ring-nu-blue/20 transition-all duration-200 focus:border-nu-blue focus:outline-none focus:ring-2 focus:ring-nu-blue/20';
const LABEL = 'mb-2 block text-[11px] font-semibold uppercase tracking-widest text-nu-muted';

const getAcceptedUniversity = (email: string, schools: School[]) => {
  const domain = email.trim().toLowerCase().split('@')[1];
  if (!domain) return null;
  return schools.find((s) => s.domain === domain) ?? null;
};

export default function SignupForm({ schools }: { schools: School[] }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUniversities, setShowUniversities] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const captchaRef = useRef<TurnstileInstance>(null);

  // Deduplicate school names for the modal list
  const uniqueSchools = schools.filter(
    (s, i, arr) => arr.findIndex((x) => x.school_name === s.school_name) === i,
  );

  const resetCaptcha = () => {
    setCaptchaToken(null);
    setCaptchaError(false);
    captchaRef.current?.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const acceptedUniversity = getAcceptedUniversity(form.email, schools);

      if (!acceptedUniversity) {
        setError('Use an accepted school email.');
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          captchaToken: captchaToken!,
          data: {
            first_name: form.firstName,
            last_name: form.lastName,
            university: acceptedUniversity.school_name,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Email confirmation is disabled on the Supabase project, so signUp() auto-confirms
      // and returns a session immediately — the user is already signed in. Send them
      // straight to onboarding instead of /verify-email (which would wait for an OTP email
      // that is never sent). To re-enable email verification, turn on "Confirm email" in
      // Supabase Auth + configure custom SMTP, then route back to /verify-email here.
      window.location.href = '/onboarding';
    } finally {
      setLoading(false);
      resetCaptcha();
    }
  };

  return (
    <>
      <div className="flex h-full flex-col justify-center">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>First Name</label>
              <input
                className={FIELD}
                type="text"
                placeholder="John"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={LABEL}>Last Name</label>
              <input
                className={FIELD}
                type="text"
                placeholder="Doe"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className={LABEL}>Email</label>
            <input
              className={FIELD}
              type="email"
              placeholder="you@university.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className={LABEL}>Password</label>
            <input
              className={FIELD}
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* CAPTCHA */}
          <div className="flex flex-col items-center gap-2">
            <Turnstile
              ref={captchaRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={setCaptchaToken}
              onExpire={resetCaptcha}
              onError={() => { setCaptchaError(true); resetCaptcha(); }}
              options={{ theme: 'light', size: 'normal' }}
            />
            {captchaError && (
              <p className="text-center text-xs text-nu-coral">
                Security check failed.{' '}
                <button type="button" onClick={resetCaptcha} className="font-semibold underline">Retry</button>
              </p>
            )}
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full mt-1" loading={loading} disabled={loading || !captchaToken}>
            Create Account
          </Button>
        </form>

        <div className="mt-5 space-y-3 text-center text-sm text-nu-muted">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-nu-blue hover:text-nu-blue-dark transition-colors">
              Log in
            </Link>
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowUniversities(true)}
              className="font-semibold text-nu-blue transition-colors hover:text-nu-blue-dark"
            >
              Available schools
            </button>
            <span className="text-nu-dim">|</span>
            <span>
              School not listed?{' '}
              <Link href="/support-ticket" className="font-semibold text-nu-blue hover:text-nu-blue-dark transition-colors">
                Request
              </Link>
            </span>
          </div>
        </div>
      </div>

      {showUniversities && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="available-universities-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-nu-border bg-white p-5 shadow-card-md">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 id="available-universities-title" className="font-display text-lg font-bold text-nu-text">
                Available schools
              </h2>
              <button
                type="button"
                onClick={() => setShowUniversities(false)}
                className="text-sm font-semibold text-nu-blue transition-colors hover:text-nu-blue-dark"
                aria-label="Close available schools"
              >
                Close
              </button>
            </div>
            <ul className="space-y-1.5 text-sm text-nu-text">
              {uniqueSchools.map((s) => (
                <li key={s.school_name} className="border-b border-nu-border py-2 last:border-b-0">
                  <span className="block">{s.school_name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
