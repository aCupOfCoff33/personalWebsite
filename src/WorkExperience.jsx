import React from "react";

const WorkExperience = ({ date, title, company, description, tags, link, icon }) => {
  return (
    <div className="flex mb-8">
      {/* Date */}
      <div className="w-1/4 text-gray-400 text-sm">{date}</div>

      {/* Details Section */}
      <div className="w-3/4">
        {/* Title and Company */}
        <div className="flex items-center mb-2">
          <h3 className="text-white text-lg font-bold">
            {title} <span className="text-gray-400">@</span>
          </h3>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2"
          >
            <img
              src={icon}
              alt={`${company} logo`}
              className="w-6 h-6 rounded-lg hover:rounded-md hover:scale-105 transition-all duration-300"
            />
          </a>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 flex items-center group"
          >
            <span className="text-white font-bold underline group-hover:text-gray-300 transition-colors duration-300">
              {company}
            </span>
            <span
              className="ml-2 text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              ↗
            </span>
          </a>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-3">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full"
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