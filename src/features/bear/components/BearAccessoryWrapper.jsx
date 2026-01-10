import React from "react";

const BearAccessoryWrapper = React.memo(function BearAccessoryWrapper({
  idSuffix = "",
  maskIdBase = "bearCircleMask",
  maskCircle = { cx: 34, cy: 34, r: 34 },
  opacity = 1,
  defs = null,
  children,
  ...props
}) {
  const maskId = `${maskIdBase}${idSuffix}`;
  return (
    <g
      aria-hidden="true"
      clipPath={`url(#${maskId})`}
      style={{ pointerEvents: "none", opacity }}
      {...props}
    >
      <defs>
        {defs}
        <clipPath id={maskId}>
          <circle
            cx={maskCircle.cx}
            cy={maskCircle.cy}
            r={maskCircle.r}
          />
        </clipPath>
      </defs>
      {children}
    </g>
  );
});

BearAccessoryWrapper.displayName = "BearAccessoryWrapper";

export default BearAccessoryWrapper;
