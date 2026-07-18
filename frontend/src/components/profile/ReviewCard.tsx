import RatingStars from './RatingStars';
import Avatar from '@/components/ui/Avatar';

interface ReviewCardProps {
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ReviewCard({ reviewer, rating, comment, date }: ReviewCardProps) {
  return (
    <div className="rounded-2xl border border-nu-border bg-nu-surface p-4">
      <div className="flex items-start gap-3">
        <Avatar name={reviewer} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-nu-text">{reviewer}</span>
            <span className="text-xs text-nu-dim flex-shrink-0">{date}</span>
          </div>
          <RatingStars rating={rating} />
          <p className="mt-2 text-sm text-nu-muted leading-relaxed">{comment}</p>
        </div>
      </div>
    </div>
  );
}
