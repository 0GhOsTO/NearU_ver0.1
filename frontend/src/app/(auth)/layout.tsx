import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12 bg-nu-bg overflow-y-auto"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 65% 55% at 18% 65%, rgba(37,99,235,0.07) 0%, transparent 100%), ' +
          'radial-gradient(ellipse 55% 45% at 82% 18%, rgba(37,99,235,0.05) 0%, transparent 100%)',
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-nu-blue shadow-blue">
            <MapPin className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <Link href="/" className="font-display text-2xl font-bold text-nu-text tracking-tight">
            NearU
          </Link>
        </div>

        {/* Card */}
        <div className="flex flex-col rounded-2xl border border-nu-border bg-white shadow-card-md">
          <div className="flex flex-col flex-1 min-h-0 p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
