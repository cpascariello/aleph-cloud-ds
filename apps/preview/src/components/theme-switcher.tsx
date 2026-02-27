"use client";

import { useCallback, useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("theme-dark"));
  }, []);

  const toggle = useCallback(() => {
    document.documentElement.classList.toggle("theme-dark");
    setDark((prev) => !prev);
  }, []);

  return (
    <button
      onClick={toggle}
      className="rounded-md border border-edge px-3 py-1.5 text-sm
                 hover:border-edge-hover transition-colors"
      style={{ transitionDuration: "var(--duration-fast)" }}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}
