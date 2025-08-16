// Unified Bear Icon component that manages all states and animations
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNotesTOC } from './notes/NotesContext';
import BearIconSVG from './BearIcon';
import BearIconProjects from './BearIconProjects';
import BearIconReading from './BearIconReading';

const UnifiedBearIcon = React.memo(({ className = '' }) => {
  const location = useLocation();
  const { tocItems } = useNotesTOC();
  
  const isProjectsRoute = location.pathname.startsWith('/projects');
  const isNotesRoute = location.pathname.startsWith('/notes/');

  // Render all bear components, let them manage their own visibility
  // This approach ensures smooth transitions between states
  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
      {/* Default bear - always rendered, manages its own visibility */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0,
          opacity: (!isProjectsRoute && (!isNotesRoute || !tocItems?.length)) ? 1 : 0,
          transition: 'opacity 200ms ease-in-out'
        }}
      >
        <BearIconSVG className="w-full h-full" />
      </div>
      
      {/* Projects bear - always rendered, manages its own item animation */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0,
          opacity: isProjectsRoute ? 1 : 0,
          transition: 'opacity 200ms ease-in-out'
        }}
      >
        <BearIconProjects className="w-full h-full" />
      </div>
      
      {/* Reading bear - always rendered, manages its own item animation */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0,
          opacity: (isNotesRoute && tocItems?.length > 0) ? 1 : 0,
          transition: 'opacity 200ms ease-in-out'
        }}
      >
        <BearIconReading className="w-full h-full" />
      </div>
    </div>
  );
});

UnifiedBearIcon.displayName = 'UnifiedBearIcon';
export default UnifiedBearIcon;
