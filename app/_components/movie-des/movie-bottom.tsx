"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "../card"; // Card компонентын замаа тохируулаарай

interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string | null;
}

const API_KEY = "b191ad205317927c1b95e4ad22c7f87c";
const BASE_URL = "https://api.themoviedb.org/3";

export function MovieBottom() {
  const params = useParams();
  const movieId = params?.id;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;

    const fetchSimilarMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/movie/${movieId}/similar?language=en-US&page=1&api_key=${API_KEY}`,
        );
        const data = await res.json();
        setMovies(data.results?.slice(0, 5) || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarMovies();
  }, [movieId]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center w-full">
        <p className="text-2xl font-bold">More like this</p>
        <Link
          href={`/movie/${movieId}/similar`}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-black font-medium"
        >
          <span>See more</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Card key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
