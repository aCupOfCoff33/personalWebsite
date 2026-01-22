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
    <div className="flex flex-col lg:flex-row lg:mb-6">
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
          {link ? (
            <div className="group cursor-pointer">
              <div className="flex items-center mb-1">
                <h3 className="text-white text-base sm:text-xl lg:text-2xl font-bold group-hover:text-gray-300 transition-colors duration-300">
                  {title}
                </h3>
                <span className="ml-3 text-gray-400 text-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-1">
                  ↗
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src={icon}
                  alt={`${company} logo`}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-semibold flex items-center underline group-hover:text-gray-300 transition-colors duration-300"
                >
                  {company}
                </a>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-white text-base sm:text-xl lg:text-2xl font-bold">
                {title}
              </h3>
              <span className="flex items-center space-x-2 mt-1">
                <img
                  src={icon}
                  alt={`${company} logo`}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg"
                />
                <span className="text-white font-semibold">{company}</span>
              </span>
            </div>
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

export default WorkExperience;
