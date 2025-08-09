import React, { lazy, Suspense } from 'react';
import Hero from './HeyThere';
// Optimized: lazy-load heavy sections below the fold
const Experiences = lazy(() => import('./ThingsBuilt'));
const Stories = lazy(() => import('./Stories'));
const Experience = lazy(() => import('./Experience'));

export default function Home() {
    return (
      <>
        <section className="relative min-h-[calc(100svh-44px)] md:min-h-screen flex items-start pt-0 md:pt-8" data-bg-scene="hero">
          <div className="mx-auto max-w-screen-xl px-4 md:px-6 w-full z-10">
            <Hero />
          </div>
          {/* remove previous black fade to keep continuous background */}
          {/* spacer removed intentionally */}
        </section>
        {/* Experiences Section */}
        <Suspense fallback={null}>
          <div className="w-full flex justify-center items-center" data-bg-scene="projects">
            <Experiences />
          </div>
        </Suspense>
        {/* Stories Section */}
        <Suspense fallback={null}>
          <div className="w-full flex justify-center items-center" data-bg-scene="stories">
            <Stories />
          </div>
        </Suspense>
        {/* Experience Section */}
        <Suspense fallback={null}>
          <div className="w-full flex justify-center items-center" data-bg-scene="experience">
            <Experience />
          </div>
        </Suspense>
      </>
    );
  }
  