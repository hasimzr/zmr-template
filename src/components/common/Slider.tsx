"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";;
import { sliderData } from "@/data/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTO_PLAY_INTERVAL = 5000;

const Slider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const length = sliderData.length;

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(
      () => setCurrent((prev) => (prev + 1) % length),
      AUTO_PLAY_INTERVAL
    );
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, length]);

  const goTo = (idx: number) => setCurrent(idx);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + length) % length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % length);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slides */}
      <div className="relative h-[50vw] min-h-[360px] max-h-[640px]">
        {sliderData.map((slider, idx) => (
          <div
            key={slider.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === current
                ? "opacity-100 z-10 scale-100"
                : "opacity-0 z-0 scale-105"
              }`}
          >
            <img
              src={slider.image}
              alt={slider.title}
              className="w-full h-full object-cover object-center select-none"
              draggable={false}
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-gray-900/10" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl">
                  <div className={`transform transition-all duration-700 delay-200 ${idx === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}>
                    <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-full mb-4 backdrop-blur-sm border border-cyan-400/30">
                      YENİ ÜRÜNLER
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 tracking-tight">
                      {slider.title}
                    </h2>
                    <p className="text-base md:text-lg text-gray-200 mb-6 leading-relaxed max-w-md">
                      {slider.description}
                    </p>
                    {slider.buttonText && (
                      <Link
                        href={slider.buttonLink || "/products"}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
                      >
                        {slider.buttonText}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2.5 md:p-3 border border-white/30 transition-all z-20 focus:outline-none hover:scale-110"
        aria-label="Önceki"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2.5 md:p-3 border border-white/30 transition-all z-20 focus:outline-none hover:scale-110"
        aria-label="Sonraki"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Progress Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {sliderData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${idx === current
                ? "bg-cyan-400 w-8 shadow-lg shadow-cyan-400/50"
                : "bg-white/50 w-3 hover:bg-white/70"
              }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
