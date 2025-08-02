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
    image: 'https://placehold.co/481x280/3b82f6/ffffff?text=American+Global',
    logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQFxOWSzcQlx7w/company-logo_200_200/company-logo_200_200/0/1672776000338/american_global_llc_logo?e=2147483647&v=beta&t=6eASPMK3qET6z-fVO8yv4YWrhgf7l7wjaAwu_iF8q2s',
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
    logo: 'https://pbs.twimg.com/profile_images/1305515099218751489/AcSX2X9I_400x400.jpg',
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
    logo: 'https://www.aaryanj.tech/assets/WDS-BqX8pcx0.png',
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
    logo: 'https://cdn-images-1.medium.com/max/1200/1*429tXOeB5sYvQ37L-zasBQ.jpeg',
    accent: 'emerald',
    category: 'Consulting',
  },
];

// Selected Works section using the reusable ContentSection
export default function SelectedWorks() {
  const handleViewAllClick = () => {
    // You can implement navigation to a full works page here
    console.log('Navigate to all selected works page');
    // For example: navigate('/works') or window.location.href = '/works'
  };

  return (
    <ContentSection
      title="Things I've Built in My Cave"
      subtitle="Projects, roles, and highlights from my journey."
      items={selectedWorksData}
      layout="carousel"
      showGradientBar={true}
      showControls={true}
      cardVariant="glass" // Use glass variant for horizontal carousel
      maxItems={6} // Show only first 6 items initially
      showViewAll={true} // Enable "View All Projects" button
      onViewAllClick={handleViewAllClick}
    />
  );
}
