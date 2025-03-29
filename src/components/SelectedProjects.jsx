import React from "react";
import ProjectItem from "./ProjectItem";

const SelectedProjects = () => {
  const projects = [
    {
      date: "dec 2024 - march 2025",
      title: "2257 feasibility project - onepack",
      description:
        "developed onepack, a sustainable packaging solution that combines reusability with convenience for eco-conscious consumers. conducted market research to identify demand for alternatives to single-use containers, then designed an affordable product using recycled materials. created a business model balancing environmental impact with practicality for on-the-go use.",
      tags: ["market research", "financial projections", "react three fiber"],
      link: "https://onepack.aaryanj.tech/", 
    },
    {
      date: "dec 2024",
      title: "algorithmic trading bot",
      description:
        "built an algorithmic trading system leveraging python, pandas, and streamlit. used moving average crossover strategies and financial metrics to optimize trading workflows and enhance portfolio returns.",
      tags: ["python", "streamlit", "pandas"],
      link: null, 
    },
    {
      date: "dec 2024",
      title: "2 chatbots talking to each other",
      description:
        "designed and deployed a real-time ai-powered chat platform with flan-t5 language models. implemented robust api management and advanced similarity checks to enable dynamic, interactive conversations.",
      tags: ["python", "react", "tailwind", "ai/ml", "fast.api"],
      link: "https://github.com/aCupOfCoff33/chatBot2202",
    },
    {
      date: "sept 2024 - nov 2024",
      title: "western alumni database",
      description:
        "developed a react-based alumni networking platform for seamless navigation and scalability. connected 2,000+ students with 300+ alumni, fostering meaningful professional relationships.",
      tags: ["javascript", "react", "tailwind", "typescript", "python"],
      link: "https://github.com/aCupOfCoff33/alumniVersePersonalCopy",
    },
    {
      date: "sept 2024 - oct 2024",
      title: "uwo tech system",
      description:
        "co-created a notification platform for tech clubs using telnyx and google sheets apis. improved event alert efficiency by 30%, enabling personalized communication for 1,000+ users.",
      tags: ["python", "html & css", "google telnyx"],
      link: "https://westerntechnotifications.vercel.app/",
    },
  ];

  return (
    <div className="space-y-8 px-6 sm:px-12">
      <h2 className="text-white text-3xl font-bold mb-8">select projects</h2>
      {projects.map((project, index) => (
        <ProjectItem key={index} {...project} />
      ))}
    </div>
  );
};

export default SelectedProjects;
