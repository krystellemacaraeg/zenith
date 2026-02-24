import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// A small global reset so browser defaults don't fight our design
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);