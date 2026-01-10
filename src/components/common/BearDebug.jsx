// Debug component to show bear state (for development only)
import React from "react";
import { useBearState } from "../../hooks/useBearState";

const BearDebug = () => {
  const { bearType } = useBearState();

  // Only show in development and when debug mode is enabled
  if (import.meta.env.PROD || !import.meta.env.VITE_ENABLE_BEAR_DEBUG) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "8px 12px",
        borderRadius: "4px",
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div>Type: {bearType}</div>
    </div>
  );
};

export default BearDebug;
