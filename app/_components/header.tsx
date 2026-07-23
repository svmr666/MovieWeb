"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronDown } from "lucide-react";

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

const API_KEY = "b191ad205317927c1b95e4ad22c7f87c";
const BASE_URL = "https://api.themoviedb.org/3";

export function Header() {
  const [genres, setGenres] = useState<Genre[]>([]);

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

  return (
    <header className="w-full border-b sticky top-0 bg-background/95 backdrop-blur z-50">
      <div className="w-full max-w-[1440px] h-[59px] flex justify-between items-center mx-auto px-4 gap-4">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/header/logo.svg"
              alt="logo"
              width={92}
              height={20}
              className="w-[92px] h-[20px] cursor-pointer"
            />
          </Link>
        </div>

        {/* Center: Genre & Search Bar */}
        <div className="flex items-center gap-3 justify-center flex-1 max-w-2xl">
          {/* Genre Dropdown */}
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

          {/* Search Bar */}
          <InputGroup className="w-full max-w-md rounded-lg">
            <InputGroupAddon>
              <Search className="w-4 h-4 text-gray-500" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search movie..." />
          </InputGroup>
        </div>

        {/* Right spacing balance (хоосон орон зайг тэнцвэржүүлэх хэсэг) */}
        <div className="w-[92px] hidden md:block"></div>
      </div>
    </header>
  );
}
