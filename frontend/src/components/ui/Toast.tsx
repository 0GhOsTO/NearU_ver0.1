'use client';

import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    classes: 'bg-green-50 border-green-200 text-green-800',
    iconClass: 'text-green-500',
  },
  error: {
    icon: XCircle,
    classes: 'bg-red-50 border-red-200 text-red-800',
    iconClass: 'text-red-500',
  },
  info: {
    icon: Info,
    classes: 'bg-blue-50 border-blue-200 text-blue-800',
    iconClass: 'text-blue-500',
  },
};

export default function Toast({ message, type = 'info' }: ToastProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg',
        config.classes
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', config.iconClass)} />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
