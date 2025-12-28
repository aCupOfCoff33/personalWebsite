// Unified Bear Icon orchestrator: single SVG with BaseBear and conditional accessories
import React, { useEffect, useId, useState, useCallback } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useBearState } from "../../../hooks/useBearState";
import { BEAR_MODES } from "../../../constants/bearModes";
import BaseBear from "./BaseBear";
import Laptop from "./Laptop";
import Book from "./Book";
import QuarterZip from "./QuarterZip";
import BearEyes from "./BearEyes";

const typeToComp = (type) => {
  switch (type) {
    case BEAR_MODES.PROJECTS:
      return Laptop;
    case BEAR_MODES.STORIES:
      return Book;
    case BEAR_MODES.ABOUT:
      return QuarterZip;
    default:
      return null;
  }
};

const UnifiedBearIcon = React.memo(function UnifiedBearIcon({
  className = "",
}) {
  const { bearType } = useBearState();
  const uid = useId();
  const desiredType = bearType || BEAR_MODES.DEFAULT;
  const [renderedType, setRenderedType] = useState(desiredType);
  const [pendingType, setPendingType] = useState(null);

  useEffect(() => {
    if (pendingType) {
      if (pendingType !== desiredType) setPendingType(desiredType);
      return;
    }
    if (desiredType === renderedType) return;
    if (renderedType !== BEAR_MODES.DEFAULT) {
      setPendingType(desiredType);
      setRenderedType(BEAR_MODES.DEFAULT);
      return;
    }
    setRenderedType(desiredType);
  }, [desiredType, renderedType, pendingType]);

  const handleExitComplete = useCallback(() => {
    if (!pendingType) return;
    if (pendingType !== BEAR_MODES.DEFAULT) {
      setRenderedType(pendingType);
    }
    setPendingType(null);
  }, [pendingType]);

  const ActiveComp = typeToComp(renderedType);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 68 68"
      fill="none"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <BaseBear />
      <BearEyes mode={desiredType} />
      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={handleExitComplete}
      >
        {ActiveComp ? (
          <Motion.g
            key={renderedType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ActiveComp position="visible" idSuffix={`-${uid}-${renderedType}`} />
          </Motion.g>
        ) : null}
      </AnimatePresence>
    </svg>
  );
});

UnifiedBearIcon.displayName = "UnifiedBearIcon";
export default UnifiedBearIcon;
