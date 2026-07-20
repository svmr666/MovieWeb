import { Moviecard } from "./movie-card/moviecard";
import { Moviecard2 } from "./movie-card/moviecard2";
import { Moviecard3 } from "./movie-card/moviecard3";

export function Movielist() {
  return (
    <div className="flex w-full max-w-[1440px] mx-auto flex-col gap-[52px] px-6">
      <Moviecard />
      <Moviecard2 />
      <Moviecard3 />
    </div>
  );
}
