import { ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "../card";

interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string | null;
}

interface MoviecardProps {
  movies: Movie[];
  genre?: string;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const FALLBACK_IMAGE = "/moviecard/placeholder.svg";

export function Moviecard({ movies, genre }: MoviecardProps) {
  if (!movies || movies.length === 0) {
    return <p className="text-sm text-gray-500">Loading movies...</p>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center w-full">
        <p className="text-2xl font-bold">{genre}</p>
        <Link
          href="/Upcoming"
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
        >
          <span>See more</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.slice(0, 10).map((movie) => (
          <Card movie={movie} />
        ))}
      </div>
    </div>
  );
}
