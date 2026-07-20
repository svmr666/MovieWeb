import { Footer } from "../_components/footer";
import { Header } from "../_components/header";
import { Hero } from "../_components/hero";
import { Moviecard3 } from "../_components/movie-card/moviecard3";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex w-full max-w-[1440px] mx-auto flex-col gap-[52px] px-6">
          <Moviecard3 />
        </div>
      </main>
      <Footer />
    </div>
  );
}
