import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const FALLBACK_IMAGE = "/moviecard/placeholder.svg"; // өөрийн placeholder зам

export const Card = ({ movie }: { movie: any }) => {
  return (
    <Link
      key={movie.id}
      href={`/movie/${movie.id}`}
      className="flex flex-col overflow-hidden rounded-lg border border-gray-100 cursor-pointer group"
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        <Image
          src={
            movie.poster_path
              ? `${IMAGE_BASE_URL}${movie.poster_path}`
              : FALLBACK_IMAGE
          }
          alt={movie.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col gap-1 bg-gray-200 p-3">
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">
            {movie.vote_average?.toFixed(1) ?? "N/A"}
          </span>
          <span className="text-gray-500">/10</span>
        </div>
        <p className="text-sm font-medium leading-snug line-clamp-2">
          {movie.title}
        </p>
      </div>
    </Link>
  );
};
