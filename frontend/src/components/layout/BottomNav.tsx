'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, ShoppingBag, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/feed',        label: 'Feed',    icon: Home,          color: 'text-nu-blue',    bg: 'bg-nu-blue',    indicator: 'bg-nu-blue' },
  { href: '/gigs',        label: 'Gigs',    icon: Briefcase,     color: 'text-emerald-500',bg: 'bg-emerald-500',indicator: 'bg-emerald-500' },
  { href: '/marketplace', label: 'Market',  icon: ShoppingBag,   color: 'text-nu-blue',    bg: 'bg-nu-blue',    indicator: 'bg-nu-blue' },
  { href: '/messages',    label: 'Chat',    icon: MessageCircle, color: 'text-violet-500', bg: 'bg-violet-500', indicator: 'bg-violet-500' },
  { href: '/profile',     label: 'Profile', icon: User,          color: 'text-pink-500',   bg: 'bg-pink-500',   indicator: 'bg-pink-500' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-nu-border bg-white/95 backdrop-blur-xl md:hidden">
      <div className="flex items-center">
        {tabs.map(({ href, label, icon: Icon, color, indicator }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-all',
                isActive ? color : 'text-nu-dim hover:text-nu-muted'
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full ${indicator}`} />
                )}
              </div>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
