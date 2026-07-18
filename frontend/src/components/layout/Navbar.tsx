'use client';

import Link from 'next/link';
import { Bell, Search, MapPin, LifeBuoy } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { useUser } from '@/hooks/useUser';

export default function Navbar() {
  const { profile } = useUser();

  return (
    <nav className="sticky top-0 z-40 border-b border-nu-border bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link href="/feed" className="flex-shrink-0 flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-nu-blue" strokeWidth={2.5} />
          <span
            className="font-display text-lg font-bold tracking-tight"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            NearU
          </span>
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-sm mx-auto">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-nu-dim" />
          <input
            type="text"
            placeholder="Search nearby..."
            className="w-full rounded-xl border border-nu-border bg-nu-elevated py-2 pl-9 pr-4 text-sm text-nu-text placeholder-nu-dim focus:border-nu-blue/50 focus:outline-none focus:ring-2 focus:ring-nu-blue/15 transition-all"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/support-ticket"
            title="Help / Report a bug"
            className="rounded-xl p-2 text-nu-muted hover:bg-nu-elevated hover:text-nu-text transition-colors"
          >
            <LifeBuoy className="h-5 w-5" />
          </Link>
          <Link
            href="/notifications"
            className="relative rounded-xl p-2 text-nu-muted hover:bg-nu-elevated hover:text-nu-text transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-nu-coral ring-2 ring-white animate-pulse-slow" />
          </Link>
          <Link href="/profile">
            <Avatar src={profile?.profile_photo_url} name={profile?.display_name ?? 'U'} size="sm" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
