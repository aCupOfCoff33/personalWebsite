import React from "react";
import ContentSection from './ContentSection';

// Sample data for Stories section
const storiesData = [
  {
    id: 'reddit-mlb',
    title: 'Reddit MLB',
    subtitle: 'Building a comprehensive baseball statistics platform',
    dates: 'May 31, 2025',
    readTime: '16 min read',
    description: 'Creating a modern interface for baseball analytics with real-time data integration and advanced visualizations.',
    image: 'https://placehold.co/600x400/ff4500/ffffff?text=Reddit+MLB',
    accent: 'orange',
    category: 'Web Development',
  },
  {
    id: 'goodnotes-lm',
    title: 'Creation of GoodNotes LM',
    subtitle: 'AI-powered note-taking revolution',
    dates: 'May 10, 2025',
    readTime: '37 min read',
    description: 'Developing an intelligent note-taking system that understands context and provides smart suggestions.',
    image: 'https://placehold.co/600x400/00d4ff/ffffff?text=GoodNotes+LM',
    accent: 'cyan',
    category: 'AI/ML',
  },
  {
    id: 'branding-networking',
    title: 'Branding > Networking',
    subtitle: 'The power of personal brand in tech',
    dates: 'Apr 14, 2025',
    readTime: '4 min read',
    description: 'Why building a strong personal brand matters more than traditional networking in today\'s digital world.',
    image: 'https://placehold.co/600x400/333333/ffffff?text=Branding',
    accent: 'blue',
    category: 'Career',
  },
  {
    id: 'uc-davis-writing',
    title: 'Guest Writing for UC Davis',
    subtitle: 'Contributing to academic discourse',
    dates: 'Mar 6, 2025',
    readTime: '3 min read',
    description: 'Sharing insights on technology trends and career development with the UC Davis community.',
    image: 'https://placehold.co/600x400/007acc/ffffff?text=UC+Davis',
    accent: 'blue',
    category: 'Writing',
  },
  {
    id: 'code-tech-camp',
    title: 'Featuring Code Tech Camp',
    subtitle: 'Empowering the next generation of developers',
    dates: 'Feb 26, 2025',
    readTime: '8 min read',
    description: 'Highlighting innovative coding education programs that are shaping the future of tech education.',
    image: 'https://placehold.co/600x400/6366f1/ffffff?text=Code+Camp',
    accent: 'purple',
    category: 'Education',
  },
];

// Stories section using the reusable ContentSection with grid layout
export default function Stories() {
  return (
    <ContentSection
      title="Stories"
      subtitle="Thoughts, projects, and insights from my journey in tech."
      items={storiesData}
      layout="grid"
      showGradientBar={false}
      columns={{ base: 1, md: 2, lg: 3 }}
    />
  );
}
