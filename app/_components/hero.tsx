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
    if (!currentMovie) return;
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
      <div className="w-full h-[300px] md:h-[600px] mb-[52px] flex items-center justify-center">
        <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full max-w-[1440px] mx-auto overflow-hidden group mb-[52px]">
      {/* Container: Mobile дээр flex-col, Desktop (md) дээр block/relative */}
      <div className="flex flex-col md:block relative w-full md:h-[600px]">
        {/* Зургийн контейнер */}
        <div className="relative w-full h-[240px] sm:h-[350px] md:h-full md:absolute md:inset-0">
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

          {/* Overlay gradient: зөвхөн Desktop дээр харагдана */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          {/* Navigation товчнууд (Prev, Next) */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all border border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-0 md:absolute md:inset-0 md:flex md:flex-col md:justify-center md:items-start md:px-[80px] z-10 text-foreground md:text-white max-w-full md:max-w-[550px]">
          <p className="text-sm md:text-[16px] text-muted-foreground md:text-gray-200 font-medium">
            Now Playing:
          </p>

          <div className="flex items-center justify-between gap-4 my-1 md:my-0 md:block w-full">
            <h2 className="text-2xl sm:text-3xl md:text-[42px] font-bold leading-tight line-clamp-1 md:line-clamp-none">
              {currentMovie.title}
            </h2>

            <div className="flex items-center gap-1 shrink-0 md:mt-2">
              <Star className="w-5 h-5 md:w-[18px] md:h-[18px] fill-yellow-400 text-yellow-400" />
              <span className="text-base md:text-[18px] font-semibold">
                {currentMovie.vote_average?.toFixed(1) ?? "N/A"}
              </span>
              <span className="text-xs md:text-[14px] text-muted-foreground md:text-gray-300">
                /10
              </span>
            </div>
          </div>

          <p className="text-sm md:text-[15px] text-muted-foreground md:text-gray-200 leading-relaxed line-clamp-3 md:line-clamp-3 my-2 md:my-3">
            {currentMovie.overview}
          </p>

          <Button
            onClick={handleWatchTrailer}
            className="mt-2 md:mt-[8px] rounded-lg bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 md:bg-transparent md:border-white md:text-white md:hover:bg-white md:hover:text-black border gap-2 px-4 py-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Watch Trailer
          </Button>
        </div>

        <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 items-center gap-2.5">
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
      </div>

      <Dialog open={isTrailerOpen} onOpenChange={setIsTrailerOpen}>
        <DialogContent className="p-0 overflow-hidden w-[95vw] sm:w-[997px] !max-w-[997px] rounded-lg bg-black border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {trailerName || `${currentMovie?.title} Trailer`}
            </DialogTitle>
            <DialogDescription>
              {currentMovie?.title} трейлер видео
            </DialogDescription>
          </DialogHeader>

          <div className="w-full aspect-video flex items-center justify-center bg-black">
            {trailerLoading && (
              <p className="text-sm text-gray-300 animate-pulse">
                Loading trailer...
              </p>
            )}
            {!trailerLoading && trailerKey && (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title={trailerName || `${currentMovie?.title} Trailer`}
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
