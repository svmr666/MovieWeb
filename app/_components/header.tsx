"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Star, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  vote_average: number;
  release_date: string;
  poster_path: string | null;
}

const API_KEY = "b191ad205317927c1b95e4ad22c7f87c";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w92";

export function Header() {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/genre/movie/list?language=en-US&api_key=${API_KEY}`,
        );
        const data = await res.json();
        setGenres(data.genres || []);
      } catch (err) {
        console.error("Genre fetch error:", err);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/search/movie?query=${encodeURIComponent(
            query,
          )}&language=en-US&page=1&api_key=${API_KEY}`,
        );
        const data = await res.json();
        setSearchResults(data.results?.slice(0, 5) || []);
        setIsOpen(true);
      } catch (err) {
        console.error("Search fetch error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSeeAll = () => {
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="w-full border-b sticky top-0 bg-background/95 backdrop-blur z-50">
      <div className="w-full max-w-[1440px] h-[59px] flex justify-between items-center mx-auto px-4 gap-4">
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/header/Logo.svg"
              alt="logo"
              width={92}
              height={20}
              className="w-[92px] h-[20px] cursor-pointer"
            />
          </Link>
        </div>

        <div className="flex items-center gap-3 justify-center flex-1 max-w-2xl">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronDown className="w-4 h-4 text-gray-500" />
                <span>Genre</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[600px] p-6" align="start">
              <div className="flex flex-col gap-1 mb-4">
                <h2 className="text-2xl font-bold">Genres</h2>
                <p className="text-sm text-gray-500">
                  See lists of movies by genre
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genre/${genre.id}?name=${encodeURIComponent(
                      genre.name,
                    )}`}
                    className="flex items-center gap-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative  max-w-md w-[379px]" ref={searchRef}>
            <InputGroup className="w-full rounded-lg">
              <InputGroupAddon>
                <Search className="w-4 h-4 text-gray-500" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search movie..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim() && setIsOpen(true)}
                onKeyDown={handleKeyDown}
              />
            </InputGroup>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-2xl p-3 z-50 flex flex-col gap-2">
                {searchResults.length > 0 ? (
                  <>
                    <div className="flex flex-col gap-2">
                      {searchResults.map((movie) => (
                        <Link
                          key={movie.id}
                          href={`/movie/${movie.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2 hover:bg-muted/60 rounded-lg transition-colors border-b last:border-b-0"
                        >
                          <div className="flex gap-3 items-center">
                            <div className="relative w-[50px] h-[70px] rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={
                                  movie.poster_path
                                    ? `${IMAGE_BASE_URL}${movie.poster_path}`
                                    : "/Hero/wicked.svg"
                                }
                                alt={movie.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <h4 className="font-semibold text-sm line-clamp-1">
                                {movie.title}
                              </h4>
                              <div className="flex items-center gap-1 text-xs">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">
                                  {movie.vote_average?.toFixed(1) ?? "N/A"}
                                </span>
                                <span className="text-gray-400">/10</span>
                              </div>
                              <span className="text-xs text-gray-500 font-medium">
                                {movie.release_date
                                  ? movie.release_date.split("-")[0]
                                  : "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center text-xs font-semibold gap-1 text-primary hover:underline">
                            See more
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </Link>
                      ))}
                    </div>

                    <button
                      onClick={handleSeeAll}
                      className="w-full text-left pt-2 pb-1 px-2 text-xs font-semibold text-primary hover:underline border-t"
                    >
                      See all results for &quot;{query}&quot;
                    </button>
                  </>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No results found for &quot;{query}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-[92px] hidden md:block"></div>
      </div>
    </header>
  );
}
