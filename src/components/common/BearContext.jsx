import React, { createContext, useMemo } from "react";
import { useLocation } from "react-router-dom";

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

    if (segments.includes("projects")) return "projects"; // macbook
    if (segments.includes("notes") || segments.includes("stories"))
      return "stories"; // reading/book
    if (segments.includes("about")) return "about"; // green quarter zip
    return "default";
  };

  const bearType = useMemo(
    () => detectType(location),
    [location.pathname, location.hash],
  );

  return (
    <BearContext.Provider value={{ bearType }}>{children}</BearContext.Provider>
  );
};

export { BearContext };
export default BearProvider;
