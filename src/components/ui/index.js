// Central UI components export
// This makes importing components easier and provides a clear API

// Core UI Components
export { default as Button } from './Button';
export { default as SectionHeading } from './SectionHeading';

// Layout & Content Components
export { default as ContentCard } from './ContentCard';
export { default as ContentGrid } from './ContentGrid';
export { default as ContentCarousel } from './ContentCarousel';
export { default as ContentSection } from './ContentSection';

// Re-export common components for better organization
export { default as ErrorBoundary } from '../common/ErrorBoundary';

// Bear-related components (could be moved to a separate module)
export { default as UnifiedBearIcon } from '../common/UnifiedBearIcon';
export { default as BearDebug } from '../common/BearDebug';
