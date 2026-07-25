"use client";

import { useEffect, useState } from "react";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Movielist } from "./_components/movielist";

const API_KEY = "b191ad205317927c1b95e4ad22c7f87c";
const BASE_URL = "https://api.themoviedb.org/3";

export default function Home() {
  const [upcomingMovies, setUpcomingMovies] = useState<any[]>([]);
  const [popularMovies, setPopularMovies] = useState<any[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<any[]>([]);

  const fetchMovies = async (endpoint: string) => {
    const url = `${BASE_URL}${endpoint}?language=en-US&page=1&api_key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [upcoming, popular, topRated] = await Promise.all([
          fetchMovies("/movie/upcoming"),
          fetchMovies("/movie/popular"),
          fetchMovies("/movie/top_rated"),
        ]);
        setUpcomingMovies(upcoming);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col">
        <Hero />
        {/* <Movielist
          upcomingMovies={upcomingMovies}
          popularMovies={popularMovies}
          topRatedMovies={topRatedMovies}
        /> */}
      </main>
      <Footer />
    </div>
  );
}
