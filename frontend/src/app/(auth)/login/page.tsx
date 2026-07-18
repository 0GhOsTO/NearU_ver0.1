'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const captchaRef = useRef<TurnstileInstance>(null);

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
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
        options: { captchaToken: captchaToken! },
      });

      if (error) {
        setError(error.message);
        return;
      }

      window.location.href = '/feed';
    } finally {
      setLoading(false);
      resetCaptcha();
    }
  };

  return (
    <div className="flex h-full flex-col justify-center">
      <h1 className="mb-1 text-center font-display text-2xl font-bold text-nu-text">Welcome back</h1>
      <p className="mb-5 text-center text-sm text-nu-muted">Sign in to your neighborhood.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@university.edu"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
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
          <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" size="lg" className="w-full mt-2" loading={loading} disabled={loading || !captchaToken}>
          Log in
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-nu-muted">
        New here?{' '}
        <Link href="/signup" className="font-semibold text-nu-blue hover:text-nu-blue-dark transition-colors">
          Create an account
        </Link>
      </p>
    </div>
  );
}
