import React from 'react';
import PropTypes from 'prop-types';

// Context used to pass table-of-contents data from a note page to the sidebar
// Consumers: `Navbar` (desktop) and any other components that want to show a TOC
export const NotesTOCContext = React.createContext({
  tocItems: [],
  setTocItems: () => {},
  tocVisible: false,
  setTocVisible: () => {},
  contactCollapsed: false,
  setContactCollapsed: () => {},
  readingProgress: 0,
  setReadingProgress: () => {},
});

export function NotesProvider({ children }) {
  const [tocItems, setTocItems] = React.useState([]);
  const [tocVisible, setTocVisible] = React.useState(false);
  const [contactCollapsed, setContactCollapsed] = React.useState(false);
  const [readingProgress, setReadingProgress] = React.useState(0);

  const value = React.useMemo(
    () => ({ tocItems, setTocItems, tocVisible, setTocVisible, contactCollapsed, setContactCollapsed, readingProgress, setReadingProgress }),
    [tocItems, tocVisible, contactCollapsed, readingProgress],
  );

  return <NotesTOCContext.Provider value={value}>{children}</NotesTOCContext.Provider>;
}

NotesProvider.propTypes = {
  children: PropTypes.node,
};

export function useNotesTOC() {
  return React.useContext(NotesTOCContext);
}


