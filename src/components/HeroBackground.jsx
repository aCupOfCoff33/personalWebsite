// src/components/HeroBackground.jsx
import React from "react";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const ease = (t) => t * t * (3 - 2 * t); // smoothstep

export default function HeroBackground() {
  const containerRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const sectionsRef = React.useRef([]);
  const currentVarsRef = React.useRef({ hue: 0, magenta: 0.18, blue: 0.18 });

  const scenes = React.useMemo(
    () => ({
      hero:       { hue: 0,   magenta: 0.18, blue: 0.18 },
      projects:   { hue: 8,   magenta: 0.28, blue: 0.12 },
      stories:    { hue: -10, magenta: 0.14, blue: 0.26 },
      experience: { hue: -4,  magenta: 0.20, blue: 0.20 },
    }),
    []
  );

  const lerp = (a, b, t) => a + (b - a) * t;

  React.useEffect(() => {
    // Cache scenes anchors once on mount
    sectionsRef.current = Array.from(document.querySelectorAll('[data-bg-scene]'));

    const pickActiveScene = () => {
      const viewportCenter = window.innerHeight / 2;
      let closest = { key: 'hero', dist: Infinity };
      for (const el of sectionsRef.current) {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - viewportCenter);
        const key = el.getAttribute('data-bg-scene') || 'hero';
        if (dist < closest.dist) closest = { key, dist };
      }
      return closest.key in scenes ? closest.key : 'hero';
    };

    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const rawP = scrollable > 0 ? window.scrollY / scrollable : 0;
      const p = ease(clamp(rawP, 0, 1));

      // Responsive gradient progression (no parallax)
      const radialX = 110 - 15 * p; // 110% -> 95%
      const radialY = 45 + 12 * p;  // 45% -> 57%
      const saturate = 1 + 0.15 * p; // 1 -> 1.15
      const brighten = 1 + 0.08 * p; // 1 -> 1.08

      // Scene targeting
      const activeKey = pickActiveScene();
      const target = scenes[activeKey];
      const current = currentVarsRef.current;
      const speed = 0.08; // smoothing factor
      current.hue = lerp(current.hue, target.hue, speed);
      current.magenta = lerp(current.magenta, target.magenta, speed);
      current.blue = lerp(current.blue, target.blue, speed);

      if (containerRef.current) {
        const el = containerRef.current;
        el.style.setProperty("--radial-x", `${radialX}%`);
        el.style.setProperty("--radial-y", `${radialY}%`);
        el.style.setProperty("--sat", String(saturate));
        el.style.setProperty("--bright", String(brighten));
        el.style.setProperty("--hue", `${current.hue}deg`);
        el.style.setProperty("--magenta", String(current.magenta));
        el.style.setProperty("--blue", String(current.blue));
      }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        update();
        rafRef.current = null;
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scenes]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
      {/* Base blackish canvas */}
      <div className="absolute inset-0" style={{ backgroundColor: "#0C100D" }} />

      {/* Off-center radial glow - center near right edge (driven by CSS vars) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(120% 90% at var(--radial-x, 110%) var(--radial-y, 45%),
            #20326D 0%,
            #3D3660 35%,
            #361B39 55%,
            #301C26 72%,
            #1B1416 88%,
            #0C100D 100%)`,
          filter: `saturate(var(--sat,1)) brightness(var(--bright,1)) hue-rotate(var(--hue, 0deg))`,
        }}
      />

      {/* Magenta-ish right-half tint (scene controlled) */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg,
            transparent 0 50%,
            rgba(77,57,70, var(--magenta, 0.22)) 58%,
            rgba(77,57,70, var(--magenta, 0.22)) 74%,
            rgba(77,57,70, var(--magenta, 0.20)) 86%,
            transparent 100%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* Blue wash (scene controlled) */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(80% 60% at 95% 60%, rgba(32,50,109, var(--blue, 0.18)) 0%, rgba(32,50,109,0) 60%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* Lighter top tint across the canvas */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            rgba(77,57,70,0.25) 0%,
            rgba(48,28,38,0.12) 18%,
            transparent 42%)`,
        }}
      />

      {/* Gentle left falloff (NO seam) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg,
            #0C100D 0%,
            #0C100D 35%,
            rgba(12,16,13,0.85) 50%,
            rgba(12,16,13,0.55) 65%,
            rgba(12,16,13,0.25) 78%,
            transparent 88%,
            transparent 100%)`,
        }}
      />

      {/* Subtle vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(120% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.35) 100%)`,
        }}
      />

      {/* Grain / texture layer using SVG turbulence */}
      <div className="absolute inset-0 opacity-[0.08] mix-blend-soft-light pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
}