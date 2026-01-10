import React from "react";
import PropTypes from "prop-types";
import {
  NotesTOCActionsContext,
  NotesTOCContext,
  NotesScrollContext,
} from "./notesContexts";

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
