import React from "react";
import AaryanImage from "/aaryan.png";    // Ensure these paths are correct
import Background from "/background.png";  // Ensure these paths are correct

const AboutMe = () => (
  <>
    {/* ---- Foreground content ---- */}
    <section className="relative z-10 w-full px-6 py-48 text-white font-adamant">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-16 lg:flex-row lg:items-start">
        {/* Image container */}
        {/* Consider adding max-w-full for better responsiveness on smaller screens */}
        <div className="relative w-full max-w-[600px] h-[486px] flex-shrink-0"> {/* Added max-w-full and flex-shrink-0 */}
          {/* Background image (shadow layer) */}
          <img
            src={Background}
            alt="accent"
            className="absolute top-24 left-0 w-full h-96 -z-10"
            loading="lazy" decoding="async" /* Reduce initial cost */
          />

          {/* Foreground portrait */}
          <img
            src={AaryanImage}
            alt="Aaryan"
            className="relative z-10 w-full h-full  shadow-xl"
            loading="lazy" decoding="async" /* Reduce initial cost */
          />
        </div>

        {/* Text aligned vertically with the top of the background image */}
        {/* Removed justify-center and min-h-[384px] */}
        {/* Added lg:mt-24 to match the background image's top-24 */}
        <div className="w-full max-w-xl flex flex-col lg:mt-24">
          <h2 className="mb-6 text-3xl italic lg:text-4xl">About Me</h2>

          <p className="text-lg leading-relaxed lg:text-xl">
            Technically a Western U student studying SWE + Ivey Business but most of what I care about happens outside the syllabus.
            <br/><br/>

            I’m in third year, graduating in 2028 and based near Toronto. I make UI that doesn’t fight the user and data that actually answers something.



            <br/><br/>

            Outside of
            that, I swim uncompetitive-ly, follow Mercedes in F1 out of loyalty
            more than logic, and build playlists on Spotify like it’s an unpaid
            second job.

            <br/><br/>
            No big story behind the bear. He’s just cool. And
            stayed.
          </p>
        </div>
      </div>
    </section>
  </>
);

// Optimized for performance by adding React.memo to avoid unnecessary re-renders
export default React.memo(AboutMe);