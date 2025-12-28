import React from "react";
import { motion } from "framer-motion";

const HeroFrame = React.memo(function HeroFrame({
  frameRef,
  state,
  pendingSnapBack,
  snapBack,
  dispatch,
  x,
  y,
  getInitialX,
  children,
}) {
  // Dynamic safe margins that respect the layout (sidebar on desktop, top bar on mobile).
  const getSafeMargin = React.useCallback(() => {
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1024;
    const isDesktop = viewportWidth >= 768; // md breakpoint
    const SIDEBAR_WIDTH_PX = 240; // md:ml-60 (15rem)
    const MOBILE_TOPBAR_PX = 64; // pt-16 on main
    return {
      left: isDesktop ? SIDEBAR_WIDTH_PX + 24 : 24,
      right: 24,
      top: isDesktop ? 24 : 24 + MOBILE_TOPBAR_PX,
      bottom: 24,
    };
  }, []);

  const getViewportBounds = React.useCallback(() => {
    if (!frameRef.current)
      return {
        minX: -Infinity,
        maxX: Infinity,
        minY: -Infinity,
        maxY: Infinity,
      };
    const rect = frameRef.current.getBoundingClientRect();
    const SAFE_MARGIN = getSafeMargin();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const currentX = x.get();
    const currentY = y.get();

    // rect.left = originX + currentX, so originX = rect.left - currentX
    const originX = rect.left - currentX;
    const originY = rect.top - currentY;

    const minX = SAFE_MARGIN.left - originX;
    const maxX = viewportWidth - SAFE_MARGIN.right - rect.width - originX;
    const minY = SAFE_MARGIN.top - originY;
    const maxY = viewportHeight - SAFE_MARGIN.bottom - rect.height - originY;

    return { minX, maxX, minY, maxY };
  }, [frameRef, getSafeMargin, x, y]);

  const clampIntoViewport = React.useCallback(() => {
    const bounds = getViewportBounds();
    const currentX = x.get();
    const currentY = y.get();

    const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, currentX));
    const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, currentY));

    if (clampedX !== currentX) x.set(clampedX);
    if (clampedY !== currentY) y.set(clampedY);
  }, [getViewportBounds, x, y]);

  const handleDrag = React.useCallback(() => {
    if (!frameRef.current) return;
    const bounds = getViewportBounds();
    const currentX = x.get();
    const currentY = y.get();

    const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, currentX));
    const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, currentY));

    if (clampedX !== currentX) x.set(clampedX);
    if (clampedY !== currentY) y.set(clampedY);
  }, [frameRef, getViewportBounds, x, y]);

  return (
    <motion.div
      ref={frameRef}
      drag={state.dragOK && !state.isAnimatingBack}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        if (state.isAnimatingBack || pendingSnapBack) {
          return false;
        }
      }}
      onDrag={handleDrag}
      onDragEnd={() => {
        if (!state.isAnimatingBack && !pendingSnapBack) {
          clampIntoViewport();
          dispatch({ type: "SET_FRAME_THICK", value: false });
          snapBack();
        }
      }}
      onMouseEnter={() => dispatch({ type: "SET_POINTER_HOVER", value: true })}
      onMouseLeave={() => dispatch({ type: "SET_POINTER_HOVER", value: false })}
      dragConstraints={false}
      style={{
        x: state.frameFrozen && !state.frameAligned ? getInitialX() : x,
        y,
      }}
      className={`relative inline-block px-4 py-6 md:px-10 ${
        state.dragOK && !state.isAnimatingBack
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-default"
      } max-w-full`}
    >
      {state.showFrame && (
        <>
          <motion.div
            className="absolute inset-0 border-solid"
            style={{ borderColor: "#198ce7" }}
            initial={{ opacity: 0, borderWidth: 2 }}
            animate={{
              opacity: 1,
              borderWidth: state.frameThick || state.pointerHover ? 6 : 2,
            }}
            transition={{ duration: 0.2 }}
          />

          <div className="absolute w-3 h-3 bg-[#198ce7] -top-[4px] -left-[4px] flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded" />
          </div>
          <div className="absolute w-3 h-3 bg-[#198ce7] -top-[4px] -right-[4px] flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded" />
          </div>
          <div className="absolute w-3 h-3 bg-[#198ce7] -bottom-[4px] -left-[4px] flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded" />
          </div>
          <div className="absolute w-3 h-3 bg-[#198ce7] -bottom-[4px] -right-[4px] flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded" />
          </div>
        </>
      )}

      {children}
    </motion.div>
  );
});

HeroFrame.displayName = "HeroFrame";

export default HeroFrame;
