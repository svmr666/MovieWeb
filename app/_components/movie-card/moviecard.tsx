import { ChevronRight } from "lucide-react";
import Link from "next/link";
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

const GENRE_PATH_MAP: Record<string, string> = {
  Upcoming: "/Upcoming",
  Popular: "/Popular",
  "Top Rated": "/Top-Rated",
};

export function Moviecard({ movies, genre }: MoviecardProps) {
  if (!movies || movies.length === 0) {
    return <p className="text-sm text-gray-500">Loading movies...</p>;
  }

  const href = genre && GENRE_PATH_MAP[genre] ? GENRE_PATH_MAP[genre] : "/";

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center w-full">
        <p className="text-2xl font-bold">{genre}</p>
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
        >
          <span>See more</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.slice(0, 10).map((movie) => (
          <Card key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
