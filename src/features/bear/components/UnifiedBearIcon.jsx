// Unified Bear Icon orchestrator: single SVG with BaseBear and conditional accessories
import React, { useEffect, useId, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useBearState } from "../../../hooks/useBearState";
import { BEAR_MODES } from "../../../constants/bearModes";
import BaseBear from "./BaseBear";
import BearEyes from "./BearEyes";
import BearAccessoryManager, {
  hasAccessoryForType,
} from "./BearAccessoryManager";

const UnifiedBearIcon = React.memo(function UnifiedBearIcon({
  className = "",
}) {
  const { bearType } = useBearState();
  const uid = useId();
  const desiredType = bearType || BEAR_MODES.DEFAULT;
  const [renderedType, setRenderedType] = useState(desiredType);
  const [pendingType, setPendingType] = useState(null);
  const bearEyesRef = useRef(null);

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

  const shouldRenderAccessory = hasAccessoryForType(renderedType);

  const handleClick = useCallback(() => {
    if (bearEyesRef.current?.triggerBlink) {
      bearEyesRef.current.triggerBlink();
    }
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 68 68"
      fill="none"
      className={className}
      role="img"
      aria-hidden="true"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <BaseBear />
      <BearEyes ref={bearEyesRef} mode={desiredType} />
      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={handleExitComplete}
      >
        {shouldRenderAccessory ? (
          <Motion.g
            key={renderedType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <BearAccessoryManager
              type={renderedType}
              position="visible"
              idSuffix={`-${uid}-${renderedType}`}
            />
          </Motion.g>
        ) : null}
      </AnimatePresence>
    </svg>
  );
});

UnifiedBearIcon.displayName = "UnifiedBearIcon";
export default UnifiedBearIcon;
