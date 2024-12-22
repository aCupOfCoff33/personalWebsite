import React from "react";

const WorkExperience = ({
  date,
  title,
  company,
  description,
  tags,
  link,
  icon,
}) => {
  return (
    <div className="mb-10 flex flex-col lg:flex-row">
      {/* Date */}
      <div className="lg:w-1/4 lg:text-gray-400 lg:text-lg lg:pr-4 lg:flex-shrink-0">
        <div className="text-gray-400 text-sm mb-2 lg:mb-0 lg:text-lg">
          {date}
        </div>
      </div>

      {/* Details Section */}
      <div className="lg:w-3/4">
        {/* Title and Company */}
        <div className="lg:flex lg:items-center lg:space-x-4 mb-2 lg:mb-4">
          <h3 className="text-white text-base sm:text-xl lg:text-2xl font-bold">
            {title}
          </h3>

          {/* Company */}
          <div className="flex items-center">
            <img
              src={icon}
              alt={`${company} logo`}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg mr-2"
            />
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold hover:underline flex items-center group"
            >
              {company}
              <span className="ml-3 text-gray-400 text-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-1">
                ↗
              </span>
            </a>
          </div>
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

export default WorkExperience;
