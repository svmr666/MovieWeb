import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";

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

const mockMovie: MovieData = {
  title: "Wicked",
  releaseDate: "2024.11.26",
  ageRating: "PG",
  duration: "2h 40m",
  rating: 6.9,
  ratingCount: "37k",
  posterImage: "/movie/wickedCard.svg",
  heroImage: "/movie/wickedHero.svg",
  genres: ["Fairy Tale", "Pop Musical", "Fantasy", "Musical", "Romance"],
  description:
    "Elphaba, a misunderstood young woman because of her green skin, and Glinda, a popular girl, become friends at Shiz University in the Land of Oz. After an encounter with the Wonderful Wizard of Oz, their friendship reaches a crossroads.",
  director: "Jon M. Chu",
  writers: ["Winnie Holzman", "Dana Fox", "Gregory Maguire"],
  stars: ["Cynthia Erivo", "Ariana Grande", "Jeff Goldblum"],
};

interface MovieDesProps {
  movie?: MovieData;
}

export function MovieDes({ movie = mockMovie }: MovieDesProps) {
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
            <span className="font-bold">{movie.rating}</span>
            <span className="text-gray-400 text-sm">/10</span>
          </div>
          <div className="text-xs text-gray-400">{movie.ratingCount}</div>
        </div>
      </div>

      <div className="flex gap-[32px] mt-6">
        <Image
          src={movie.posterImage}
          alt={movie.title}
          width={290}
          height={428}
          className="w-[290px] h-[428px] rounded-md object-cover"
        />
        <Image
          src={movie.heroImage}
          alt={`${movie.title} hero`}
          width={760}
          height={428}
          className="w-[760px] h-[428px] rounded-md object-cover"
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
