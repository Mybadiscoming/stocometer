"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const cryptoCards = [
  {
    number: "01",
    title: "Wallet",
    description:
      "A blockchain address that can send, receive, and hold digital assets.",
  },
  {
    number: "02",
    title: "Blockchain",
    description:
      "A public record of transactions that can be traced and analyzed.",
  },
  {
    number: "03",
    title: "Transaction",
    description:
      "A recorded movement of assets from one blockchain address to another.",
  },
  {
    number: "04",
    title: "Risk",
    description:
      "Signals and patterns that can help investigators understand suspicious activity.",
  },
];

const steps = [
  {
    number: "01",
    title: "Look",
    description:
      "Start with a wallet address reported by a victim or investigator.",
  },
  {
    number: "02",
    title: "Trace",
    description:
      "Follow transaction relationships across supported blockchain networks.",
  },
  {
    number: "03",
    title: "Explain",
    description:
      "Turn raw blockchain activity into risk signals, evidence, and investigation context.",
  },
];

function NetworkDiagram() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-3xl border theme-border theme-surface">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(var(--grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid) 1px, transparent 1px)
          `,
          backgroundSize: "42px 42px",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,var(--grid),transparent_55%)]" />

      <div className="absolute left-6 right-6 top-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] theme-muted">
            Investigation preview
          </p>

          <p className="mt-1 text-sm theme-text">
            Transaction relationship map
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border theme-border px-3 py-1.5 text-xs theme-muted">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--low)" }}
          />
          Analysis ready
        </div>
      </div>

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 700 420"
        preserveAspectRatio="none"
      >
        <line
          x1="350"
          y1="210"
          x2="160"
          y2="115"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <line
          x1="350"
          y1="210"
          x2="165"
          y2="310"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <line
          x1="350"
          y1="210"
          x2="530"
          y2="115"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <line
          x1="350"
          y1="210"
          x2="535"
          y2="310"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <line
          x1="165"
          y1="115"
          x2="90"
          y2="70"
          stroke="var(--grid)"
          strokeWidth="1"
        />
        <line
          x1="165"
          y1="115"
          x2="95"
          y2="165"
          stroke="var(--grid)"
          strokeWidth="1"
        />
        <line
          x1="530"
          y1="115"
          x2="610"
          y2="70"
          stroke="var(--grid)"
          strokeWidth="1"
        />
        <line
          x1="535"
          y1="310"
          x2="610"
          y2="350"
          stroke="var(--grid)"
          strokeWidth="1"
        />
      </svg>

      {[
        ["left-[11%] top-[14%]", "0x71...A4"],
        ["left-[10%] top-[36%]", "0x93...18"],
        ["left-[11%] bottom-[18%]", "0x42...D1"],
        ["right-[11%] top-[14%]", "0xBC...72"],
        ["right-[10%] bottom-[13%]", "0x18...9F"],
      ].map(([position, label], index) => (
        <div
          key={`${label}-${index}`}
          className={`absolute ${position} flex items-center gap-2`}
        >
          <div
            className="h-2.5 w-2.5 rounded-full border"
            style={{
              background: "var(--surface)",
              borderColor: "var(--muted)",
            }}
          />

          <span className="font-mono text-[10px] theme-muted">{label}</span>
        </div>
      ))}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="absolute -inset-7 rounded-full border opacity-30"
          style={{ borderColor: "var(--cyan)" }}
        />

        <div
          className="relative flex h-24 w-24 flex-col items-center justify-center rounded-2xl border"
          style={{
            background: "var(--surface-2)",
            borderColor: "var(--cyan)",
          }}
        >
          <div
            className="mb-2 h-2.5 w-2.5 rounded-full"
            style={{ background: "var(--cyan)" }}
          />

          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-muted">
            Target
          </span>

          <span className="mt-1 font-mono text-xs theme-text">
            0x8F...42
          </span>
        </div>
      </div>

      <div className="absolute right-[18%] top-[23%]">
        <div
          className="flex items-center gap-3 rounded-xl border px-4 py-3"
          style={{
            background: "var(--surface-2)",
            borderColor: "var(--border)",
          }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold"
            style={{
              background: "var(--background)",
              color: "var(--cyan)",
            }}
          >
            V
          </div>

          <div>
            <p className="text-xs font-semibold theme-text">VASP</p>
            <p className="font-mono text-[10px] theme-muted">0xBC...72</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-7 flex flex-wrap gap-2">
        <span className="rounded-full border theme-border px-3 py-1.5 text-[10px] theme-muted">
          Transaction flow
        </span>

        <span className="rounded-full border theme-border px-3 py-1.5 text-[10px] theme-muted">
          Behavioral signals
        </span>

        <span className="rounded-full border theme-border px-3 py-1.5 text-[10px] theme-muted">
          VASP attribution
        </span>
      </div>
    </div>
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
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.4 3.1-5.2 7-5.2s6.2 1.8 7 5.2" />
    </svg>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("stocometer-theme");

    document.documentElement.classList.toggle(
      "light",
      savedTheme === "light"
    );

    const hasSeenWelcome = sessionStorage.getItem(
      "stocometer-welcome-seen"
    );

    if (!hasSeenWelcome) {
      const timer = window.setTimeout(() => {
        setWelcomeOpen(true);
        sessionStorage.setItem("stocometer-welcome-seen", "true");
      }, 1000);

      return () => window.clearTimeout(timer);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeWelcome = () => {
    setWelcomeOpen(false);
  };

  return (
    <main className="theme-background theme-text min-h-screen">
      {/* Navigation */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all ${
          scrolled ? "theme-border backdrop-blur-xl" : "border-transparent"
        }`}
        style={{
          background: scrolled
            ? "color-mix(in srgb, var(--background) 88%, transparent)"
            : "transparent",
        }}
      >
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

            <span className="text-sm font-semibold tracking-[0.08em]">
              STOCOMETER
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="/how-it-works"
              className="text-sm theme-muted hover:theme-text"
            >
              How it works
            </Link>

            <Link
              href="/learn"
              className="text-sm theme-muted hover:theme-text"
            >
              Learn
            </Link>

            <Link
              href="/why-stocometer"
              className="text-sm theme-muted hover:theme-text"
            >
              Why STOCOMETER
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/analyze"
              className="hidden rounded-full border px-4 py-2 text-sm font-medium sm:inline-flex"
              style={{
                background: "var(--foreground)",
                color: "var(--background)",
                borderColor: "var(--foreground)",
              }}
            >
              Start investigation
            </Link>

            {/* Profile */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                className="theme-surface theme-border theme-text flex h-9 w-9 items-center justify-center rounded-full border"
              >
                <ProfileIcon />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border theme-border theme-surface shadow-2xl">
                  <div className="border-b theme-border px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
                        style={{
                          background: "var(--surface-2)",
                          color: "var(--cyan)",
                        }}
                      >
                        AM
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          Alex Morgan
                        </p>

                        <p className="truncate text-xs theme-muted">
                          Investigation Analyst
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-sm theme-muted hover:theme-text"
                    >
                      Profile & Settings
                    </Link>

                    <Link
                      href="/login"
                      onClick={() => setProfileOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-sm theme-muted hover:theme-text"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Welcome modal */}
      {welcomeOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
          <button
            type="button"
            aria-label="Close welcome dialog"
            onClick={closeWelcome}
            className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-sm"
          />

          <div className="relative z-10 w-full max-w-md rounded-3xl border theme-border theme-surface p-7 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closeWelcome}
              aria-label="Close"
              className="theme-muted absolute right-5 top-5 text-xl leading-none hover:theme-text"
            >
              ×
            </button>

            <div
              className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-bold"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface-2)",
                color: "var(--cyan)",
              }}
            >
              SC
            </div>

            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--cyan)" }}
            >
              Welcome
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
              Start understanding the wallet.
            </h2>

            <p className="mt-3 text-sm leading-6 theme-muted">
              Explore STOCOMETER as a guest or sign in to keep your account
              experience connected.
            </p>

            <div className="mt-7 space-y-3">
              <Link
                href="/login"
                onClick={closeWelcome}
                className="flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold"
                style={{
                  background: "var(--foreground)",
                  color: "var(--background)",
                }}
              >
                Continue with Google
              </Link>

              <Link
                href="/analyze"
                onClick={closeWelcome}
                className="theme-surface-2 theme-border theme-text flex w-full items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium"
              >
                Continue as guest
              </Link>

              <button
                type="button"
                onClick={closeWelcome}
                className="w-full py-2 text-sm theme-muted hover:theme-text"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden border-b theme-border pt-32">
        <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="max-w-2xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border theme-border px-3 py-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--cyan)" }}
                />

                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] theme-muted">
                  Blockchain risk intelligence
                </span>
              </div>

              <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Understand where
                <br />
                the money went.
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 theme-muted sm:text-lg">
                STOCOMETER turns a suspect cryptocurrency wallet into an
                investigation-ready view of transactions, behavioral signals,
                risk indicators, and possible VASP connections.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/analyze"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                  style={{
                    background: "var(--foreground)",
                    color: "var(--background)",
                  }}
                >
                  Analyze a wallet
                  <ArrowIcon />
                </Link>

                <Link
                  href="/how-it-works"
                  className="theme-surface theme-border theme-text inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-medium"
                >
                  See how it works
                </Link>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs theme-muted">
                <span>Multi-chain analysis</span>
                <span className="h-1 w-1 rounded-full bg-current opacity-40" />
                <span>Behavioral signals</span>
                <span className="h-1 w-1 rounded-full bg-current opacity-40" />
                <span>Evidence-oriented output</span>
              </div>
            </div>

            <NetworkDiagram />
          </div>
        </div>
      </section>

      {/* Intro strip */}
      <section className="border-b theme-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-3 md:items-center">
          <div className="md:col-span-2">
            <p className="max-w-3xl text-xl leading-8 tracking-[-0.02em] sm:text-2xl">
              Blockchain data is public.{" "}
              <span className="theme-muted">
                Making sense of it is the hard part.
              </span>
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-xs uppercase tracking-[0.16em] theme-muted">
              From raw data
            </p>

            <p className="mt-1 text-sm font-medium">
              to investigation context
            </p>
          </div>
        </div>
      </section>

      {/* Building blocks */}
      <section className="border-b theme-border">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-2xl">
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--cyan)" }}
            >
              The building blocks
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Start with the things
              <br />
              investigators actually need.
            </h2>

            <p className="mt-5 max-w-xl leading-7 theme-muted">
              STOCOMETER connects blockchain activity with understandable
              investigation signals instead of presenting a wall of raw
              transaction data.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border theme-border bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
            {cryptoCards.map((card) => (
              <article
                key={card.number}
                className="theme-surface p-7 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs theme-muted">
                    {card.number}
                  </span>

                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--cyan)" }}
                  />
                </div>

                <h3 className="mt-14 text-xl font-semibold">
                  {card.title}
                </h3>

                <p className="mt-3 text-sm leading-6 theme-muted">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b theme-border">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] theme-muted">
                The problem
              </p>

              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
                A blockchain explorer
                <br />
                gives you the evidence.
                <br />
                Not the explanation.
              </h2>

              <p className="mt-6 max-w-xl leading-7 theme-muted">
                One wallet can interact with dozens of addresses, assets, and
                transactions. Investigating that activity manually can quickly
                become difficult to follow.
              </p>
            </div>

            <div className="theme-surface overflow-hidden rounded-2xl border theme-border">
              <div className="flex items-center justify-between border-b theme-border px-5 py-4">
                <div>
                  <p className="text-xs font-semibold theme-text">
                    Raw transaction activity
                  </p>

                  <p className="mt-0.5 text-[11px] theme-muted">
                    What an investigator starts with
                  </p>
                </div>

                <span className="font-mono text-[10px] theme-muted">
                  0x8F...42
                </span>
              </div>

              <div className="divide-y theme-border">
                {[
                  ["0x71...A4", "0.0346 ETH", "12:41:08"],
                  ["0x93...18", "1,240 USDT", "12:37:51"],
                  ["0xBC...72", "0.0287 ETH", "12:32:17"],
                  ["0x42...D1", "0.0091 ETH", "12:28:03"],
                ].map(([address, value, time]) => (
                  <div
                    key={`${address}-${time}`}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4"
                  >
                    <div>
                      <p className="font-mono text-xs theme-text">
                        {address}
                      </p>

                      <p className="mt-1 text-[10px] theme-muted">
                        outgoing transfer
                      </p>
                    </div>

                    <span className="font-mono text-xs theme-text">
                      {value}
                    </span>

                    <span className="font-mono text-[10px] theme-muted">
                      {time}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t theme-border px-5 py-4">
                <p className="text-xs theme-muted">
                  Four transactions. Many possible relationships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="border-b theme-border">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--cyan)" }}
              >
                The workflow
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                From wallet
                <br />
                to evidence.
              </h2>

              <p className="mt-5 max-w-md leading-7 theme-muted">
                A simple investigation flow designed to make complex
                blockchain activity easier to inspect and communicate.
              </p>
            </div>

            <div className="divide-y theme-border border-y">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="grid gap-5 py-7 sm:grid-cols-[80px_180px_1fr] sm:items-start"
                >
                  <span className="font-mono text-xs theme-muted">
                    {step.number}
                  </span>

                  <h3 className="text-xl font-semibold">{step.title}</h3>

                  <p className="max-w-lg text-sm leading-6 theme-muted">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why STOCOMETER */}
      <section className="border-b theme-border">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] theme-muted">
              What changes
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Less scrolling.
              <br />
              More investigation context.
            </h2>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border theme-border">
            <div className="grid md:grid-cols-2">
              <div className="theme-surface-2 border-b theme-border p-7 md:border-b-0 md:border-r">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] theme-muted">
                  Raw blockchain view
                </p>

                <ul className="mt-7 space-y-4 text-sm">
                  {[
                    "Transaction hashes",
                    "Wallet addresses",
                    "Token movements",
                    "Block and timestamp data",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="theme-muted">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="theme-surface p-7">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.14em]"
                  style={{ color: "var(--cyan)" }}
                >
                  STOCOMETER investigation
                </p>

                <ul className="mt-7 space-y-4 text-sm">
                  {[
                    "Transaction relationships",
                    "Behavioral risk signals",
                    "VASP attribution",
                    "Evidence chains and findings",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full border"
                        style={{
                          borderColor: "var(--cyan)",
                          color: "var(--cyan)",
                        }}
                      >
                        ✓
                      </span>

                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="theme-surface relative overflow-hidden rounded-3xl border theme-border px-7 py-14 sm:px-12 sm:py-16">
            <div className="relative z-10 max-w-2xl">
              <p
                className="text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--cyan)" }}
              >
                Start an investigation
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Before you trust a wallet,
                <br />
                understand it.
              </h2>

              <p className="mt-5 max-w-xl leading-7 theme-muted">
                Enter a supported blockchain wallet and turn its public
                activity into a structured risk investigation.
              </p>

              <Link
                href="/analyze"
                className="mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                style={{
                  background: "var(--foreground)",
                  color: "var(--background)",
                }}
              >
                Start investigation
                <ArrowIcon />
              </Link>
            </div>

            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border opacity-30"
              style={{ borderColor: "var(--cyan)" }}
            />

            <div
              className="pointer-events-none absolute -bottom-32 right-24 h-64 w-64 rounded-full border opacity-20"
              style={{ borderColor: "var(--cyan)" }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t theme-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.08em]">
              STOCOMETER
            </p>

            <p className="mt-1 text-xs theme-muted">
              Blockchain risk intelligence for investigation.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs theme-muted">
            <Link href="/learn" className="hover:theme-text">
              Learn
            </Link>

            <Link href="/how-it-works" className="hover:theme-text">
              How it works
            </Link>

            <Link href="/why-stocometer" className="hover:theme-text">
              Why STOCOMETER
            </Link>

            <Link href="/settings" className="hover:theme-text">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}