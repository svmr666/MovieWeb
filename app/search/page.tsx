"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Header } from "../_components/header";
import { Footer } from "../_components/footer";
import { Card } from "../_components/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string | null;
}

interface Genre {
  id: number;
  name: string;
}

const API_KEY = "b191ad205317927c1b95e4ad22c7f87c";
const BASE_URL = "https://api.themoviedb.org/3";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Query өөрчлөгдөхөд хуудасны дугаарыг 1 рүү буцаах
  useEffect(() => {
    setPage(1);
  }, [query]);

  // Genre татах
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

  // Кино хайх (Query болон Page өөрчлөгдөх бүрт ажиллана)
  useEffect(() => {
    if (!query) return;

    const fetchSearchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/search/movie?query=${encodeURIComponent(
            query,
          )}&language=en-US&page=${page}&api_key=${API_KEY}`,
        );
        const data = await res.json();
        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500));
        setTotalResults(data.total_results || 0);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchMovies();
  }, [query, page]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-10 min-h-[calc(100vh-200px)] flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-1">Search results</h1>
        <p className="text-gray-500 mb-8 font-medium">
          {totalResults} results for &quot;{query}&quot;
        </p>

        <div className="flex flex-col lg:flex-row gap-12 justify-between items-start">
          {/* ЗҮҮН ТАЛ: Кинонууд болон Pagination */}
          <div className="flex-1 w-full flex flex-col gap-10">
            {loading ? (
              <div className="text-center py-20 text-gray-500">Loading...</div>
            ) : movies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {movies.map((movie) => (
                  <Card key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                No results found.
              </div>
            )}

            {/* Pagination хэсэг */}
            {totalPages > 1 && !loading && (
              <div className="flex justify-end pt-4">
                <Pagination className="mx-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(page - 1);
                        }}
                      />
                    </PaginationItem>

                    {getPageNumbers().map((p, idx) =>
                      p === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href="#"
                            isActive={p === page}
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(p);
                            }}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(page + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* БАРУУН ТАЛ: Genre-ууд */}
          <div className="w-full lg:w-[380px] shrink-0 border-t lg:border-t-0 lg:border-l lg:pl-10 pt-8 lg:pt-0">
            <h2 className="text-xl font-bold mb-1">Search by genre</h2>
            <p className="text-sm text-gray-500 mb-6">
              See lists of movies by genre
            </p>

            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.id}?name=${encodeURIComponent(
                    genre.name,
                  )}`}
                  className="flex items-center gap-1 rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-semibold hover:bg-gray-100 transition-colors"
                >
                  <span>{genre.name}</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<div className="p-8">Loading...</div>}>
          <SearchResultsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
