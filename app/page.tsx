import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Movielist } from "./_components/movielist";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col">
        <Hero />
        <Movielist />
      </main>
      <Footer />
    </div>
  );
}
