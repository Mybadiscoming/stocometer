"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "light") {
    root.classList.add("light");
  } else {
    root.classList.remove("light");
  }

  localStorage.setItem("stocometer-theme", theme);
}

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      "stocometer-theme"
    ) as Theme | null;

    const initialTheme: Theme =
      savedTheme === "light" ? "light" : "dark";

    setTheme(initialTheme);
    applyTheme(initialTheme);
    setReady(true);
  }, []);

  const handleThemeChange = (nextTheme: Theme) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <main className="theme-background theme-text min-h-screen">
      {/* Header */}
      <header className="border-b theme-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
                color: "var(--cyan)",
              }}
            >
              SC
            </div>

            <div>
              <span className="text-sm font-semibold tracking-[0.08em]">
                STOCOMETER
              </span>

              <p className="hidden text-[9px] uppercase tracking-[0.16em] theme-muted sm:block">
                Blockchain risk intelligence
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs theme-muted transition hover:text-[var(--foreground)]"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--cyan)" }}
          >
            Preferences
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Settings
          </h1>

          <p className="mt-4 text-sm leading-7 theme-muted">
            Manage how STOCOMETER looks and how you interact with
            the application.
          </p>
        </div>

        {/* Appearance */}
        <section className="theme-surface mt-12 rounded-3xl border theme-border p-6 sm:p-8">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--cyan)" }}
            >
              Appearance
            </p>

            <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em]">
              Theme
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 theme-muted">
              Choose how STOCOMETER appears across the application.
              Your preference is saved on this device.
            </p>
          </div>

          <div className="mt-7">
            <div
              className="grid grid-cols-2 rounded-2xl border theme-border p-1"
              aria-label="Theme selection"
            >
              <button
                type="button"
                onClick={() => handleThemeChange("dark")}
                disabled={!ready}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  theme === "dark"
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "theme-muted hover:bg-[var(--surface-2)]"
                }`}
              >
                Dark
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                disabled={!ready}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  theme === "light"
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "theme-muted hover:bg-[var(--surface-2)]"
                }`}
              >
                Light
              </button>
            </div>

            <p className="mt-3 text-[10px] theme-muted">
              Current theme:{" "}
              <span className="font-medium theme-text">
                {ready
                  ? theme === "dark"
                    ? "Dark"
                    : "Light"
                  : "Loading"}
              </span>
            </p>
          </div>
        </section>

        {/* Account */}
        <section className="theme-surface mt-4 rounded-3xl border theme-border p-6 sm:p-8">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--cyan)" }}
          >
            Account
          </p>

          <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em]">
            STOCOMETER account
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 theme-muted">
            Sign in if you want to use account-based features as
            they become available.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border theme-border px-5 text-xs font-semibold transition hover:bg-[var(--surface-2)]"
          >
            Sign in →
          </Link>
        </section>

        {/* Product information */}
        <section className="theme-surface mt-4 rounded-3xl border theme-border p-6 sm:p-8">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--cyan)" }}
          >
            About
          </p>

          <div className="mt-5 flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">STOCOMETER</p>
              <p className="mt-1 text-xs theme-muted">
                Blockchain risk intelligence
              </p>
            </div>

            <span className="font-mono text-[10px] theme-muted">
              Preferences
            </span>
          </div>
        </section>
      </section>
    </main>
  );
}