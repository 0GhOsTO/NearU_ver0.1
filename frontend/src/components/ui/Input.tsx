import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
}

export default function Input({ label, error, prefix, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-nu-muted">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-nu-muted text-sm font-medium">{prefix}</span>
        )}
        <input
          className={cn(
            'w-full rounded-xl border border-nu-border bg-nu-elevated py-2.5 text-sm text-nu-text placeholder-nu-dim shadow-sm transition-all focus:border-nu-blue/60 focus:outline-none focus:ring-2 focus:ring-nu-blue/20',
            prefix ? 'pl-7 pr-4' : 'px-4',
            error && 'border-nu-coral/60 focus:border-nu-coral focus:ring-nu-coral/20',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-nu-coral">{error}</p>}
    </div>
  );
}
