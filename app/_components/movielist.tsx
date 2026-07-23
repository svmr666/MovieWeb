import { Moviecard } from "./movie-card/moviecard";

interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string | null;
}

interface MovielistProps {
  upcomingMovies: Movie[];
  popularMovies: Movie[];
  topRatedMovies: Movie[];
}

export function Movielist({
  upcomingMovies,
  popularMovies,
  topRatedMovies,
}: MovielistProps) {
  return (
    <div className="flex w-full max-w-[1440px] mx-auto flex-col gap-[52px] px-6">
      <Moviecard movies={upcomingMovies} genre="Upcoming" />
      <Moviecard movies={popularMovies} genre="Popular" />
      <Moviecard movies={topRatedMovies} genre="Top Rated" />
    </div>
  );
}
