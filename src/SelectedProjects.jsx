import React from "react";
import ProjectItem from "./ProjectItem";

const SelectedProjects = () => {
  const projects = [
    {
      date: "dec 2024",
      title: "2 chatbots talking to each other",
      description: "Used LLMs to communicate with each other.",
      tags: ["Python", "React", "Tailwind", "AI/ML"],
      link: "#",
    },
    {
      date: "sept 2024 - nov 2024",
      title: "western alumni database",
      description:
        "Developed a networking platform connecting 300+ alumni and students for coffee chats and career opportunities.",
      tags: ["JavaScript", "React", "Tailwind"],
      link: "#",
    },
    {
      date: "sept 2024 - oct 2024",
      title: "uwo tech system",
      description:
        "Co-created a notification system enabling 1000+ users to receive personalized tech event alerts across the 3 biggest clubs at Western University.",
      tags: ["Python", "HTML & CSS", "Google Telnyx"],
      link: "#",
    },
    {
      date: "dec 2024",
      title: "algorithmic trading bot",
      description:
        "Built an algorithmic trading strategy using moving averages, improving profit analysis and performance evaluation with advanced data metrics.",
      tags: ["Python", "React", "Tailwind"],
      link: "#",
    },
  ];

  return (
    <div className="pt-12 px-6 sm:px-12">
      <h2 className="text-white text-3xl font-bold mb-8">Selected Projects</h2>
      <div className="flex flex-col space-y-6">
        {projects.map((project, index) => (
          <ProjectItem key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default SelectedProjects;