import React from "react";

const ProjectItem = ({ date, title, description, tags, link }) => {
  return (
    <div className="mb-6">
      <div className="text-gray-400 text-sm mb-1">{date}</div>
      <h3 className="text-white text-lg font-bold flex items-center">
        {title}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300 transition-all ml-2 flex items-center"
        >
          <span> </span>
        </a>
      </h3>
      <p className="text-gray-300 text-sm mt-1">{description}</p>
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
  );
};

export default ProjectItem;