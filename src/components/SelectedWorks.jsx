import React from "react";
import { useReveal } from './useReveal';
import { HIDDEN } from './RevealStarter';
// ...existing experiences data and accentMap...
const experiences = [
  {
    company: 'American Global',
    role: 'Data Analytics & Strategy Intern',
    dates: 'May 2025 – Present',
    blurb:
      'Built a loss-ratio dashboard adopted by 30+ brokers, using React, Sanity, and Python ETL.',
    image: 'https://placehold.co/481x280',
    accent: 'blue',
  },
  {
    company: 'Government of Canada',
    role: 'Financial Services Intern',
    dates: 'May 2024 – Aug 2024',
    blurb:
      'Automated reconciliation for 10+ accounts, saving 20 hrs/month; built reporting tools in R.',
    image: 'https://placehold.co/481x280',
    accent: 'red',
  },
  {
    company: 'Western Developers Society',
    role: 'VP of Development',
    dates: 'Sept 2023 – Present',
    blurb:
      'Led a team of 8 to launch 3 web apps for student orgs; mentored new devs and ran weekly code-reviews.',
    image: 'https://placehold.co/481x280',
    accent: 'blue',
  },
  {
    company: 'Ivey Fintech',
    role: 'Consultant Analyst',
    dates: 'Sept 2024 – Apr 2025',
    blurb:
      'Analysed fintech trends and presented findings to 50+ students; built a Python tool for market-sizing.',
    image: 'https://placehold.co/481x280',
    accent: 'emerald',
  },
];
const accentMap = {
  blue:   { ring: 'ring-blue-500',   bar: 'bg-blue-500',    tag: 'text-blue-400' },
  red:    { ring: 'ring-red-500',    bar: 'bg-red-500',     tag: 'text-red-400' },
  emerald:{ ring: 'ring-emerald-500',bar: 'bg-emerald-500', tag: 'text-emerald-400' },
};
function GlassCard({ company, role, dates, blurb, image, accent }) {
  const { ring, bar, tag } = accentMap[accent] || accentMap.blue;
  return (
    <a
      href="#"
      className={
        `group snap-start shrink-0 w-[90vw] sm:w-[48vw] md:w-[32vw] lg:w-[28vw] xl:w-[24vw] ` +
        `flex flex-col overflow-hidden rounded-3xl ` +
        `backdrop-blur-xl bg-white/5 ` +
        `shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform duration-150 ` +
        `hover:shadow-xl hover:scale-[1.02] focus-visible:outline-none ` +
        `focus-visible:ring-2 focus-visible:${ring}`
      }
    >
      {/* static accent bar, no hover glow */}
      <span
        className={`${bar} absolute inset-px rounded-[calc(1.5rem-1px)] opacity-0 transition`}
      />
      {/* media */}
      <img src={image} alt={company} className="w-full aspect-video object-cover" />
      {/* glass footer */}
      <div className="flex flex-col gap-1 px-5 py-4 bg-black/60 backdrop-blur-md">
        <h3 className="text-base font-semibold text-white truncate">{company}</h3>
        <p className="text-sm text-gray-300 truncate">{role}</p>
        <p className="text-xs text-gray-500">{dates}</p>
        <p className="mt-2 text-sm text-gray-400">{blurb}</p>
        <span className={`mt-3 inline-block text-xs font-medium ${tag}`}>View case →</span>
      </div>
    </a>
  );
}
export default function SelectedWorks() {
  const carouselRef = React.useRef(null);
  const revealRef = useReveal();
  const scrollPrev = () => carouselRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollNext = () => carouselRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  return (
    <section ref={revealRef} className="relative w-full py-24 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* heading with controls */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <span data-reveal className={HIDDEN + " inline-block h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"} />
            <h2 data-reveal className={HIDDEN + " mt-4 text-4xl font-semibold italic text-white"}>Selected Works</h2>
            <p data-reveal className={HIDDEN + " mt-2 max-w-xl text-lg text-gray-400"}>
              Projects, roles, and highlights from my journey.
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={scrollPrev}
              className="flex items-center justify-center h-10 w-10 rounded-full border border-white/20 text-white hover:bg-white/10 focus:outline-none"
            >
              {/* Left arrow */}
              <span className="text-xl font-bold">‹</span>
            </button>
            <button
              onClick={scrollNext}
              className="flex items-center justify-center h-10 w-10 rounded-full border border-white/20 text-white hover:bg-white/10 focus:outline-none"
            >
              {/* Right arrow */}
              <span className="text-xl font-bold">›</span>
            </button>
          </div>
        </div>
        {/* --- CAROUSEL ------------------------------------------------ */}
        <div
          ref={carouselRef}
          className="mt-12 flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
        >
          {experiences.map(e => (
            <div key={e.company} data-reveal className={HIDDEN}>
              <GlassCard {...e} />
            </div>
          ))}
        </div>
        {/* gradient edge masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />
      </div>
    </section>
  );
}
