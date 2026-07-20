"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Herocard } from "./hero-card/hero-card";
import { Herocard2 } from "./hero-card/hero-card2";
import { Herocard3 } from "./hero-card/hero-card3";

export function Hero() {
  const slides = [
    <Herocard key="1" />,
    <Herocard2 key="2" />,
    <Herocard3 key="3" />,
  ];

  return (
    <Carousel className="relative w-full max-w-[1440px] mx-auto group">
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <Card className="border-0 shadow-none rounded-none bg-transparent">
              <CardContent className="flex h-[600px] w-full items-center justify-center p-0">
                {slide}
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border-0 bg-white text-black hover:bg-white/90 shadow-md" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border-0 bg-white text-black hover:bg-white/90 shadow-md" />
    </Carousel>
  );
}
