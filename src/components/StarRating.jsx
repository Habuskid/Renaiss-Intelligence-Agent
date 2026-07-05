import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

export default function StarRating({ rating }) {
  const maxStars = 5;
  const numRating = Number(rating) || 0;
  const filledStars = Math.min(Math.max(Math.round(numRating), 0), maxStars);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxStars)].map((_, i) => {
        if (i < filledStars) {
          return <StarSolid key={i} className="w-5 h-5 text-amber-400 drop-shadow-sm" />;
        }
        return <StarOutline key={i} className="w-5 h-5 text-stone-300" />;
      })}
    </div>
  );
}
