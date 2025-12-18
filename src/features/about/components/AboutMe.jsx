import React from "react";
import { Sparkles } from "lucide-react";
import PhotoMosaic from "./PhotoMosaic";
import aboutImages from "../data/aboutImagesData";

const AboutMe = () => (
  <>
    {/* ---- Foreground content ---- */}
    <section className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24 text-white font-adamant">
      <div className="mx-auto max-w-screen-2xl">
        {/* Mobile: Text first, then image below */}
        {/* Desktop: Image left, text right side by side */}
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-6 lg:gap-10">
          
          {/* Text Content - appears first on mobile, second on desktop */}
          <div className="w-full lg:hidden px-4 sm:px-6 py-8 order-1">
            <div className="border-2 border-dashed border-[#954dfc] rounded-lg p-6 sm:p-7 flex flex-col">
              {/* Header with icon */}
              <div className="flex items-center gap-2.5 mb-5">
                <Sparkles className="w-6 h-6 text-[white]" />
                <h3 className="text-[white] text-xs tracking-[0.2em] uppercase font-adamant font-normal">
                  My Background
                </h3>
              </div>
              
              <div className="w-full inline-flex flex-col justify-center items-start gap-4 sm:gap-5">
                <p className="self-stretch justify-start text-neutral-300 text-base sm:text-lg font-normal font-adamant leading-relaxed">
                  Technically a <span className="text-white font-semibold">Business + SWE Student at Ivey Business School</span> but most of what I care about happens outside the classroom. I'm in third year, graduating in 2027 and based near Toronto.
                  <br/><br/>
                  I like spending time in <span className="text-white font-semibold">Figma</span> & finding cool relationships in diverse <span className="text-white font-semibold">datasets</span> and presenting time, especially in a financial context.
                  <br/><br/>
                  Outside of that, I swim (un)competitively, follow <span className="text-white font-semibold">Mercedes in F1</span>, and listen to random songs on <span className="text-white font-semibold">Spotify</span>.
                  <br/><br/>
                  No big story behind the bear. He's just cool. And he's staying.
                </p>
              </div>
            </div>
          </div>

          {/* Image Container - appears second on mobile, first on desktop */}
          <div className="w-full lg:w-auto px-0 sm:px-4 lg:px-10 pt-0 lg:pt-24 pb-0 lg:pb-12 inline-flex flex-col justify-center items-center lg:items-start order-2 lg:order-1">
            <img 
              className="w-full max-w-md lg:max-w-[514px] lg:w-[514px] h-auto lg:h-[685px] rounded-[20px] object-cover shadow-xl" 
              src="/aaryan-about.JPG" 
              alt="Aaryan"
              loading="lazy"
            />
          </div>

          {/* Text Content - Desktop only */}
          <div className="hidden lg:flex px-7 pt-24 pb-12 justify-start items-start order-2">
            <div className="w-[514px] border-2 border-dashed border-[#954dfc] rounded-lg flex flex-col p-8">
              {/* Header with icon */}
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-7 h-7 text-[#954dfc]" />
                <h3 className="text-[#954dfc] text-sm tracking-[0.2em] uppercase font-adamant font-normal">
                  MY BACKGROUND
                </h3>
              </div>
              
              <div className="w-full flex flex-col justify-center items-start gap-5">
                <p className="w-full text-neutral-300 text-xl font-normal font-adamant leading-relaxed">
                  Technically a <span className="text-white font-semibold">Business + SWE Student at Ivey Business School</span> but most of what I care about happens outside the classroom. I'm in third year, graduating in 2027 and based near Toronto.
                  <br/><br/>
                  I like spending time in <span className="text-white font-semibold">Figma</span> & finding cool relationships in diverse <span className="text-white font-semibold">datasets</span> and presenting time, especially in a financial context.
                  <br/><br/>
                  Outside of that, I swim (un)competitively, follow <span className="text-white font-semibold">Mercedes in F1</span>, and listen to random songs on <span className="text-white font-semibold">Spotify</span>.
                  <br/><br/>
                  No big story behind the bear. He's just cool. And he's staying.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    {/* Photo Gallery Mosaic */}
    <PhotoMosaic images={aboutImages} />
  </>
);

// Optimized for performance by adding React.memo to avoid unnecessary re-renders
export default React.memo(AboutMe);
