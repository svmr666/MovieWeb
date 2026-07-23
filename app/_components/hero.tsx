"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Herocard } from "./hero-card/hero-card";

interface Movie {
  id: number;
  title: string;
  overview: string;
  vote_average: number;
  backdrop_path: string | null;
}

const API_KEY = "b191ad205317927c1b95e4ad22c7f87c";
const BASE_URL = "https://api.themoviedb.org/3";

export function Hero() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  );

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/movie/now_playing?language=en-US&page=1&api_key=${API_KEY}`,
        );
        const data = await res.json();
        setMovies(data.results?.slice(0, 5) || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchNowPlaying();
  }, []);

  if (movies.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        loop: true, // <-- энэ мөрийг нэмэх
      }}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      className="relative w-full max-w-[1440px] mx-auto group"
    >
      <CarouselContent>
        {movies.map((movie) => (
          <CarouselItem key={movie.id}>
            <Card className="border-0 shadow-none rounded-none bg-transparent">
              <CardContent className="flex h-[600px] w-full items-center justify-center p-0">
                <Herocard movie={movie} />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border-0 bg-white text-black hover:bg-white/90 shadow-md" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border-0 bg-white text-black hover:bg-white/90 shadow-md" />
    </Carousel>
  );
}
