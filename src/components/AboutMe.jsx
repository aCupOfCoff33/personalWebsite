import React from "react";
import AaryanImage from "/aaryan.png"; // Make sure these paths are correct relative to your project setup
import Background from "/background.png"; // Make sure these paths are correct relative to your project setup
import HeroBackground from "./HeroBackground";

const AboutMe = () => (
  <>
    {/* ---- Blurred mesh gradient (fixed, sits behind) ---- */}
    <HeroBackground />

    {/* ---- Foreground content ---- */}
    <section className="relative z-10 w-full px-6 py-48 text-white font-adamant">
      {/* Align items to the start (top) on large screens */}
      <div className="mx-auto flex max-w-screen-xl flex-col gap-16 lg:flex-row lg:items-start">
        {/* Image container */}
        <div className="relative w-[600px] h-[486px]"> {/* Consider max-w-full lg:max-w-[600px] for responsiveness */}
          {/* Background image (shadow layer) - Starts 24 units down */}
          <img
            src={Background}
            alt="accent"
            className="absolute top-24 left-0 w-full h-96 object-cover rounded-[40px] -z-10"
          />

          {/* Foreground portrait */}
          <img
            src={AaryanImage}
            alt="Aaryan"
            className="relative z-10 w-full h-full object-cover shadow-xl" // Removed unnecessary max-w-full as width is fixed
          />
        </div>

        {/* Text aligned vertically with the top of the background image */}
        {/* Added lg:mt-24 to match the background image's top-24 */}
        {/* Removed justify-center */}
        <div className="w-full max-w-xl flex flex-col lg:mt-24">
          <h2 className="mb-6 text-3xl italic lg:text-4xl">About Me</h2>

          <p className="text-lg leading-relaxed lg:text-xl">
            Hey, I’m Aaryan! I’m studying SWE and Business at Western,
            graduating in 2028. I’m based just outside Toronto, but you’ll
            usually find me online, building something or figuring stuff out.
            <br />
            <br />
            In my downtime I’m either watching F1 (still hoping Mercedes figures
            something out), swimming competitively, or making playlists that I
            swear beat Spotify’s algorithm.
            <br />
            <br />
              Feel free to look around or click my socials if you wanna connect
              :)
          </p>
        </div>
      </div>
    </section>
  </>
);

export default AboutMe;