import { Footer } from "../_components/footer";
import { Header } from "../_components/header";
import { MovieBottom } from "../_components/movie-des/movie-bottom";
import { MovieDes } from "../_components/movie-des/movie-des";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex w-full max-w-[1440px] mx-auto flex-col gap-[52px] px-6">
          <MovieDes />
          <MovieBottom />
        </div>
      </main>
      <Footer />
    </div>
  );
}
