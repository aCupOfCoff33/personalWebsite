import React from "react";

const TypewriterText = React.memo(function TypewriterText({
  headlineRef,
  showCursor,
}) {
  return (
    <h1
      ref={headlineRef}
      className="text-4xl md:text-6xl font-bold leading-none break-words whitespace-pre-line"
    >
      {/* The text is set via ref for performance. Only the cursor is rendered here. */}
      {showCursor && <span className="animate-pulse">|</span>}
    </h1>
  );
});

TypewriterText.displayName = "TypewriterText";

export default TypewriterText;
