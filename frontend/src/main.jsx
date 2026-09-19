import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@/components/theme-provider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light">
        <App />
        <Toaster position="top-right" richColors closeButton />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
