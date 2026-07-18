'use client';

import { useRef, useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { Mail } from 'lucide-react';

const OTP_BOX = 'aspect-square w-full rounded-xl border border-nu-border bg-white text-center text-2xl font-semibold text-nu-text shadow-sm ring-0 ring-nu-blue/20 transition-all duration-200 focus:border-nu-blue focus:outline-none focus:ring-2 focus:ring-nu-blue/20';

function VerifyEmailContent() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const token = code.join('');

  useEffect(() => {
    // Email confirmation is currently disabled on the Supabase project, so anyone who
    // reaches this page is already signed in — don't trap them waiting for an OTP that
    // was never sent; move them forward. When "Confirm email" is re-enabled (option A),
    // a freshly-signed-up user has NO session yet, so this guard becomes a no-op and the
    // OTP form below shows normally.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/onboarding');
    });
  }, [router]);

  const updateCode = (nextCode: string[]) => {
    setCode(nextCode);
    setError('');
    setMessage('');
  };

  const handleCodeChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);

    if (!digits) {
      const nextCode = [...code];
      nextCode[index] = '';
      updateCode(nextCode);
      return;
    }

    const nextCode = [...code];
    digits.split('').forEach((digit, offset) => {
      if (index + offset < nextCode.length) {
        nextCode[index + offset] = digit;
      }
    });

    updateCode(nextCode);
    const nextIndex = Math.min(index + digits.length, inputRefs.current.length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (/^\d$/.test(e.key)) {
      e.preventDefault();

      const nextCode = [...code];
      nextCode[index] = e.key;
      updateCode(nextCode);

      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      return;
    }

    if (e.key === 'Backspace') {
      if (code[index]) {
        const nextCode = [...code];
        nextCode[index] = '';
        updateCode(nextCode);
        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      });

      if (error) {
        setError(error!.message);
        return;
      }

      window.location.href = '/onboarding';
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage('A new code was sent to your email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="flex h-full flex-col items-center justify-center gap-6">
      {/* Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-nu-blue-light">
        <Mail className="h-9 w-9 text-nu-blue" strokeWidth={1.5} />
      </div>

      {/* Header */}
      <div className="text-center">
        <h1 className="mb-1.5 font-display text-2xl font-bold text-nu-text">We sent you a code!</h1>
        <p className="text-sm text-nu-muted">
          Enter the 6-digit code we sent to{' '}
          <span className="font-semibold text-nu-text">{email || 'your email'}</span>.
        </p>
      </div>

      {/* OTP */}
      <div className="w-full">
        <div className="grid grid-cols-6 gap-3">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(node) => { inputRefs.current[index] = node; }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              aria-label={`Verification code digit ${index + 1}`}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleCodeKeyDown(index, e)}
              onFocus={(e) => e.target.select()}
              maxLength={1}
              className={OTP_BOX}
              required
            />
          ))}
        </div>
        <p className="mt-2.5 text-center text-xs text-nu-dim">Code expires in 5 minutes</p>
      </div>

      {/* Errors */}
      {error && (
        <p className="w-full rounded-xl bg-red-50 px-4 py-2.5 text-center text-sm text-red-600">{error}</p>
      )}
      {message && (
        <p className="w-full rounded-xl bg-green-50 px-4 py-2.5 text-center text-sm text-green-700">{message}</p>
      )}

      {/* Button + footer */}
      <div className="w-full space-y-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={loading}
          disabled={!email || token.length !== 6}
        >
          Verify Email
        </Button>
        <div className="space-y-2 text-center text-sm text-nu-muted">
          <button
            type="button"
            onClick={handleResend}
            disabled={!email || resending}
            className="block w-full font-semibold text-nu-blue transition-colors hover:text-nu-blue-dark disabled:cursor-not-allowed disabled:text-nu-muted"
          >
            {resending ? 'Sending…' : 'Resend code'}
          </button>
          <p>
            Wrong email?{' '}
            <button
              type="button"
              onClick={() => router.back()}
              className="font-semibold text-nu-blue transition-colors hover:text-nu-blue-dark"
            >
              Go back
            </button>
          </p>
        </div>
      </div>
    </form>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
