"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { sliderData } from "@/data/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SliderProps {
  initialSlides?: any[] | null;
}

const AUTO_PLAY_INTERVAL = 5000;

const parseBool = (val: any): boolean => {
  if (val === undefined || val === null) return false;
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    return val.trim().toLowerCase() === "true";
  }
  return !!val;
};

const extractImageUrl = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    return val.thumbUrl || val.url || val.secure_url || "";
  }
  return "";
};

const mapStaticToApi = (staticData: typeof sliderData): any[] => {
  return staticData.map((item, idx) => ({
    [`SliderTagName_${idx}`]: "YENİ ÜRÜNLER",
    [`SliderTitle_${idx}`]: item.title,
    [`SliderDescription_${idx}`]: item.description,
    [`SliderButtonIsShow_${idx}`]: !!item.buttonText,
    [`SliderButtonText_${idx}`]: item.buttonText || "",
    [`SliderButtonLink_${idx}`]: item.buttonLink || "",
    [`SliderImg_${idx}`]: item.image,
  }));
};

const Slider: React.FC<SliderProps> = ({ initialSlides }) => {
  const defaultSlides = mapStaticToApi(sliderData);
  const [slides, setSlides] = useState<any[]>(() => {
    if (Array.isArray(initialSlides) && initialSlides.length > 0) {
      return initialSlides;
    }
    return defaultSlides;
  });

  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const length = slides.length;

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

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "THEME_UPDATE") {
        const { objectId, value } = event.data;
        if (!objectId) return;

        const match = objectId.match(/^(SliderTagName|SliderTitle|SliderDescription|SliderButtonIsShow|SliderButtonText|SliderButtonLink|SliderImg)_(\d+)$/);
        if (match) {
          const fieldName = match[1];
          const index = parseInt(match[2], 10);

          setSlides((prevSlides) => {
            const newSlides = [...prevSlides];
            if (newSlides[index]) {
              let parsedValue = value;
              if (fieldName === "SliderButtonIsShow") {
                parsedValue = parseBool(value);
              } else if (fieldName === "SliderImg") {
                parsedValue = extractImageUrl(value);
              }
              newSlides[index] = {
                ...newSlides[index],
                [`${fieldName}_${index}`]: parsedValue,
              };
            }
            return newSlides;
          });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const goTo = (idx: number) => setCurrent(idx);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + length) % length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % length);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slides */}
      <div className="relative h-[50vw] min-h-[360px] max-h-[640px]">
        {slides.map((slide, idx) => {
          const tagName = slide[`SliderTagName_${idx}`] || "YENİ ÜRÜNLER";
          const title = slide[`SliderTitle_${idx}`] || "";
          const description = slide[`SliderDescription_${idx}`] || "";
          const buttonIsShow = parseBool(slide[`SliderButtonIsShow_${idx}`]);
          const buttonText = slide[`SliderButtonText_${idx}`] || "";
          const buttonLink = slide[`SliderButtonLink_${idx}`] || "";
          const image = slide[`SliderImg_${idx}`] || "";

          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === current
                  ? "opacity-100 z-10 scale-100"
                  : "opacity-0 z-0 scale-105"
                }`}
            >
              <img
                id={`SliderImg_${idx}`}
                data-id={`SliderImg_${idx}`}
                src={image}
                alt={title}
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
                      <span
                        id={`SliderTagName_${idx}`}
                        data-id={`SliderTagName_${idx}`}
                        className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-full mb-4 backdrop-blur-sm border border-cyan-400/30"
                      >
                        {tagName}
                      </span>
                      <h2
                        id={`SliderTitle_${idx}`}
                        data-id={`SliderTitle_${idx}`}
                        className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 tracking-tight"
                      >
                        {title}
                      </h2>
                      <p
                        id={`SliderDescription_${idx}`}
                        data-id={`SliderDescription_${idx}`}
                        className="text-base md:text-lg text-gray-200 mb-6 leading-relaxed max-w-md"
                      >
                        {description}
                      </p>
                      <span
                        id={`SliderButtonIsShow_${idx}`}
                        data-id={`SliderButtonIsShow_${idx}`}
                        className="hidden"
                      />
                      <span
                        id={`SliderButtonLink_${idx}`}
                        data-id={`SliderButtonLink_${idx}`}
                        className="hidden"
                      />
                      <div className={buttonIsShow ? "block" : "hidden"}>
                        <Link
                          data-id={`SliderButtonLink_${idx}`}
                          href={buttonLink || "/products"}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
                        >
                          <span id={`SliderButtonText_${idx}`} data-id={`SliderButtonText_${idx}`}>
                            {buttonText}
                          </span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
        {slides.map((_, idx) => (
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
