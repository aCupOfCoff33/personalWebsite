import React from "react";
import ProjectItem from "./ProjectItem";

const SelectedProjects = () => {
  const projects = [
    {
      date: "june 2023",
      title: "2 chatbots talking to each other",
      description: "used llm’s to communicate with each other.",
      tags: ["javascript", "react", "tailwind", "google co-lab"],
      link: "#",
    },
    {
      date: "april 2023",
      title: "western alumni database",
      description:
        "developed a networking platform connecting 300+ alumni and students for coffee chats and career opportunities.",
      tags: ["javascript", "react", "tailwind"],
      link: "#",
    },
    {
      date: "feb 2023",
      title: "uwo tech system",
      description:
        "co-created a notification system enabling 1000+ users to receive personalized tech event alerts across the 3 biggest clubs at western university.",
      tags: ["python", "html & css", "google telnyx"],
      link: "#",
    },
    {
      date: "dec 2022",
      title: "algorithmic trading bot",
      description:
        "built an algorithmic trading strategy using moving averages, improving profit analysis and performance evaluation with advanced data metrics.",
      tags: ["python", "react", "tailwind"],
      link: "#",
    },
  ];

  return (
    <div className="pt-12 px-6 sm:px-12">
      <h2 className="text-white text-2xl font-bold mb-8">selected projects</h2>
      <div className="flex flex-col space-y-4">
        {projects.map((project, index) => (
          <ProjectItem key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default SelectedProjects;