"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42Z"
        fill="#4285F4"
      />
      <path
        d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
        fill="#34A853"
      />
      <path
        d="M6.54 13.59A5.86 5.86 0 0 1 6.23 12c0-.55.11-1.08.31-1.59V7.88H3.3A9.5 9.5 0 0 0 2.25 12c0 1.53.37 2.97 1.05 4.12l3.24-2.53Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.38c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("stocometer-theme");

    document.documentElement.classList.toggle(
      "light",
      savedTheme === "light"
    );
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Demo authentication flow.
    router.push("/");
  }

  function continueAsGuest() {
    router.push("/analyze");
  }

  return (
    <main className="theme-background theme-text min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        {/* Top bar */}
        <header className="flex items-center justify-between">
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

            <span className="text-sm font-semibold tracking-[0.08em]">
              STOCOMETER
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm theme-muted hover:theme-text"
          >
            Back to home
          </Link>
        </header>

        {/* Login area */}
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[430px]">
            {/* Brand intro */}
            <div className="mb-8 text-center">
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-bold"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                  color: "var(--cyan)",
                }}
              >
                SC
              </div>

              <p
                className="mt-5 text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--cyan)" }}
              >
                Blockchain risk intelligence
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Welcome to STOCOMETER
              </h1>

              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 theme-muted">
                Sign in to continue to your investigation workspace.
              </p>
            </div>

            {/* Card */}
            <div className="theme-surface rounded-3xl border theme-border p-6 sm:p-8">
              {/* Google */}
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex w-full items-center justify-center gap-3 rounded-xl border theme-border theme-text px-4 py-3 text-sm font-medium hover:theme-surface-2"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 theme-border border-t" />

                <span className="text-[11px] uppercase tracking-[0.14em] theme-muted">
                  or
                </span>

                <div className="h-px flex-1 theme-border border-t" />
              </div>

              {/* Email / password */}
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium theme-muted"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    className="theme-background theme-text w-full rounded-xl border theme-border px-4 py-3 text-sm outline-none transition focus:border-[var(--cyan)]"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-xs font-medium theme-muted"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs theme-muted hover:theme-text"
                      onClick={() => {}}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <input
                    id="password"
                    className="theme-background theme-text w-full rounded-xl border theme-border px-4 py-3 text-sm outline-none transition focus:border-[var(--cyan)]"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
                  style={{
                    background: "var(--foreground)",
                    color: "var(--background)",
                  }}
                >
                  Sign in
                  <ArrowIcon />
                </button>
              </form>

              {/* Guest */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={continueAsGuest}
                  className="w-full rounded-xl border theme-border theme-surface-2 px-4 py-3 text-sm font-medium theme-text hover:theme-surface"
                >
                  Continue as guest
                </button>
              </div>

              <p className="mt-6 text-center text-[11px] leading-5 theme-muted">
                Demo authentication is currently enabled for STOCOMETER.
              </p>
            </div>

            {/* Footer note */}
            <p className="mt-6 text-center text-xs theme-muted">
              By continuing, you are entering the STOCOMETER investigation
              workspace.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}