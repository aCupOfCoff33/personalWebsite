import React from "react";
import PropTypes from "prop-types";

// Static TOC Context - for data that changes infrequently
// Used by Navbar and other components that don't need scroll updates
const NotesTOCContext = React.createContext({
  tocItems: [],
  tocVisible: false,
  contactCollapsed: false,
});

// Scroll State Context - for rapidly changing scroll data
// Used only by components that need real-time scroll updates (e.g., BearIconReading)
const NotesScrollContext = React.createContext({
  readingProgress: 0,
});

// Actions Context - for setters (doesn't cause re-renders when consumed)
const NotesTOCActionsContext = React.createContext({
  setTocItems: () => {},
  setTocVisible: () => {},
  setContactCollapsed: () => {},
  setReadingProgress: () => {},
});

export function NotesProvider({ children }) {
  // Static state
  const [tocItems, setTocItems] = React.useState([]);
  const [tocVisible, setTocVisible] = React.useState(false);
  const [contactCollapsed, setContactCollapsed] = React.useState(false);

  // Rapidly changing state
  const [readingProgress, setReadingProgress] = React.useState(0);

  // Memoize static context value - only updates when static data changes
  const tocValue = React.useMemo(
    () => ({ tocItems, tocVisible, contactCollapsed }),
    [tocItems, tocVisible, contactCollapsed],
  );

  // Memoize scroll context value - updates frequently but isolated
  const scrollValue = React.useMemo(
    () => ({ readingProgress }),
    [readingProgress],
  );

  // Memoize actions - never changes, prevents unnecessary re-renders
  const actions = React.useMemo(
    () => ({
      setTocItems,
      setTocVisible,
      setContactCollapsed,
      setReadingProgress,
    }),
    [], // Empty deps - setters are stable
  );

  return (
    <NotesTOCActionsContext.Provider value={actions}>
      <NotesTOCContext.Provider value={tocValue}>
        <NotesScrollContext.Provider value={scrollValue}>
          {children}
        </NotesScrollContext.Provider>
      </NotesTOCContext.Provider>
    </NotesTOCActionsContext.Provider>
  );
}

NotesProvider.propTypes = {
  children: PropTypes.node,
};

// Hook for static TOC data (used by Navbar)
// Only causes re-renders when tocItems, tocVisible, or contactCollapsed change
export function useNotesTOC() {
  return React.useContext(NotesTOCContext);
}

// Hook for scroll progress (used by BearIconReading)
// Re-renders frequently but only affects components that need it
export function useNotesScroll() {
  return React.useContext(NotesScrollContext);
}

// Hook for actions/setters (used by NotePage)
// Doesn't cause re-renders when consumed
export function useNotesTOCActions() {
  return React.useContext(NotesTOCActionsContext);
}

// Legacy hook for backward compatibility - combines all data
// Only use this if you truly need all the data
export function useNotesTOCLegacy() {
  const toc = useNotesTOC();
  const scroll = useNotesScroll();
  const actions = useNotesTOCActions();
  return { ...toc, ...scroll, ...actions };
}
