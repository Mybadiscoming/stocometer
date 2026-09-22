"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        color: "var(--foreground)",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginBottom: "50px",
            color: "var(--muted)",
          }}
        >
          ← Back to STOCOMETER
        </Link>

        <h1
          style={{
            fontSize: "48px",
            marginBottom: "10px",
          }}
        >
          Settings
        </h1>

        <p
          style={{
            color: "var(--muted)",
            marginBottom: "40px",
          }}
        >
          Manage your STOCOMETER preferences.
        </p>

        <section
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h2>Appearance</h2>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div>
              <strong>Theme</strong>
              <p style={{ color: "var(--muted)" }}>
                Switch between light and dark mode.
              </p>
            </div>

            <ThemeToggle />
          </div>
        </section>

        <section
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <h2>Account</h2>

          <p
            style={{
              color: "var(--muted)",
              marginBottom: "20px",
            }}
          >
            Sign in to your STOCOMETER account.
          </p>

          <Link
            href="/login"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              borderRadius: "10px",
              background: "var(--cyan)",
              color: "#ffffff",
              fontWeight: 600,
            }}
          >
            LOGIN →
          </Link>
        </section>
      </div>
    </main>
  );
}