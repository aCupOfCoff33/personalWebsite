import React from "react";
import aaryan from "../assets/aaryan.png";

const NewAboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto pt-16 p-6 sm:pt-20 sm:p-16 lg:pt-24 lg:p-16 text-white font-['DM Sans'] space-y-6">
      <div className="flex justify-center">
        <img
          src={aaryan}
          alt="About"
          className="rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg"
        />
      </div>

      {/* Add Content Below */}
      <p className="text-lg lg:text-xl mt-8 mb-4 text-center">
        welcome to my personal website– a space where i share my journey,
        projects, and updates, all in one place!
      </p>
      <p className="text-base sm:text-lg lg:text-xl leading-relaxed mb-6 text-justify">
        when I’m not studying for exams, I focus on innovative projects with
        western’s largest tech club, western developers society. from
        collaborating on robotics with user-friendly uis to designing western’s
        first student-centric scheduling app, i’m passionate about creating
        impactful and functional solutions.
      </p>
      <p className="text-base sm:text-lg lg:text-xl leading-relaxed mb-6 text-justify">
        currently, much of my focus has been on a pro-bono project for a top 10
        canadian mortgage company. This involves conducting extensive market
        research, identifying customer pain points, and exploring how artificial
        intelligence can enhance their platform to expand reach and improve user
        experience.
      </p>
      <p className="text-base sm:text-lg lg:text-xl leading-relaxed mb-6 text-justify">
        beyond academics and projects, I find joy in music (
        <a
          href="https://open.spotify.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-300 transition duration-200"
        >
          feel free to check out my spotify!
        </a>
        ) and swimming competitively! these passions offer a creative escape and
        inspire me to approach problem-solving with fresh perspectives.
      </p>
      <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-justify">
        if you’re working on an exciting project or have ideas to collaborate
        on, feel free to reach out via email at{" "}
        <a
          href="mailto:aaryanj@outlook.com"
          className="text-gray-400 hover:text-gray-300 transition duration-200"
        >
          aaryanj@outlook.com
        </a>
        , connect with me on{" "}
        <a
          href="https://www.linkedin.com/in/aaryanj/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-300 transition duration-200"
        >
          linkedIn
        </a>
        , or follow along on{" "}
        <a
          href="https://www.instagram.com/aaryanj05/" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-300 transition duration-200"
        >
          instagram
        </a>{" "}
        for updates on my journey. i’m always eager to connect and learn from
        like-minded individuals!
      </p>
    </div>
  );
};

export default NewAboutPage;
