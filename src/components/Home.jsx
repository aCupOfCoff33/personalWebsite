import Hero from './HeyThere';
import Experiences from './Experiences';

export default function Home() {
    return (
      <>
        <section className="relative min-h-screen flex items-start pt-32 md:pt-48">
          <div className="mx-auto max-w-screen-xl px-6 w-full z-10">
            <Hero />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-black z-0" />
        </section>
        {/* Experiences Section */}
        <div className="w-full flex justify-center items-center">
          <Experiences />
        </div>
      </>
    );
  }
  