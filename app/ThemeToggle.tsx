"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("lee-dbp-theme");
    const initial: Theme = stored === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = initial;
    setTheme(initial);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("lee-dbp-theme", next);
    setTheme(next);
  };

  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === "light" ? "Koyu temaya geç" : "Açık temaya geç"}>
      {theme === "light" ? <Moon size={12}/> : <Sun size={12}/>}
      <span>{theme === "light" ? "Koyu Tema" : "Açık Tema"}</span>
    </button>
  );
}
