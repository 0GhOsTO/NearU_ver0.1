import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  showNumber?: boolean;
}

export default function RatingStars({ rating, showNumber = false }: RatingStarsProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i + 1 <= Math.floor(rating);
    const half = !filled && i < rating && rating - i >= 0.5;
    return { filled, half };
  });

  return (
    <div className="flex items-center gap-1">
      {stars.map((s, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            s.filled ? 'fill-yellow-400 text-yellow-400' : s.half ? 'fill-yellow-200 text-yellow-400' : 'fill-gray-200 text-gray-200'
          )}
        />
      ))}
      {showNumber && (
        <span className="ml-1 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
