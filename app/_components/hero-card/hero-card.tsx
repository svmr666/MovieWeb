import { Button } from "@/components/ui/button";
import { Star, Play } from "lucide-react";
import Image from "next/image";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const FALLBACK_IMAGE = "/Hero/wicked.svg";

interface Movie {
  id: number;
  title: string;
  overview: string;
  vote_average: number;
  backdrop_path: string | null;
}

export function Herocard({ movie }: { movie: Movie }) {
  return (
    <div className="relative w-full h-[600px] mx-auto">
      <Image
        src={
          movie.backdrop_path
            ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
            : FALLBACK_IMAGE
        }
        alt={movie.title}
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center items-start px-[80px] gap-[12px] z-10 text-white max-w-[500px]">
        <p className="text-[16px] text-gray-200">Now Playing:</p>

        <h2 className="text-[42px] font-bold leading-none">{movie.title}</h2>

        <div className="flex items-center gap-[6px]">
          <Star className="w-[18px] h-[18px] fill-yellow-400 text-yellow-400" />
          <span className="text-[18px] font-semibold">
            {movie.vote_average?.toFixed(1) ?? "N/A"}
          </span>
          <span className="text-[14px] text-gray-300">/10</span>
        </div>

        <p className="text-[15px] text-gray-200 leading-relaxed line-clamp-3">
          {movie.overview}
        </p>

        <Button
          variant="outline"
          className="mt-[8px] rounded-lg bg-transparent border-white text-white hover:bg-white hover:text-black gap-[8px]"
        >
          <Play className="w-[16px] h-[16px] fill-current" />
          Watch Trailer
        </Button>
      </div>
    </div>
  );
}
