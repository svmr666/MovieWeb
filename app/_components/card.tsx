"use client";

import { useState, useEffect } from "react";
import { Star, ImageOff } from "lucide-react";
import Link from "next/link";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const Card = ({ movie }: { movie: any }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [movie?.id, movie?.poster_path]);

  const isValidPoster =
    movie?.poster_path &&
    typeof movie.poster_path === "string" &&
    movie.poster_path.trim() !== "" &&
    !hasError;

  const imageSrc = isValidPoster
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  return (
    <Link
      href={movie?.id ? `/movie/${movie.id}` : "#"}
      className="flex flex-col overflow-hidden rounded-lg border border-gray-100 cursor-pointer group"
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-100 flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={movie?.title || "Movie poster"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 p-2 text-center text-gray-400">
            <ImageOff className="w-6 h-6 text-gray-300" />
            <span className="text-[10px] font-medium text-gray-400 select-none">
              No Image
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 bg-gray-200 p-3">
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 shrink-0" />
          <span className="font-semibold">
            {movie?.vote_average
              ? Number(movie.vote_average).toFixed(1)
              : "N/A"}
          </span>
          <span className="text-gray-500">/10</span>
        </div>
        <p className="text-sm font-medium leading-snug line-clamp-2">
          {movie?.title || "Untitled"}
        </p>
      </div>
    </Link>
  );
};
