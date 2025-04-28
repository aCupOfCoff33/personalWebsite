// src/scripts/getRefreshToken.js
import express from "express";
import axios from "axios";
import open from "open";
import dotenv from "dotenv";
// No 'https' or 'fs' needed anymore

dotenv.config(); // Load .env variables

const app = express();
const port = 8888;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// --- CHANGE THIS LINE ---
const redirect_uri = "http://127.0.0.1:8888/callback"; // Use 127.0.0.1 with HTTP!
// --- END CHANGE ---

app.get("/", (req, res) => {
  const scope = "user-read-currently-playing user-read-playback-state user-read-recently-played";  // Construct the URL with the correct redirect_uri
  const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scope)}&redirect_uri=${redirect_uri}`; // Use encodeURIComponent for scope
  res.redirect(authURL);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri, // Pass the correct 127.0.0.1 URI here too
      }),
      {
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("✅ REFRESH TOKEN:", response.data.refresh_token);
    res.send("Success! Check your terminal for the refresh token. You can close this browser tab.");
    // Optional: Close server after success
    // server.close(() => { console.log('Server closed'); process.exit(0); });

  } catch (error) {
    console.error("Error getting token:", error.response ? error.response.data : error.message);
    res.status(500).send("Error getting token. Check terminal.");
    // Optional: Close server on error
    // server.close(() => { console.log('Server closed due to error'); process.exit(1); });
  }
});

// --- Use standard app.listen (or http.createServer if you prefer) ---
const server = app.listen(port, () => {
  // Log the correct URL the browser should open
  const serverAddress = `http://127.0.0.1:${port}`;
  console.log(`Listening on ${serverAddress}`);
  open(serverAddress); // Open the correct 127.0.0.1 address
});
// --- END CHANGE ---

// Optional: Graceful shutdown handler
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});