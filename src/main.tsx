import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import DotPortraitDemo from "./pages/DotPortraitDemo";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element "#root" not found.');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
    <DotPortraitDemo />
  </React.StrictMode>
);
