// Unified Bear Icon orchestrator: single SVG with BaseBear and conditional accessories
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useBearState } from "../../hooks/useBearState";
import BaseBear from "../bear/BaseBear";
import Laptop from "../bear/Laptop";
import Book from "../bear/Book";
import QuarterZip from "../bear/QuarterZip";
import BearEyes from "../bear/BearEyes";

const ANIM = {
  DURATION: 420, // ms for transform/opacity animation
  HALF: 210,
  ENTRY_DELAY: 120, // increase to allow layout/paint before animating in
};

const UnifiedBearIcon = React.memo(function UnifiedBearIcon({
  className = "",
}) {
  const { bearType } = useBearState();
  const uid = useId();
  const timeoutRefsRef = useRef([]);
  const navTokenRef = useRef(0);
  const [animState, setAnimState] = useState(() => ({
    currentType: "default",
    previousType: null,
    pendingType: null,
    itemPosition: "visible",
  }));

  const clearPendingTimeouts = () => {
    timeoutRefsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutRefsRef.current = [];
  };

  const scheduleStateUpdate = (delayMs, updateFn, token) => {
    const timeoutId = setTimeout(() => {
      if (navTokenRef.current === token) updateFn();
    }, delayMs);
    timeoutRefsRef.current.push(timeoutId);
  };

  useEffect(() => {
    const newType = bearType || "default";
    clearPendingTimeouts();
    const token = navTokenRef.current + 1;
    navTokenRef.current = token;

    setAnimState((prev) => {
      if (newType === prev.currentType && !prev.pendingType) return prev;
      if (newType === prev.currentType && prev.pendingType) {
        return {
          ...prev,
          previousType: null,
          pendingType: null,
          itemPosition: "visible",
        };
      }

      if (newType === "default") {
        return {
          ...prev,
          currentType: "default",
          previousType: null,
          pendingType: null,
          itemPosition: "visible",
        };
      }

      const startState = {
        ...prev,
        previousType: prev.currentType,
        pendingType: newType,
      };

      if (prev.currentType === "default") {
        startState.itemPosition = "hidden";
        scheduleStateUpdate(
          ANIM.ENTRY_DELAY,
          () => {
            setAnimState((cur) => ({
              ...cur,
              itemPosition: "transitioning-up",
            }));
          },
          token,
        );
        scheduleStateUpdate(
          ANIM.ENTRY_DELAY + ANIM.DURATION,
          () => {
            setAnimState((cur) => ({
              ...cur,
              currentType: newType,
              previousType: null,
              pendingType: null,
              itemPosition: "visible",
            }));
          },
          token,
        );
        return startState;
      }

      startState.itemPosition = "transitioning-down";
      scheduleStateUpdate(
        ANIM.HALF + 40,
        () => {
          setAnimState((cur) => ({ ...cur, itemPosition: "transitioning-up" }));
        },
        token,
      );
      scheduleStateUpdate(
        ANIM.DURATION + 100,
        () => {
          setAnimState((cur) => ({
            ...cur,
            currentType: newType,
            previousType: null,
            pendingType: null,
            itemPosition: "visible",
          }));
        },
        token,
      );

      return startState;
    });
  }, [bearType]);

  useEffect(() => clearPendingTimeouts, []);

  const computeItems = () => {
    const items = [];
    const { currentType, pendingType, previousType, itemPosition } =
      animState || {};

    const typeToComp = (type) => {
      switch (type) {
        case "projects":
          return Laptop;
        case "stories":
          return Book;
        case "about":
          return QuarterZip;
        default:
          return null;
      }
    };

    const pushIf = (type, pos) => {
      const Comp = typeToComp(type);
      if (!Comp) return;
      items.push({ key: type, Comp, pos, type });
    };

    // Outgoing item during slide-down
    if (previousType && itemPosition === "transitioning-down") {
      pushIf(previousType, "transitioning-down");
    }

    // Incoming or steady-state
    if (pendingType) {
      if (itemPosition === "transitioning-up")
        pushIf(pendingType, "transitioning-up");
      if (itemPosition === "visible") pushIf(pendingType, "visible");
    } else if (currentType && currentType !== "default") {
      pushIf(currentType, itemPosition || "visible");
    }

    return items;
  };

  const items = computeItems();

  const eyeMode = (() => {
    const t = animState?.pendingType || animState?.currentType || "default";
    if (t === "projects") return "projects";
    if (t === "stories") return "stories";
    if (t === "about") return "about";
    return "default";
  })();

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
      <BearEyes mode={eyeMode} />
      <AnimatePresence initial={false} mode="wait">
        {items.map((item) => (
          <Motion.g
            key={item.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <item.Comp position={item.pos} idSuffix={`-${uid}-${item.type}`} />
          </Motion.g>
        ))}
      </AnimatePresence>
    </svg>
  );
});

UnifiedBearIcon.displayName = "UnifiedBearIcon";
export default UnifiedBearIcon;
