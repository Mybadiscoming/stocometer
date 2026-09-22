"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "light") {
      document.documentElement.classList.add("light");
      setLight(true);
    }
  }, []);

  function toggleTheme() {
    const nextLight = !light;

    setLight(nextLight);

    if (nextLight) {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark mode"
      style={{
        padding: "8px 12px",
        borderRadius: "999px",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: "var(--foreground)",
        cursor: "pointer",
      }}
    >
      {light ? "☀️" : "🌙"}
    </button>
  );
}