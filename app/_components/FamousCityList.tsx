"use client";
import { CometCard } from "@/components/ui/comet-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function FamousCityList() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4;
  const maxIndex = Math.max(0, cities.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="w-full py-10">
      <div className="relative max-w-6xl mx-auto px-4">
        <h2 className="text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans mb-6 ml-12">
          Famous Cities to Visit
        </h2>
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white dark:bg-neutral-800 shadow-sm disabled:opacity-50"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <div className="overflow-hidden mx-12">
          <div 
            className="flex gap-2 transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {cities.map((city, index) => (
              <div key={index} className="flex-shrink-0" style={{width: 'calc(25% - 6px)'}}>
                <CometCard>
                  <button
                    type="button"
                    className="my-2 flex w-full cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#F5F5F7] dark:bg-neutral-800 p-2 md:my-3 md:p-3"
                    aria-label={`View ${city.name}`}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: "none",
                      opacity: 1,
                    }}
                  >
                    <div className="mx-2 flex-1">
                      <div className="relative mt-2 aspect-[3/4] w-full">
                        <img
                          loading="lazy"
                          className="absolute inset-0 h-full w-full rounded-[16px] object-cover"
                          alt={city.name}
                          src={city.image}
                          style={{
                            boxShadow: "rgba(0, 0, 0, 0.02) 0px 2px 3px 0px",
                            opacity: 1,
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-neutral-800 dark:text-neutral-200">
                      <div className="text-xs">{city.name}</div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 opacity-70">{city.country}</div>
                    </div>
                  </button>
                </CometCard>
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={nextSlide}
          disabled={currentIndex === maxIndex}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white dark:bg-neutral-800 shadow-sm disabled:opacity-50"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

const cities = [
  {
    name: "Delhi",
    country: "India",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2088&auto=format&fit=crop"
  },
  {
    name: "New York",
    country: "USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "London",
    country: "UK",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Dubai",
    country: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Sydney",
    country: "Australia",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Rome",
    country: "Italy",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2096&auto=format&fit=crop"
  },
  {
    name: "Barcelona",
    country: "Spain",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Singapore",
    country: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2052&auto=format&fit=crop"
  }
];
