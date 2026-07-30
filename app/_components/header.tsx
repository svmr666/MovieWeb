"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Star,
  ArrowRight,
  X,
  Sun,
  Moon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // Portal нь зөвхөн client дээр document.body байх үед л ажиллах ёстой
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Desktop search-ийн гадна click тогтоох ref
  const searchRef = useRef<HTMLDivElement>(null);
  // Mobile search-ийн гадна click тогтоох ref (тусдаа!)
  const mobileSearchRef = useRef<HTMLDivElement>(null);

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

  // Desktop болон mobile хоёр search-ийн аль алиных нь гадна click-ийг барина
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideDesktop =
        searchRef.current && searchRef.current.contains(target);
      const clickedInsideMobile =
        mobileSearchRef.current && mobileSearchRef.current.contains(target);

      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setIsOpen(false);
      setShowMobileMenu(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSeeAll = () => {
    setIsOpen(false);
    setShowMobileMenu(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  // Search results-ийн dropdown-г нэг л газар бичээд, desktop болон mobile
  // хоёулаа дахин ашиглах function. Ингэснээр код давхардахгүй.
  // 🌗 Бүх өнгийг theme-aware (bg-background / text-foreground / muted-foreground)
  // болгосон тул dark mode-д ч зөв харагдана.
  const renderSearchDropdown = () => {
    if (!isOpen) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-background text-foreground border border-border rounded-xl shadow-2xl p-3 z-50 flex flex-col gap-2">
        {searchResults.length > 0 ? (
          <>
            <div className="flex flex-col gap-2">
              {searchResults.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  onClick={() => {
                    setIsOpen(false);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center justify-between p-2 hover:bg-muted/60 rounded-lg transition-colors border-b border-border last:border-b-0"
                >
                  <div className="flex gap-3 items-center">
                    <div className="relative w-[50px] h-[70px] rounded-md overflow-hidden bg-muted flex-shrink-0">
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
                      <h4 className="font-semibold text-sm line-clamp-1 text-foreground">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground">
                          {movie.vote_average?.toFixed(1) ?? "N/A"}
                        </span>
                        <span className="text-muted-foreground">/10</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
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
              className="w-full text-left pt-2 pb-1 px-2 text-xs font-semibold text-primary hover:underline border-t border-border"
            >
              See all results for &quot;{query}&quot;
            </button>
          </>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No results found for &quot;{query}&quot;
          </div>
        )}
      </div>
    );
  };

  // Mobile menu-ийн JSX-ийг тусад нь бэлдэж аваад, доор нь Portal-оор
  // document.body руу шууд оруулна (function component биш, зүгээр JSX хувьсагч)
  // 🌗 bg-white -> bg-background, gray-* -> muted-foreground/border болгож
  // dark mode-д genre-үүд харагдахгүй байсан асуудлыг засав
  const mobileMenuOverlay =
    showMobileMenu && mounted
      ? createPortal(
          <div className="sm:hidden fixed inset-0 top-[59px] bg-background text-foreground z-[100] flex flex-col">
            {/* Дээд мөр: chevron + search input + close (X) */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0 bg-background">
              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />

              <div className="relative flex-1" ref={mobileSearchRef}>
                <div className="flex items-center gap-2 border border-border rounded-full px-3 py-2 bg-background">
                  <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim() && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground text-foreground"
                  />
                </div>
                {renderSearchDropdown()}
              </div>

              <button
                onClick={() => setShowMobileMenu(false)}
                aria-label="Close menu"
                className="flex-shrink-0"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Доод хэсэг: Genres толгой, тайлбар, жагсаалт */}
            <div className="flex-1 overflow-y-auto px-4 py-5 bg-background">
              <h2 className="text-2xl font-bold mb-1 text-foreground">
                Genres
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                See lists of movies by genre
              </p>
              <div className="border-b border-border mb-4" />

              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genre/${genre.id}?name=${encodeURIComponent(
                      genre.name,
                    )}`}
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    {genre.name}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <header className="w-full border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="w-full max-w-[1440px] h-[59px] flex justify-between items-center mx-auto px-4 gap-4 relative">
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

          {/* 🌗 Responsive засвар: hardcode ml-[200px] hack-ийг арилгаж,
              flex/justify ашиглан mobile дээр icon зөв төвд харагдана */}
          <div className="flex items-center gap-3 justify-end sm:justify-center flex-1 max-w-2xl">
            <Image
              src="/header/Modes.svg"
              alt="search"
              width={36}
              height={36}
              className="w-[36px] h-[36px] cursor-pointer sm:hidden"
              onClick={() => setShowMobileMenu((prev) => !prev)}
            />

            {/* ------- DESKTOP: Genre dropdown ------- */}
            <div className="max-sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    <span>Genre</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-[600px] p-6 bg-background text-foreground border border-border"
                  align="start"
                >
                  <div className="flex flex-col gap-1 mb-4">
                    <h2 className="text-2xl font-bold text-foreground">
                      Genres
                    </h2>
                    <p className="text-sm text-muted-foreground">
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
                        className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* ------- DESKTOP: Search input ------- */}
            <div
              className="relative max-w-md w-full sm:w-[379px] max-sm:hidden"
              ref={searchRef}
            >
              <InputGroup className="w-full rounded-lg">
                <InputGroupAddon>
                  <Search className="w-4 h-4 text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Search movie..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => query.trim() && setIsOpen(true)}
                  onKeyDown={handleKeyDown}
                />
              </InputGroup>

              {renderSearchDropdown()}
            </div>
          </div>

          <div className="w-[92px] hidden md:block"></div>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>
      {mobileMenuOverlay}
    </>
  );
}
