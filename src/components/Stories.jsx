import React from "react";
import ContentSection from './ContentSection';

// Sample data for Stories section - horizontal carousel layout
const storiesData = [
  {
    id: 'building-scalable-apis',
    title: 'Building Scalable APIs',
    dates: 'July 15, 2025',
    readTime: '8 min read',
    image: 'https://placehold.co/481x280/6366f1/ffffff?text=API+Design',
    accent: 'purple',
    category: 'Backend',
  },
  {
    id: 'react-performance-optimization',
    title: 'React Performance Optimization',
    dates: 'July 8, 2025',
    readTime: '12 min read',
    image: 'https://placehold.co/481x280/0ea5e9/ffffff?text=React+Perf',
    accent: 'blue',
    category: 'Frontend',
  },
  {
    id: 'ai-in-web-development',
    title: 'AI in Web Development',
    dates: 'June 28, 2025',
    readTime: '15 min read',
    image: 'https://placehold.co/481x280/10b981/ffffff?text=AI+Dev',
    accent: 'emerald',
    category: 'AI/ML',
  },
  {
    id: 'design-systems-at-scale',
    title: 'Design Systems at Scale',
    dates: 'June 20, 2025',
    readTime: '10 min read',
    image: 'https://placehold.co/481x280/f59e0b/ffffff?text=Design+Sys',
    accent: 'orange',
    category: 'Design',
  },
  {
    id: 'database-optimization-tips',
    title: 'Database Optimization Tips',
    dates: 'June 12, 2025',
    readTime: '7 min read',
    image: 'https://placehold.co/481x280/dc2626/ffffff?text=DB+Opt',
    accent: 'red',
    category: 'Database',
  },
  {
    id: 'typescript-advanced-patterns',
    title: 'TypeScript Advanced Patterns',
    dates: 'June 5, 2025',
    readTime: '14 min read',
    image: 'https://placehold.co/481x280/3b82f6/ffffff?text=TypeScript',
    accent: 'blue',
    category: 'TypeScript',
  },
];

// Stories section using the reusable ContentSection with horizontal carousel layout
export default function Stories() {
  return (
    <ContentSection
      title="Stories"
      subtitle="Insights, learnings, and thoughts from my journey in tech."
      items={storiesData}
      layout="carousel"
      showGradientBar={true}
      showControls={true}
      cardVariant="glass" // Use glass variant for horizontal carousel
    />
  );
}
