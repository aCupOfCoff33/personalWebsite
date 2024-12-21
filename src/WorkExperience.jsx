import React from "react";
import { HiExternalLink } from "react-icons/hi";

const WorkExperience = ({ date, title, company, description, tags, link, icon }) => {
  return (
    <div className="flex flex-col md:flex-row mb-8 items-start">
      {/* Date */}
      <div className="md:w-1/4 mb-2 md:mb-0 text-gray-400 text-sm md:text-right pr-4">
        {date}
      </div>

      {/* Details Section */}
      <div className="md:w-3/4">
        {/* Title and Company */}
        <div className="flex items-center">
          <span className="text-white font-bold text-lg">
            {title} <span className="text-gray-400">@</span>
          </span>
          {/* Icon */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 flex-shrink-0 transform transition-transform duration-300"
          >
            <img
              src={icon}
              alt={company}
              className="w-8 h-8 rounded-lg hover:rounded-md hover:scale-105 transition-all duration-300"
            />
          </a>
          {/* Company Name */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center group text-white font-bold text-lg transition-all duration-300"
          >
            <span className="group-hover:text-gray-300 underline">
              {company}
            </span>
            <HiExternalLink
              className="ml-1 text-gray-400 group-hover:text-gray-300 group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform duration-300"
            />
          </a>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mt-2">{description}</p>

        {/* Tags */}
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