import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

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

console.log("Built while watching Paddington and eating a marmalade sandwich (and coffee!)");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
