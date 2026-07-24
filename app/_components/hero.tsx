"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Movie {
  id: number;
  title: string;
  overview: string;
  vote_average: number;
  backdrop_path: string | null;
}

interface TmdbVideo {
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

const API_KEY = "b191ad205317927c1b95e4ad22c7f87c";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const FALLBACK_IMAGE = "/Hero/wicked.svg";

// TMDB-ийн videos жагсаалтаас хамгийн тохирох YouTube трейлерийг сонгоно
function pickTrailer(videos: TmdbVideo[] | undefined): TmdbVideo | null {
  if (!videos || videos.length === 0) return null;
  const youtubeVideos = videos.filter((v) => v.site === "YouTube");

  return (
    youtubeVideos.find((v) => v.type === "Trailer" && v.official) ||
    youtubeVideos.find((v) => v.type === "Trailer") ||
    youtubeVideos.find((v) => v.type === "Teaser") ||
    youtubeVideos[0] ||
    null
  );
}

export function Hero() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Трейлер (YouTube) state
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerName, setTrailerName] = useState<string | null>(null);
  const [trailerLoading, setTrailerLoading] = useState(false);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/movie/now_playing?language=en-US&page=1&api_key=${API_KEY}`,
        );
        const data = await res.json();
        setMovies(data.results?.slice(0, 10) || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchNowPlaying();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [movies.length, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  const handleWatchTrailer = async () => {
    setIsTrailerOpen(true);
    setTrailerKey(null);
    setTrailerName(null);
    setTrailerLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/movie/${currentMovie.id}/videos?language=en-US&api_key=${API_KEY}`,
      );
      const data = await res.json();
      const trailer = pickTrailer(data.results);
      setTrailerKey(trailer?.key ?? null);
      setTrailerName(trailer?.name ?? null);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setTrailerLoading(false);
    }
  };

  if (movies.length === 0) {
    return (
      <div className="w-full h-[600px] mb-[52px] flex items-center justify-center">
        <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full max-w-[1440px] h-[600px] mx-auto overflow-hidden group mb-[52px]">
      <Image
        src={
          currentMovie.backdrop_path
            ? `${IMAGE_BASE_URL}${currentMovie.backdrop_path}`
            : FALLBACK_IMAGE
        }
        alt={currentMovie.title}
        fill
        className="object-cover transition-all duration-700 ease-in-out"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-[80px] gap-[12px] z-10 text-white max-w-[550px]">
        <p className="text-[16px] text-gray-200 font-medium">Now Playing:</p>

        <h2 className="text-[32px] md:text-[42px] font-bold leading-tight">
          {currentMovie.title}
        </h2>

        <div className="flex items-center gap-[6px]">
          <Star className="w-[18px] h-[18px] fill-yellow-400 text-yellow-400" />
          <span className="text-[18px] font-semibold">
            {currentMovie.vote_average?.toFixed(1) ?? "N/A"}
          </span>
          <span className="text-[14px] text-gray-300">/10</span>
        </div>

        <p className="text-[15px] text-gray-200 leading-relaxed line-clamp-3">
          {currentMovie.overview}
        </p>

        <Button
          onClick={handleWatchTrailer}
          variant="outline"
          className="mt-[8px] rounded-lg bg-transparent border-white text-white hover:bg-white hover:text-black gap-[8px]"
        >
          <Play className="w-[16px] h-[16px] fill-current" />
          Watch Trailer
        </Button>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all border border-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all border border-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-blue-600 scale-125"
                : "bg-white/80 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <Dialog open={isTrailerOpen} onOpenChange={setIsTrailerOpen}>
        <DialogContent className="p-0 overflow-hidden !max-w-none w-[997px]">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {trailerName || `${currentMovie.title} Trailer`}
            </DialogTitle>
            <DialogDescription>
              {currentMovie.title} трейлер видео
            </DialogDescription>
          </DialogHeader>
          <div className="w-[997px] h-[561px] flex items-center justify-center bg-black">
            {trailerLoading && (
              <p className="text-sm text-gray-300">Loading trailer...</p>
            )}
            {!trailerLoading && trailerKey && (
              <iframe
                width={997}
                height={561}
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title={trailerName || `${currentMovie.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            {!trailerLoading && !trailerKey && (
              <p className="text-sm text-gray-300">Трейлер олдсонгүй.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
