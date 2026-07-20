import { ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  rating: number;
  image: string;
}

const movies: Movie[] = [
  {
    id: 1,
    title: "City of God",
    rating: 6.9,
    image: "/moviecard/cityofgod.svg",
  },
  {
    id: 2,
    title: "The Green Mile",
    rating: 6.9,
    image: "/moviecard/greenmile.svg",
  },
  {
    id: 3,
    title: "The InterStellar",
    rating: 6.9,
    image: "/moviecard/interstellar.svg",
  },
  {
    id: 4,
    title: "Life is Beautiful",
    rating: 6.9,
    image: "/moviecard/lifeisbeautiful.svg",
  },
  {
    id: 5,
    title: "Seven",
    rating: 6.9,
    image: "/moviecard/seven.svg",
  },
  {
    id: 6,
    title: "Seven Samurai",
    rating: 6.9,
    image: "/moviecard/sevensamurai.svg",
  },
  {
    id: 7,
    title: "The Silence of the Lambs",
    rating: 6.9,
    image: "/moviecard/silenceoflamb.svg",
  },
  {
    id: 8,
    title: "It's a Wonderful life",
    rating: 6.9,
    image: "/moviecard/wonderfullife.svg",
  },
  {
    id: 9,
    title: "The Terminator",
    rating: 6.9,
    image: "/moviecard/terminator.svg",
  },
  {
    id: 10,
    title: "Saving private Ryan",
    rating: 6.9,
    image: "/moviecard/privateryan.svg",
  },
];

export function Moviecard2() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center w-full">
        <p className="text-2xl font-bold">Popular</p>
        <div className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer hover:text-black">
          <Link href="/Popular" className="flex items-center gap-1">
            <span>See more</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex flex-col overflow-hidden rounded-lg border border-gray-100 cursor-pointer group"
          >
            <div className="relative w-full aspect-[2/3] overflow-hidden">
              <Image
                src={movie.image}
                alt={movie.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col gap-1 bg-gray-200 p-3">
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{movie.rating}</span>
                <span className="text-gray-500">/10</span>
              </div>
              <p className="text-sm font-medium leading-snug line-clamp-2">
                {movie.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
