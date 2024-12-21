import React from "react";
import { HiExternalLink } from "react-icons/hi";

const WorkExperience = ({ date, title, company, description, tags, link, icon }) => {
  return (
    <div className="flex flex-col md:flex-row mb-8">
      {/* Date Section */}
      <div className="md:w-1/4 mb-2 md:mb-0 text-gray-400 text-sm md:text-right pr-4">
        {date}
      </div>
      {/* Main Content */}
      <div className="md:w-3/4">
        <h3 className="text-white text-lg font-bold flex items-center">
          {title}{" "}
          <img
            src={icon}
            alt={`${company} logo`}
            className="h-6 w-6 rounded-full ml-2 mr-2 transition-transform transform hover:scale-105"
          />
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-all ml-1 flex items-center"
          >
            @{company}
            <HiExternalLink className="inline ml-1 hover:translate-y-[-2px]" />
          </a>
        </h3>
        <p className="text-gray-300 text-sm mt-2">{description}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-800 text-white text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkExperience;