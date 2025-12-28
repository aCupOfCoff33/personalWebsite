import React from "react";
import {
  NotesTOCActionsContext,
  NotesTOCContext,
  NotesScrollContext,
} from "./notesContexts";

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
