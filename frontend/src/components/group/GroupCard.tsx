import Link from 'next/link';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

interface GroupCardProps {
  id: string;
  title: string;
  destination?: string;
  date: string;
  time: string;
  maxPeople: number;
  currentPeople: number;
  type: 'ride' | 'hangout';
}

export default function GroupCard({
  id, title, destination, date, time, maxPeople, currentPeople, type
}: GroupCardProps) {
  const href = type === 'ride' ? `/group-ride/${id}` : `/hangout/${id}`;
  const filled = Math.round((currentPeople / maxPeople) * 100);
  const spotsLeft = maxPeople - currentPeople;

  return (
    <Link href={href}>
      <div className="group rounded-2xl border border-nu-border bg-nu-surface p-4 transition-all hover:border-nu-border/80 hover:bg-nu-elevated">
        <h3 className="font-semibold text-nu-text group-hover:text-nu-blue transition-colors">{title}</h3>
        {destination && (
          <div className="mt-1 flex items-center gap-1.5 text-sm text-nu-muted">
            <MapPin className="h-3.5 w-3.5 text-nu-blue flex-shrink-0" />
            <span className="truncate">{destination}</span>
          </div>
        )}

        <div className="mt-3 flex items-center gap-4 text-sm text-nu-dim">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{time}</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1 text-xs text-nu-dim">
              <Users className="h-3.5 w-3.5" />
              <span>{currentPeople}/{maxPeople} joined</span>
            </div>
            <span className="text-sm font-bold text-nu-blue font-display">Coordinate in chat</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-nu-elevated">
            <div
              className="h-1.5 rounded-full bg-nu-blue transition-all"
              style={{ width: `${filled}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-nu-dim">{spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left</p>
        </div>
      </div>
    </Link>
  );
}
