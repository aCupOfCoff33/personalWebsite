// src/components/SidebarWidgets.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import WidgetCard from "./WidgetCard";

// Default static widget structure (using the one from your provided *second* code block)
const defaultWidgets = [
  {
    id: "spotify",
    title: "Listening To",
    imageUrl: "https://placehold.co/53x53/1DB954/FFFFFF?text=?",
    description: "Loading...",
    href: "#",
  },
  {
    id: "watching",
    title: "Currently Watching", // Preserving title format from your second block
    imageUrl: "https://4kwallpapers.com/images/wallpapers/daredevil-born-2560x2560-17939.png",
    description: "Daredevil:\nBorn Again",
    href: "https://www.imdb.com/title/tt18923754/",
  },
  {
    id: "interning",
    title: "Currently Interning @", // Preserving title format from your second block
    imageUrl: "https://media.licdn.com/dms/image/v2/C4E0BAQFxOWSzcQlx7w/company-logo_200_200/company-logo_200_200/0/1672776000338/american_global_llc_logo?e=2147483647&v=beta&t=6eASPMK3qET6z-fVO8yv4YWrhgf7l7wjaAwu_iF8q2s", // Preserving placeholder URL from your second block
    description: "American Global",
    href: "https://americanglobal.com",
  },
  {
    id: "working",
    title: "Currently Working On", // Corrected spacing based on your second block
    imageUrl: "https://placehold.co/53x53/61DAFB/FFFFFF?text=R",
    description: "Personal Website",
    href: "#",
  },
];

// Configuration constants
const IDLE_POLL_INTERVAL_MS = 30000;
const MIN_REFRESH_DELAY_MS = 5000;
const REFRESH_BUFFER_MS = 2000;
const TEN_MINUTES_MS = 10 * 60 * 1000;
const DEFAULT_FALLBACK_IMAGE_FRONTEND = "https://placehold.co/53x53/808080/FFFFFF?text=--"; // Grey fallback

const SidebarWidgets = () => {
  const [widgetsData, setWidgetsData] = useState(defaultWidgets);
  const [isLoadingSpotify, setIsLoadingSpotify] = useState(true);
  const timeoutRef = useRef(null);

  const fetchNowPlaying = useCallback(async () => {
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null; // Good practice
    }

    setIsLoadingSpotify(true);
    let nextDelay = IDLE_POLL_INTERVAL_MS;

    try {
      const apiUrl = "http://localhost:3001/api/now-playing";
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown server error");
        console.error("SidebarWidgets: Fetch response not OK", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      setWidgetsData((prevWidgets) =>
        prevWidgets.map((widget) => {
          if (widget.id === "spotify") {
            let newTitle = "Listening To"; // Default title
            let newDescription = "Nothing playing"; // Default description
            let newImageUrl = DEFAULT_FALLBACK_IMAGE_FRONTEND; // Default image
            let newHref = "#"; // Default link

            // CASE 1: Actively playing
            if (data.isPlaying && data.title) {
              newTitle = "Currently listening to";
              newDescription = `${data.title} - ${data.artist}`;
              newImageUrl = data.albumImageUrl || newImageUrl;
              newHref = data.songUrl;
            }
            // --- START: Added Suggestion Logic ---
            // CASE 2: Not playing, BUT has suggested track from backend
            else if (!data.isPlaying && data.suggestedTrack) {
                newTitle = "Maybe try this?"; // Use the suggestion title
                newDescription = `${data.suggestedTrack.title} - ${data.suggestedTrack.artist}`;
                newImageUrl = data.suggestedTrack.albumImageUrl || newImageUrl; // Use suggestion art or fallback
                newHref = data.suggestedTrack.songUrl;
            }
            // --- END: Added Suggestion Logic ---
            // CASE 3: Not playing, NO suggestion, but has last played info (check played_at)
            else if (!data.isPlaying && data.title && data.played_at) {
              const playedAtDate = new Date(data.played_at);
              if (!isNaN(playedAtDate.getTime())) {
                  const timeSincePlayed = Date.now() - playedAtDate.getTime();
                  // Subcase 3a: Played within the last 10 minutes
                  if (timeSincePlayed < TEN_MINUTES_MS) {
                      newTitle = "Last listened to";
                      newDescription = `${data.title} - ${data.artist}`;
                      newImageUrl = data.albumImageUrl || newImageUrl;
                      newHref = data.songUrl;
                  }
                  // Subcase 3b: Played more than 10 minutes ago
                  else {
                      newDescription = "Nothing recently"; // No suggestion, just say nothing recent
                      // Keep default title, grey image, href
                  }
              } else {
                  console.warn("Received invalid played_at date:", data.played_at);
                  newDescription = "Nothing recently"; // Fallback description
              }
            }
             // CASE 4: Fallback - Not playing, no suggestion, no valid recent track info
             else if (!data.isPlaying) {
                 newDescription = "Nothing recently"; // Final fallback message
                 // Keep default title, grey image, href
             }


            return {
              ...widget,
              title: newTitle,
              description: newDescription,
              imageUrl: newImageUrl,
              href: newHref,
            };
          }
          return widget; // Return other widgets unchanged
        })
      );

      // --- Calculate Next Delay (logic preserved) ---
      if (
        data.isPlaying &&
        data.duration_ms &&
        data.progress_ms != null &&
        data.timestamp
      ) {
        const msSinceTimestamp = Math.max(0, Date.now() - data.timestamp);
        const currentProgress = data.progress_ms + msSinceTimestamp;
        const remainingMs = data.duration_ms - currentProgress;
        nextDelay = Math.max(
          MIN_REFRESH_DELAY_MS,
          remainingMs + REFRESH_BUFFER_MS
        );
      }
      // No else needed, nextDelay defaults to IDLE_POLL_INTERVAL_MS
    } catch (error) {
      // Error handling preserved
      console.error("SidebarWidgets: Error inside fetchNowPlaying:", error);
      setWidgetsData((prevWidgets) =>
        prevWidgets.map((widget) => {
          if (widget.id === "spotify") {
            return {
              ...widget,
              title: "Listening To",
              description: "Error loading",
              imageUrl: "https://placehold.co/53x53/FF0000/FFFFFF?text=!",
              href: "#",
            };
          }
          return widget;
        })
      );
      nextDelay = IDLE_POLL_INTERVAL_MS;
    } finally {
      setIsLoadingSpotify(false);
      timeoutRef.current = setTimeout(fetchNowPlaying, nextDelay);
    }
  }, []);

  useEffect(() => {
    fetchNowPlaying();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fetchNowPlaying]);

  // --- Render Component UI (Layout preserved from your second code block) ---
  return (
    <div className="grid grid-cols-2 gap-5 w-full lg:w-[40rem] justify-center">
      {widgetsData.map((widget, index) =>
        widget ? <WidgetCard key={widget.id || index} {...widget} /> : null
      )}
    </div>
  );
};

export default SidebarWidgets;