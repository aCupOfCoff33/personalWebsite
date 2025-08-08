import Hero from './HeyThere';
import Experiences from './Experiences';
import Stories from './Stories';
import Experience from './Experience';

export default function Home() {
    return (
      <>
        <section className="relative min-h-screen flex items-start pt-4 md:pt-8" data-bg-scene="hero">
          <div className="mx-auto max-w-screen-xl px-6 w-full z-10">
            <Hero />
          </div>
          {/* remove previous black fade to keep continuous background */}
          {/* spacer removed intentionally */}
        </section>
        {/* Experiences Section */}
        <div className="w-full flex justify-center items-center" data-bg-scene="projects">
          <Experiences />
        </div>
        {/* Stories Section */}
        <div className="w-full flex justify-center items-center" data-bg-scene="stories">
          <Stories />
        </div>
        {/* Experience Section */}
        <div className="w-full flex justify-center items-center" data-bg-scene="experience">
          <Experience />
        </div>
      </>
    );
  }
  