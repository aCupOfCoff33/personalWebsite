import React from "react";
import ContentSection from './ContentSection';

// Data for Selected Works
const selectedWorksData = [
  {
    id: 'american-global',
    title: 'American Global',
    subtitle: 'Data Analytics & Strategy Intern',
    dates: 'May 2025 – Present',
    description: 'Built a loss-ratio dashboard adopted by 30+ brokers, using React, Sanity, and Python ETL.',
    image: 'https://placehold.co/481x280',
    accent: 'blue',
  },
  {
    id: 'government-canada',
    title: 'Government of Canada',
    subtitle: 'Financial Services Intern',
    dates: 'May 2024 – Aug 2024',
    description: 'Automated reconciliation for 10+ accounts, saving 20 hrs/month; built reporting tools in R.',
    image: 'https://placehold.co/481x280',
    accent: 'red',
  },
  {
    id: 'western-dev',
    title: 'Western Developers Society',
    subtitle: 'VP of Development',
    dates: 'Sept 2023 – Present',
    description: 'Led a team of 8 to launch 3 web apps for student orgs; mentored new devs and ran weekly code-reviews.',
    image: 'https://placehold.co/481x280',
    accent: 'blue',
  },
  {
    id: 'ivey-fintech',
    title: 'Ivey Fintech',
    subtitle: 'Consultant Analyst',
    dates: 'Sept 2024 – Apr 2025',
    description: 'Analysed fintech trends and presented findings to 50+ students; built a Python tool for market-sizing.',
    image: 'https://placehold.co/481x280',
    accent: 'emerald',
  },
];

// Selected Works section using the reusable ContentSection
export default function SelectedWorks() {
  return (
    <ContentSection
      title="Selected Works"
      subtitle="Projects, roles, and highlights from my journey."
      items={selectedWorksData}
      layout="carousel"
      showGradientBar={true}
      showControls={true}
    />
  );
}
