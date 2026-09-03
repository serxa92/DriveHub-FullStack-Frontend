import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { LanguageProvider } from "./context/LanguageContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LanguageProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </LanguageProvider>
  </BrowserRouter>
);