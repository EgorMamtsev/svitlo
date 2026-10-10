// src/main.tsx
import { StrictMode } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { HomePage } from "./Pages/HomePage.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  </StrictMode>,
);
