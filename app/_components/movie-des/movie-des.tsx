"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";

const API_KEY = "b191ad205317927c1b95e4ad22c7f87c";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Нийтлэг "Зураг олдсонгүй" SVG placeholder (Inline Data URI)
const NO_IMAGE_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750" fill="%23f3f4f6"><rect width="100%" height="100%" fill="%23e5e7eb"/><g transform="translate(175, 275)" stroke="%239ca3af" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="0" y="0" width="150" height="150" rx="12"/><circle cx="45" cy="45" r="15"/><path d="m150 105-40-40-70 70"/></g><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="600" fill="%236b7280">Image Not Found</text></svg>`;

interface CrewMember {
  name: string;
  job: string;
}

interface CastMember {
  name: string;
}

interface TmdbMovieResponse {
  title: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: { id: number; name: string }[];
  overview: string;
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
}

export interface MovieData {
  title: string;
  releaseDate: string;
  ageRating: string;
  duration: string;
  rating: number;
  ratingCount: string;
  posterImage: string;
  heroImage: string;
  genres: string[];
  description: string;
  director: string;
  writers: string[];
  stars: string[];
}

function formatRuntime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function formatRatingCount(count: number) {
  if (count >= 1000) return `${Math.round(count / 1000)}k`;
  return `${count}`;
}

function mapTmdbToMovieData(data: TmdbMovieResponse): MovieData {
  const crew = data.credits?.crew || [];
  const cast = data.credits?.cast || [];

  const director = crew.find((c) => c.job === "Director")?.name || "Unknown";
  const writers = crew
    .filter(
      (c) => c.job === "Screenplay" || c.job === "Writer" || c.job === "Novel",
    )
    .map((c) => c.name)
    .filter((name, i, arr) => arr.indexOf(name) === i)
    .slice(0, 3);
  const stars = cast.slice(0, 3).map((c) => c.name);

  return {
    title: data.title,
    releaseDate: data.release_date?.replace(/-/g, ".") || "N/A",
    ageRating: "PG",
    duration: data.runtime ? formatRuntime(data.runtime) : "N/A",
    rating: data.vote_average ?? 0,
    ratingCount: formatRatingCount(data.vote_count ?? 0),
    posterImage: data.poster_path
      ? `${POSTER_BASE_URL}${data.poster_path}`
      : NO_IMAGE_PLACEHOLDER,
    heroImage: data.backdrop_path
      ? `${IMAGE_BASE_URL}${data.backdrop_path}`
      : NO_IMAGE_PLACEHOLDER,
    genres: data.genres?.map((g) => g.name) || [],
    description: data.overview || "",
    director,
    writers: writers.length ? writers : ["Unknown"],
    stars: stars.length ? stars : ["Unknown"],
  };
}

interface MovieDesProps {
  movieId: number;
}

export function MovieDes({ movieId }: MovieDesProps) {
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(true);

  // Зураг ачаалахад алдаа гаргах үеийн state
  const [posterSrc, setPosterSrc] = useState<string>(NO_IMAGE_PLACEHOLDER);
  const [heroSrc, setHeroSrc] = useState<string>(NO_IMAGE_PLACEHOLDER);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/movie/${movieId}?language=en-US&append_to_response=credits&api_key=${API_KEY}`,
        );
        const data = await res.json();
        const mappedData = mapTmdbToMovieData(data);

        setMovie(mappedData);
        setPosterSrc(mappedData.posterImage);
        setHeroSrc(mappedData.heroImage);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  if (loading || !movie) {
    return (
      <div className="w-[1080px] mx-auto mt-[52px]">
        <p className="text-sm text-gray-500">Loading movie details...</p>
      </div>
    );
  }

  return (
    <div className="w-[1080px] mx-auto mt-[52px]">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <div className="text-gray-500 mt-1">
            {movie.releaseDate} · {movie.ageRating} · {movie.duration}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Rating</div>
          <div className="flex items-center gap-1 justify-end">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold">{movie.rating.toFixed(1)}</span>
            <span className="text-gray-400 text-sm">/10</span>
          </div>
          <div className="text-xs text-gray-400">{movie.ratingCount}</div>
        </div>
      </div>

      <div className="flex gap-[32px] mt-6">
        <Image
          src={posterSrc}
          alt={movie.title}
          width={290}
          height={428}
          className="w-[290px] h-[428px] rounded-md object-cover bg-gray-100"
          onError={() => setPosterSrc(NO_IMAGE_PLACEHOLDER)}
        />
        <Image
          src={heroSrc}
          alt={`${movie.title} hero`}
          width={760}
          height={428}
          className="w-[760px] h-[428px] rounded-md object-cover bg-gray-100"
          onError={() => setHeroSrc(NO_IMAGE_PLACEHOLDER)}
        />
      </div>

      <div className="mt-[32px] flex gap-[12px] flex-wrap">
        {movie.genres.map((genre) => (
          <Badge key={genre} variant="outline">
            {genre}
          </Badge>
        ))}
      </div>

      <p className="mt-6 text-gray-700 leading-relaxed">{movie.description}</p>

      <div className="mt-6">
        <div className="flex py-3 border-b">
          <div className="w-[120px] font-semibold shrink-0">Director</div>
          <div>{movie.director}</div>
        </div>

        <div className="flex py-3 border-b">
          <div className="w-[120px] font-semibold shrink-0">Writers</div>
          <div>
            {movie.writers.map((writer, i) => (
              <span key={writer}>
                {writer}
                {i < movie.writers.length - 1 && " · "}
              </span>
            ))}
          </div>
        </div>

        <div className="flex py-3 border-b">
          <div className="w-[120px] font-semibold shrink-0">Stars</div>
          <div>
            {movie.stars.map((star, i) => (
              <span key={star}>
                {star}
                {i < movie.stars.length - 1 && " · "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
