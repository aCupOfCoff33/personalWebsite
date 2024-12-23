import React from "react";
import WorkExperience from "./WorkExperience";
import wdsLogo from "../assets/WDS.png";

const SelectedWorks = () => {
  const experiences = [
    {
      date: "sept 2023 — present",
      title: "vice president of dev/ops",
      company: "western developers society",
      description:
        "led 120+ developers on ai/ml and robotics projects, driving innovation through agile methods and creating competition-ready systems.",
      tags: ["ai/ml", "robotics", "agile"],
      link: "https://www.instagram.com/westerndevsociety/",
      icon: wdsLogo,
    },
    {
      date: "sept 2024 — present",
      title: "consultant analyst",
      company: "ivey fintech",
      description:
        "provided strategic recommendations to enhance mortgage ux, integrate ai, and improve operational efficiency for a digital mortgage company.",
      tags: ["ux", "ai", "fintech"],
      link: "https://www.iveyfintechclub.ca/",
      icon: "https://cdn-images-1.medium.com/max/1200/1*429tXOeB5sYvQ37L-zasBQ.jpeg",
    },
    {
      date: "may 2024 — aug 2024",
      title: "financial services",
      company: "esdc/government of canada",
      description:
        "streamlined financial processes using sap and powerbi, clearing $150,000 in suspense transactions and optimizing workflows across canada.",
      tags: ["sap", "powerbi", "finance"],
      link: "https://www.canada.ca/en/employment-social-development.html",
      icon: "https://pbs.twimg.com/profile_images/1305579087998656512/8xOQRoRo_400x400.jpg",
    },
    {
      date: "sept 2022 — march 2023",
      title: "business analyst",
      company: "minimart",
      description:
        "designed financial models and collaborated with stakeholders to enable sustainable growth, increasing profitability in competitive markets.",
      tags: ["business analysis", "finance", "sustainability"],
      link: null,
      icon: "https://banner2.cleanpng.com/20180630/xcw/aax01zjeu.webp",
    },
  ];

  return (
    <div className="pt-12 px-6">
      <h2 className="text-white text-3xl font-bold mb-8">
        selected work experiences
      </h2>
      <div className="flex flex-col space-y-10">
        {experiences.map((experience, index) => (
          <WorkExperience key={index} {...experience} />
        ))}
      </div>
    </div>
  );
};

export default SelectedWorks;
