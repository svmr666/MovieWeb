import { Button } from "@/components/ui/button";
import { Star, Play } from "lucide-react";
import Image from "next/image";

export function Herocard() {
  return (
    <div className="relative w-[1440px] h-[600px] mx-auto">
      <Image
        src="/Hero/wicked.svg"
        alt="wicked"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center items-start px-[80px] gap-[12px] z-10 text-white max-w-[500px]">
        <p className="text-[16px] text-gray-200">Now Playing:</p>

        <h2 className="text-[42px] font-bold leading-none">Wicked</h2>

        <div className="flex items-center gap-[6px]">
          <Star className="w-[18px] h-[18px] fill-yellow-400 text-yellow-400" />
          <span className="text-[18px] font-semibold">6.9</span>
          <span className="text-[14px] text-gray-300">/10</span>
        </div>

        <p className="text-[15px] text-gray-200 leading-relaxed">
          Elphaba, a misunderstood young woman because of her green skin, and
          Glinda, a popular girl, become friends at Shiz University in the Land
          of Oz. After an encounter with the Wonderful Wizard of Oz, their
          friendship reaches a crossroads.
        </p>

        <Button
          variant="outline"
          className="mt-[8px] rounded-lg bg-transparent border-white text-white hover:bg-white hover:text-black gap-[8px]"
        >
          <Play className="w-[16px] h-[16px] fill-current" />
          Watch Trailer
        </Button>
      </div>
    </div>
  );
}
