import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  backHref?: string;
}

export default function PageHeader({ title, backHref }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {backHref && (
        <Link
          href={backHref}
          className="rounded-xl p-2 text-nu-muted hover:bg-nu-elevated hover:text-nu-text transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      )}
      <h1 className="font-display text-2xl font-bold text-nu-text">{title}</h1>
    </div>
  );
}
