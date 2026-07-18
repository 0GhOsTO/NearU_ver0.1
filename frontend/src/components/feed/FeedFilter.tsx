'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const tabs = [
  { label: 'All',        active: 'bg-nu-blue text-white',        inactive: 'hover:border-nu-blue/40' },
  { label: 'Gigs',       active: 'bg-emerald-500 text-white',    inactive: 'hover:border-emerald-400/60' },
  { label: 'Marketplace',active: 'bg-amber-500 text-white',      inactive: 'hover:border-amber-400/60' },
  { label: 'Borrow',     active: 'bg-violet-500 text-white',     inactive: 'hover:border-violet-400/60' },
  { label: 'Rides',      active: 'bg-cyan-500 text-white',       inactive: 'hover:border-cyan-400/60' },
  { label: 'Hangouts',   active: 'bg-pink-500 text-white',       inactive: 'hover:border-pink-400/60' },
];

interface FeedFilterProps {
  onFilter?: (tab: string) => void;
}

export default function FeedFilter({ onFilter }: FeedFilterProps) {
  const [active, setActive] = useState('All');

  const handleTab = (label: string) => {
    setActive(label);
    onFilter?.(label);
  };

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      {tabs.map(({ label, active: activeClass, inactive: inactiveClass }) => (
        <button
          key={label}
          onClick={() => handleTab(label)}
          className={cn(
            'flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all border',
            active === label
              ? `${activeClass} border-transparent font-semibold shadow-sm`
              : `bg-white text-nu-muted border-nu-border ${inactiveClass} hover:text-nu-text`
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
