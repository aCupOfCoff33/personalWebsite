import React, { createContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { BEAR_MODES } from "../../../constants/bearModes";

// Create context in separate file to avoid fast refresh issues
const BearContext = createContext();

const BearProvider = ({ children }) => {
  const location = useLocation();

  const detectType = (loc) => {
    // Be resilient to nested base paths and hash routing by checking segments from pathname + hash
    const rawSegments = []
      .concat(loc.pathname || "")
      .concat(loc.hash || "")
      .join("/")
      .split("/")
      .filter(Boolean)
      .map((seg) => seg.replace(/^#/, ""));

    const segments = rawSegments.filter(Boolean);

    if (segments.includes(BEAR_MODES.PROJECTS)) return BEAR_MODES.PROJECTS; // macbook
    if (segments.includes("notes") || segments.includes(BEAR_MODES.STORIES))
      return BEAR_MODES.STORIES; // reading/book
    if (segments.includes(BEAR_MODES.ABOUT)) return BEAR_MODES.ABOUT; // green quarter zip
    return BEAR_MODES.DEFAULT;
  };

  const bearType = useMemo(() => detectType(location), [location]);

  return (
    <BearContext.Provider value={{ bearType }}>{children}</BearContext.Provider>
  );
};

export { BearContext };
export default BearProvider;
