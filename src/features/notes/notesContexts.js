import React from "react";

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

export { NotesTOCContext, NotesScrollContext, NotesTOCActionsContext };
