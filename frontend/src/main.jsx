import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { UserContextProvider } from "./context/UserContext"; // ✅ Correct named import
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider> {/* ✅ Wrap App with context provider */}
      <App />
    </UserContextProvider>
  </React.StrictMode>
);
