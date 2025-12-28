import React from "react";
import BearAccessoryWrapper from "./BearAccessoryWrapper";

// QuarterZip accessory for the about page; follows the same pattern as other bear accessories
// Updated for new 68x68 viewBox coordinate system (no scaling needed)
const QuarterZip = React.memo(function QuarterZip({
  position = "hidden",
  idSuffix = "",
}) {
  const opacity = position === "hidden" ? 0 : 1;

  return (
    <BearAccessoryWrapper
      idSuffix={idSuffix}
      maskIdBase="bearCircleMaskQuarterZip"
      opacity={opacity}
    >
      {/* Original quarter zip is already in 68x68 space - positioned at bottom */}
      <g transform="translate(6, 45)">
        <path
          d="M0 7.49994C7.07763 6.23694 16.575 7.33636 24.9775 11.1474C40.5565 7.19207 50.0004 6.72524 55.2852 8.43842C49.089 16.7769 39.1653 22.1806 27.9785 22.1806C16.3776 22.1806 6.13577 16.369 0 7.49994Z"
          fill="#284A38"
        />
        <path
          d="M18.5 9.5L19.5 7.5H35.5L36 9L30.5 12L27.5 17L24.5 12L18.5 9.5Z"
          fill="black"
          stroke="black"
          strokeLinejoin="round"
        />
        <path
          d="M16.1017 6.40544C25.2539 8.23587 27.5 16.4239 27.5 21C27.0423 13.6776 23.8811 13.2703 17.4746 11.8975C10.3885 11.585 8.32238 10.5239 4.20391 8.23587C0.0854447 5.94783 2.83109 -0.916279 3.7463 0.914151C4.66152 2.74458 5.57673 1.82937 16.1017 6.40544Z"
          fill="#284A38"
          stroke="#203F2F"
          strokeLinejoin="round"
        />
        <path
          d="M38.5243 6.71331C29.3721 8.54374 27.5 15.9232 27.5 20.4993C27.9578 13.1768 30.7449 13.5782 37.1514 12.2053C44.2375 11.8929 46.3036 10.8318 50.4221 8.54374C54.5406 6.2557 52.4152 -0.83043 51.5 1C50.5848 2.83043 49.0493 2.13723 38.5243 6.71331Z"
          fill="#284A38"
          stroke="#203F2F"
          strokeLinejoin="round"
        />
        <path
          d="M16.4757 5.79802C27.0848 8.69454 28 15.5 27.5424 21.9652C27.5 14.5 24.2552 12.6629 17.8487 11.29C10.7626 10.9776 8.6964 9.91649 4.57794 7.62845C0.459468 5.34041 3.20511 -1.5237 4.12033 0.306729C5.03554 2.13716 5.95076 1.22194 16.4757 5.79802Z"
          fill="#284A38"
        />
        <path
          d="M38.8983 6.10466C27.0844 8.69373 27 17 27.4581 22.1209C27.5 15 29.5 13 37.5 11.5C44.5861 11.1876 46.6776 10.2231 50.7961 7.93509C54.9146 5.64705 52.1689 -1.21706 51.2537 0.61337C50.3385 2.4438 49.4233 1.52858 38.8983 6.10466Z"
          fill="#284A38"
        />
        <path
          d="M27.4994 21.5C27.1661 18.5 27.5 13.5 33.5 9.5"
          stroke="#959493"
          strokeLinejoin="round"
        />
        <path
          d="M27.4997 21.5C27.833 18.5 27.0026 13 21.0026 9"
          stroke="#959493"
          strokeLinejoin="round"
        />
        <path
          d="M27.249 18.6995C27.649 14.7557 27.9157 18.5899 27.999 21H26.999C27.249 18.6995 26.749 23.6292 27.249 18.6995Z"
          fill="#E2E3E3"
          stroke="#E2E3E3"
          strokeLinejoin="round"
        />
        <path
          d="M26.999 18.5C27.1657 18.6667 27.599 18.9 27.999 18.5"
          stroke="#6D706F"
          strokeWidth="0.25"
          strokeLinejoin="round"
        />
      </g>
    </BearAccessoryWrapper>
  );
});

QuarterZip.displayName = "QuarterZip";
export default QuarterZip;
