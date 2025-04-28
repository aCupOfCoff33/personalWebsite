import React from "react";

const WidgetCard = ({ title, imageUrl, description, href }) => {
  const safeTitle = title || "";

  if (!title && !description) return null;

  const Wrapper = href && href !== "#" ? "a" : "div";
  const wrapperProps =
    Wrapper === "a"
      ? {
          href,
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group flex h-44 w-full items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-white transition-all hover:border-brand-blue hover:bg-zinc-800 hover:shadow-lg active:scale-[0.98]"
    >
      <div className="flex items-center gap-4 w-full max-w-full">
        {/* Image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            className="w-16 h-16 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
          />
        )}

        {/* Text content — vertically centered, horizontally left-aligned */}
        <div className="flex flex-col justify-center text-left w-full max-w-full">
          {/* Title */}
          <div className="text-sm text-zinc-400 font-semibold leading-tight">
            {safeTitle.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>

          {/* Description */}
          {description && (
            <div
              className="pt-1.5 font-bold leading-snug break-words overflow-hidden text-ellipsis whitespace-normal"
              style={{
                fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)",
                lineHeight: "1.35",
                maxWidth: "100%",
                wordWrap: "break-word",
                hyphens: "auto",
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default WidgetCard;
