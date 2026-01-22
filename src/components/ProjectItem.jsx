import React from "react";

const ProjectItem = ({ date, title, description, tags, link, icon }) => {
  return (
    <div className="flex flex-col lg:flex-row mb-10">
      {/* Date Section */}
      <div className="lg:w-1/4 lg:text-gray-400 lg:text-lg lg:pr-4 lg:flex-shrink-0">
        <div className="text-gray-400 text-sm lg:text-lg">{date}</div>
      </div>

      {/* Details Section */}
      <div className="lg:w-3/4">
        {/* Title with optional Arrow */}
        <div className="flex items-center mb-4">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center group"
            >
              <span className="text-white text-base sm:text-xl lg:text-2xl font-bold underline group-hover:text-gray-300 transition-colors duration-300">
                {title}
              </span>
              <span className="ml-3 text-gray-400 text-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-1">
                ↗
              </span>
            </a>
          ) : (
            <span className="text-white text-base sm:text-xl lg:text-2xl font-bold">
              {title}
            </span>
          )}
          {icon && (
            <img
              src={icon}
              alt={`${title} icon`}
              className="w-6 h-6 sm:w-8 sm:h-8 ml-4 rounded-lg transition-all duration-300 group-hover:rounded-md"
            />
          )}
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-4">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-800 text-white text-xs sm:text-sm px-3 py-1 rounded-full"
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
