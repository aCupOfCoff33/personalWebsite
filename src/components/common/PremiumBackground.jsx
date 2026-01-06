import React from "react";

/**
 * PremiumBackground - A reusable background component with premium SaaS aesthetic
 * Features:
 * - Near-black charcoal base (#0b0f0c / #0f1110)
 * - Film grain/noise overlay using texture image
 * - Soft radial vignette (lighter center, darker edges)
 * - Fully understated, no obvious gradients or patterns
 * - Works as full-page or section background
 */
const PremiumBackground = ({ className = "" }) => {
  // Inline styles for complex gradients that Tailwind can't handle easily
  const vignetteStyle = {
    background: `
      radial-gradient(ellipse at center, rgba(15, 17, 16, 0) 0%, rgba(11, 15, 12, 0.4) 70%, rgba(8, 11, 9, 0.7) 100%)
    `,
  };

  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Base charcoal layer */}
      <div className="absolute inset-0 bg-[#0b0f0c]" />

      {/* Subtle color variation for depth */}
      <div className="absolute inset-0 bg-[#0f1110] opacity-60" />

      {/* Film grain/noise overlay using actual texture image */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: "url('/noise-texture.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "216px auto",
        }}
      />

      {/* Soft vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={vignetteStyle}
      />
    </div>
  );
};

export default PremiumBackground;
