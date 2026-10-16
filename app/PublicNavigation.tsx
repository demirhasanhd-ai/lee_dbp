"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export function PublicNavigation({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigationId = useId();
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    container.current?.querySelectorAll("details[open]").forEach((details) => details.removeAttribute("open"));
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="public-navigation" data-open={open} ref={container}>
      <button
        className="mobile-menu-toggle"
        type="button"
        ref={trigger}
        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        aria-expanded={open}
        aria-controls={navigationId}
        onClick={() => open ? close() : setOpen(true)}
      >
        {open ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}
      </button>
      <nav id={navigationId} aria-label="Ana menü" onClick={(event) => {
        if (event.target instanceof Element && event.target.closest("a")) close();
      }}>
        {children}
      </nav>
    </div>
  );
}
