import React from "react";

const ProjectItem = ({ date, title, description, tags, link, icon }) => {
  return (
    <div className="flex mb-10">
      {/* Date */}
      <div className="w-1/4 text-gray-400 text-lg">{date}</div>

      {/* Details Section */}
      <div className="w-3/4">
        {/* Title with Arrow */}
        <div className="flex items-center mb-4">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center group"
          >
            <span className="text-white text-2xl font-bold underline group-hover:text-gray-300 transition-colors duration-300">
              {title}
            </span>
            <span
              className="ml-3 text-gray-400 text-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-1"
            >
              ↗
            </span>
          </a>
          {icon && (
            <img
              src={icon}
              alt={`${title} icon`}
              className="w-8 h-8 ml-4 rounded-lg hover:scale-110 transition-all duration-300"
            />
          )}
        </div>

        {/* Description */}
        <p className="text-gray-300 text-lg mb-4">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-800 text-white text-base px-4 py-2 rounded-full"
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