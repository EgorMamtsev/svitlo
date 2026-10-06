import { StrictMode } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { HomePage } from "./Pages/HomePage.tsx"; // Імпортуємо нашу нову сторінку

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>,
);
