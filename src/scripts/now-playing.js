// src/scripts/now-playing.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3001; // Port for this backend API

// --- CORS Configuration ---
const corsOptions = {
  origin: "http://localhost:5173", // Allow your React dev server
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// --- Constants ---
const PLAYLIST_ID = '4pepKNro0QPv9nobAX6UVh'; // <<< Your target playlist ID
const TEN_MINUTES_MS = 10 * 60 * 1000;
const DEFAULT_FALLBACK_IMAGE = "https://placehold.co/53x53/808080/FFFFFF?text=--"; // Fallback image URL

// --- Helper Function: Get Random Track from Playlist ---
async function getRandomPlaylistTrack(accessToken) {
  try {
    // Fetch only necessary fields to keep response small
    const fields = 'items(track(name,artists(name),album(images),external_urls(spotify),is_playable))';
    const limit = 100; // Spotify API max limit per request for playlist items

    const playlistResponse = await axios.get(
      `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks?limit=${limit}&fields=${encodeURIComponent(fields)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const items = playlistResponse.data?.items;
    if (!items || items.length === 0) {
      console.warn(`Playlist ${PLAYLIST_ID} is empty or couldn't be fetched.`);
      return null;
    }

    // Filter out potentially unplayable or null tracks
    const playableItems = items.filter(item => item.track && item.track.is_playable !== false);
    if (playableItems.length === 0) {
        console.warn(`No playable tracks found in playlist ${PLAYLIST_ID}.`);
        return null;
    }


    const randomIndex = Math.floor(Math.random() * playableItems.length);
    const randomTrack = playableItems[randomIndex].track;

    return {
      title: randomTrack.name,
      artist: randomTrack.artists.map((a) => a.name).join(", "),
      albumImageUrl: randomTrack.album.images[0]?.url || DEFAULT_FALLBACK_IMAGE, // Use fallback if no image
      songUrl: randomTrack.external_urls.spotify,
    };
  } catch (error) {
    console.error(`Error fetching playlist tracks from ${PLAYLIST_ID}:`, error.response?.data || error.message);
    return null; // Indicate failure to get suggestion
  }
}


// --- API Endpoint ---
app.get("/api/now-playing", async (req, res) => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
    process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    console.error("FATAL ERROR: Missing Spotify environment variables!");
    return res
      .status(500)
      .json({ error: "Spotify API credentials not configured on the server." });
  }

  let access_token = null;

  try {
    // --- Step 1: Get Access Token ---
    const basic = Buffer.from(
      `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");

    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: SPOTIFY_REFRESH_TOKEN,
      }).toString(),
      {
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    access_token = tokenResponse.data.access_token;

    // --- Step 2: Check Currently Playing ---
    const nowPlayingResponse = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${access_token}` },
        validateStatus: (status) => (status >= 200 && status < 300) || status === 204,
      }
    );

    const isActive = nowPlayingResponse.status === 200 &&
                     nowPlayingResponse.data?.item &&
                     nowPlayingResponse.data.is_playing;

    // --- CASE 1: Actively Playing ---
    if (isActive) {
      const song = nowPlayingResponse.data;
      return res.status(200).json({
        isPlaying: true,
        title: song.item.name,
        artist: song.item.artists.map((a) => a.name).join(", "),
        albumImageUrl: song.item.album.images[0]?.url || DEFAULT_FALLBACK_IMAGE,
        songUrl: song.item.external_urls.spotify,
        duration_ms: song.item.duration_ms,
        progress_ms: song.progress_ms,
        timestamp: song.timestamp,
      });
    }

    // --- CASE 2: Not Actively Playing ---
    // Check recently played
    const recentlyPlayedResponse = await axios.get(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    // Subcase 2a: Found a recently played track
    if (recentlyPlayedResponse.data?.items?.length > 0) {
      const lastPlayedItem = recentlyPlayedResponse.data.items[0];
      const lastTrack = lastPlayedItem.track;
      const played_at = lastPlayedItem.played_at;
      const playedAtDate = new Date(played_at);
      const timeSincePlayed = Date.now() - playedAtDate.getTime();

      // Subcase 2a-i: Played within the last 10 minutes
      if (timeSincePlayed < TEN_MINUTES_MS && lastTrack) {
        return res.status(200).json({
          isPlaying: false,
          title: lastTrack.name,
          artist: lastTrack.artists.map((a) => a.name).join(", "),
          albumImageUrl: lastTrack.album.images[0]?.url || DEFAULT_FALLBACK_IMAGE,
          songUrl: lastTrack.external_urls.spotify,
          played_at: played_at,
        });
      }
      // Subcase 2a-ii: Played more than 10 minutes ago -> Suggest a track
      else {
          console.log("Played track is older than 10 minutes, getting suggestion...");
          const suggestedTrack = await getRandomPlaylistTrack(access_token);
          return res.status(200).json({
              isPlaying: false,
              suggestedTrack: suggestedTrack // Send suggestion (can be null if fetch failed)
          });
      }
    }
    // Subcase 2b: Nothing recently played found -> Suggest a track
    else {
      console.log("Nothing recently played, getting suggestion...");
      const suggestedTrack = await getRandomPlaylistTrack(access_token);
      return res.status(200).json({
        isPlaying: false,
        suggestedTrack: suggestedTrack // Send suggestion (can be null if fetch failed)
      });
    }

  } catch (error) {
    // --- Error Handling (keep existing logic) ---
    console.error("Detailed error fetching Spotify data:");
     if (error.response) {
         console.error("Status:", error.response.status);
         console.error("Headers:", error.response.headers);
         console.error("Data:", error.response.data);
         if (error.response.status === 400 && error.response.data?.error === 'invalid_grant') {
              console.error("\n!!! SPOTIFY REFRESH TOKEN ERROR: It might be invalid or expired. Re-run getRefreshToken.js !!!\n");
              return res.status(401).json({ error: "Invalid Spotify refresh token. Needs re-authorization." });
          }
          if (error.response.status === 401) {
              console.error("\n!!! SPOTIFY ACCESS TOKEN ERROR: The access token might be invalid or expired. Usually resolved by next refresh. !!!\n");
          }
     } else if (error.request) {
         console.error("Request Error:", error.request);
     } else {
         console.error("General Error Message:", error.message);
     }
     console.error("Stack Trace:", error.stack);

     // Don't suggest a track on general failure, return error
     res.status(500).json({ error: "Failed to fetch Spotify data from backend." });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(
    `🎧 Spotify now-playing API running on http://localhost:${port}/api/now-playing`
  );
  console.log(`ℹ️  Will suggest tracks from playlist ID: ${PLAYLIST_ID} when idle.`);
});