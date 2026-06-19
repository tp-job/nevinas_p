import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProfileProvider } from "@/context/ProfileContext";

const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = savedTheme === "dark" || savedTheme === "light"
  ? savedTheme
  : (prefersDark ? "dark" : "light");

root.dataset.theme = initialTheme;
root.classList.toggle("dark", initialTheme === "dark");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </ThemeProvider>
  </StrictMode>,
);
