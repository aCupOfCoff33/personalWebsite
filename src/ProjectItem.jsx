import React from "react";

const ProjectItem = ({ date, title, description, tags, link, icon }) => {
  return (
    <div className="flex mb-8">
      {/* Date on the Left */}
      <div className="w-1/4 text-gray-400 text-sm">{date}</div>

      {/* Details Section */}
      <div className="w-3/4">
        {/* Title as Link with Arrow */}
        <div className="flex items-center mb-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center group"
          >
            <span className="text-white font-bold underline group-hover:text-gray-300 transition-colors duration-300">
              {title}
            </span>
            <span
              className="ml-2 text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              ↗
            </span>
          </a>
          {icon && (
            <img
              src={icon}
              alt={`${title} icon`}
              className="w-5 h-5 ml-2 rounded-lg hover:rounded-md hover:scale-105 transition-all duration-300"
            />
          )}
        </div>

        {/* Description */}
        <p className="text-gray-300 text-base mt-2">{description}</p>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap gap-2">
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

export default ProjectItem;