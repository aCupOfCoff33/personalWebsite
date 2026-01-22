import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Disable browser's native scroll restoration to prevent conflicts with our custom ScrollRestoration
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

// Console greeting for fellow developers 🐻
console.log(`
     (()__(()
     /       \\
    ( /    \\  \\
     \\ o o    /
     (_()_)__/ \\
    / _,==.____ \\
   (   |--|      )
   /\\_.|__|'-.__/\\_
  / (        /     \\
  \\  \\      (      /
   )  '._____)    /
(((____.--(((____/


🍯 Looking for honey? Or bugs?

Welcome to Aaryan's digital den!
Feel free to wander around!`);

console.log(
  "Built while watching Paddington and eating a marmalade sandwich (and coffee!)",
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
