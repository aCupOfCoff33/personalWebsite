import React, { lazy, Suspense } from "react";
import { motion as Motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Hero from "./HeroTypingAnimation";
// Optimized: lazy-load heavy sections below the fold
const Stories = lazy(() => import("../../stories/components/Stories"));
const Experience = lazy(() => import("../../experience/components/Experience"));

export default function Home() {
  return (
    <>
      <section
        className="relative min-h-[calc(100svh-44px)] md:min-h-screen flex items-start pt-0 md:pt-8"
        data-bg-scene="hero"
      >
        <div className="mx-auto max-w-screen-xl px-0 md:px-6 w-full z-10">
          <Hero />
        </div>
        {/* remove previous black fade to keep continuous background */}
        {/* spacer removed intentionally */}

        {/* Scroll indicator - bouncing chevron */}
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20"
        >
          <Motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-white/60 hover:text-white/80 transition-colors cursor-pointer"
            onClick={() => {
              const scrollContainer = document.querySelector(
                '[data-scroll-container="main"]',
              );
              if (scrollContainer) {
                scrollContainer.scrollBy({
                  top: window.innerHeight * 0.8,
                  behavior: "smooth",
                });
              }
            }}
          >
            <ChevronDown className="w-8 h-8" />
          </Motion.div>
        </Motion.div>
      </section>
      {/* Stories Section (replaces previous "Things I've Built in My Cave") */}
      <Suspense fallback={null}>
        <div
          className="w-full flex justify-center items-center"
          data-bg-scene="stories"
        >
          <Stories />
        </div>
      </Suspense>
      {/* Experience Section */}
      <Suspense fallback={null}>
        <div
          className="w-full flex justify-center items-center"
          data-bg-scene="experience"
        >
          <Experience />
        </div>
      </Suspense>
    </>
  );
}
