import React from "react";
import ContentSection from './ContentSection';

// Selected Works data - converted to ContentSection format
const selectedWorksData = [
  {
    id: 'american-global',
    title: 'American Global',
    subtitle: 'Data Analytics & Strategy Intern',
    dates: 'May 2025 – Present',
    description: 'Built a loss-ratio dashboard adopted by 30+ brokers, using React, Sanity, and Python ETL.',
    image: 'https://placehold.co/481x280/3b82f6/ffffff?text=American+Global',
    accent: 'blue',
    category: 'Internship',
  },
  {
    id: 'government-canada',
    title: 'Government of Canada',
    subtitle: 'Financial Services Intern',
    dates: 'May 2024 – Aug 2024',
    description: 'Automated reconciliation for 10+ accounts, saving 20 hrs/month; built reporting tools in R.',
    image: 'https://placehold.co/481x280/dc2626/ffffff?text=Gov+Canada',
    accent: 'red',
    category: 'Internship',
  },
  {
    id: 'western-dev-society',
    title: 'Western Developers Society',
    subtitle: 'VP of Development',
    dates: 'Sept 2023 – Present',
    description: 'Led a team of 8 to launch 3 web apps for student orgs; mentored new devs and ran weekly code-reviews.',
    image: 'https://placehold.co/481x280/3b82f6/ffffff?text=WDS',
    accent: 'blue',
    category: 'Leadership',
  },
  {
    id: 'ivey-fintech',
    title: 'Ivey Fintech',
    subtitle: 'Consultant Analyst',
    dates: 'Sept 2024 – Apr 2025',
    description: 'Analysed fintech trends and presented findings to 50+ students; built a Python tool for market-sizing.',
    image: 'https://placehold.co/481x280/10b981/ffffff?text=Ivey+Fintech',
    accent: 'emerald',
    category: 'Consulting',
  },
  {
    id: 'project-5',
    title: 'Project Alpha',
    subtitle: 'Full Stack Developer',
    dates: 'Jan 2024 – May 2024',
    description: 'Built a real-time collaboration platform using Next.js, Socket.io, and MongoDB.',
    image: 'https://placehold.co/481x280/f59e0b/ffffff?text=Project+Alpha',
    accent: 'orange',
    category: 'Project',
  },
  {
    id: 'project-6',
    title: 'DataViz Pro',
    subtitle: 'Data Visualization Specialist',
    dates: 'Aug 2023 – Dec 2023',
    description: 'Created interactive dashboards for healthcare analytics using D3.js and Python.',
    image: 'https://placehold.co/481x280/8b5cf6/ffffff?text=DataViz+Pro',
    accent: 'purple',
    category: 'Project',
  },
  {
    id: 'project-7',
    title: 'EcoTrack',
    subtitle: 'Mobile App Developer',
    dates: 'Jun 2023 – Aug 2023',
    description: 'Developed a carbon footprint tracking app with React Native and Firebase.',
    image: 'https://placehold.co/481x280/059669/ffffff?text=EcoTrack',
    accent: 'emerald',
    category: 'Project',
  },
  {
    id: 'project-8',
    title: 'TechMentors',
    subtitle: 'Community Platform Lead',
    dates: 'Mar 2023 – Jun 2023',
    description: 'Built a mentorship platform connecting students with industry professionals.',
    image: 'https://placehold.co/481x280/0ea5e9/ffffff?text=TechMentors',
    accent: 'cyan',
    category: 'Project',
  },
];

// Selected Works section using ContentSection with ViewAll functionality
export default function SelectedWorks() {
  const handleViewAllClick = () => {
    // You can implement navigation to a full works page here
    console.log('Navigate to all selected works page');
    // For example: navigate('/works') or window.location.href = '/works'
  };

  return (
    <ContentSection
      title="Selected Works"
      subtitle="Projects, roles, and highlights from my journey."
      items={selectedWorksData}
      layout="carousel"
      showGradientBar={true}
      showControls={true}
      cardVariant="glass" // Use glass variant for horizontal carousel
      showViewAll={true}
      maxItems={6}
      onViewAllClick={handleViewAllClick}
    />
  );
}
