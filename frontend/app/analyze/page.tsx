"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ForceGraph = dynamic(
  () => import("react-force-graph-2d"),
  {
    ssr: false,
  }
);

type Transfer = {
  from?: string;
  to?: string;
  hash?: string;
  asset?: string;
  value?: number;
};

type AnalysisResult = {
  wallet: string;
  blockchain: {
    transfer_count: number;
    unique_addresses: number;
    assets: string[];
    categories: Record<string, number>;
    transfers: Transfer[];
  };
  security: {
    indicators: Record<string, string>;
    positive_flags: string[];
    flag_count: number;
  };
  risk: {
    risk_score: number;
    risk_level: string;
    reasons: string[];
  };
};

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!wallet.trim()) {
      setError("Please enter an Ethereum wallet address.");
      return;
    }

    setError("");
    setAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet: wallet.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Wallet analysis failed.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to STOCOMETER."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setError("");
    setWallet("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (result) {
    return (
      <RiskDashboard
        result={result}
        onReset={resetAnalysis}
      />
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-350px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[160px]" />

        <div className="absolute right-[-250px] top-[35%] h-[500px] w-[500px] rounded-full bg-blue-600/[0.05] blur-[140px]" />

        <div className="absolute left-[-250px] top-[65%] h-[500px] w-[500px] rounded-full bg-cyan-600/[0.04] blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between border-b border-white/[0.06] px-6 py-5 lg:px-14">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] shadow-[0_0_25px_rgba(34,211,238,0.08)]">
            <div className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,1)]" />
          </div>

          <div>
            <div className="text-lg font-bold tracking-tight">
              STOCO<span className="text-cyan-300">METER</span>
            </div>

            <div className="hidden text-[9px] tracking-[0.25em] text-slate-600 sm:block">
              RISK INTELLIGENCE
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-9 text-sm text-slate-500 md:flex">
          <a href="#learn" className="transition hover:text-white">
            Learn
          </a>

          <a href="#why" className="transition hover:text-white">
            Why STOCOMETER
          </a>

          <a href="#how" className="transition hover:text-white">
            How it works
          </a>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-medium tracking-wider text-slate-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          SYSTEM ONLINE
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-center justify-center px-6 pb-28 pt-20 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-cyan-300">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
          BLOCKCHAIN RISK INTELLIGENCE
        </div>

        <h1 className="max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-[92px]">
          Crypto doesn&apos;t have to
          <br />
          be{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent">
            confusing.
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
          Learn what&apos;s happening behind your crypto, understand the
          risks, and make smarter decisions — without needing to be a
          blockchain expert.
        </p>

        {/* Wallet Analyzer */}
        <div className="mt-12 w-full max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-2 shadow-2xl shadow-black/40 backdrop-blur-xl transition duration-500 focus-within:border-cyan-300/25 focus-within:shadow-cyan-950/20">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-1 items-center rounded-xl bg-[#0C111A] px-5">
                <svg
                  className="mr-3 h-5 w-5 shrink-0 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                  />
                </svg>

                <input
                  value={wallet}
                  onChange={(e) => {
                    setWallet(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAnalyze();
                    }
                  }}
                  placeholder="Enter Ethereum wallet address..."
                  className="h-14 w-full bg-transparent font-mono text-xs text-white outline-none placeholder:text-slate-600 sm:text-sm"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="h-14 rounded-xl bg-cyan-300 px-8 text-xs font-bold tracking-wide text-[#071014] shadow-[0_0_30px_rgba(34,211,238,0.12)] transition duration-300 hover:bg-cyan-200 hover:shadow-[0_0_40px_rgba(34,211,238,0.25)] disabled:cursor-wait disabled:opacity-70"
              >
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#071014]/30 border-t-[#071014]" />
                    ANALYZING
                  </span>
                ) : (
                  "ANALYZE WALLET ↗"
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[10px] uppercase tracking-wider text-slate-600 sm:gap-6">
            <span>Ethereum Mainnet</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
            <span>Security Intelligence</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
            <span>Explainable Risk</span>
          </div>
        </div>

        {/* Floating stats */}
        <div className="mt-24 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            number="01"
            title="LOOK"
            text="Understand what is happening on-chain."
          />

          <StatCard
            number="02"
            title="CHECK"
            text="Find security signals that deserve attention."
          />

          <StatCard
            number="03"
            title="EXPLAIN"
            text="Turn complex blockchain data into simple answers."
          />
        </div>
      </section>

      {/* Learn Section */}
      <section
        id="learn"
        className="relative z-10 border-t border-white/[0.05] px-6 py-28 lg:px-14"
      >
        <div className="mx-auto max-w-7xl">
          <SectionLabel>START HERE</SectionLabel>

          <div className="mt-5 max-w-3xl">
            <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Crypto,
              <br />
              <span className="text-slate-500">explained simply.</span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-500">
              You shouldn&apos;t need a computer science degree to understand
              what happens to your money.
            </p>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <LearnCard
              icon="₿"
              title="Cryptocurrency"
              text="Digital money that exists on the internet instead of inside a bank."
            />

            <LearnCard
              icon="◈"
              title="Wallet"
              text="Your crypto wallet is like your account. It lets you send and receive crypto."
            />

            <LearnCard
              icon="⛓"
              title="Blockchain"
              text="A public record that keeps track of what happens to crypto."
            />

            <LearnCard
              icon="!"
              title="Crypto Risk"
              text="Some wallets, tokens, and transactions can be connected to suspicious activity."
              warning
            />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="relative z-10 overflow-hidden border-t border-white/[0.05] px-6 py-32 lg:px-14">
        <div className="mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-2">
          <div>
            <SectionLabel>THE PROBLEM</SectionLabel>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Anyone can see
              <br />
              the blockchain.
              <br />
              <span className="text-slate-600">
                Understanding it is harder.
              </span>
            </h2>

            <p className="mt-7 max-w-lg text-sm leading-7 text-slate-500">
              Blockchain explorers give you numbers, addresses and
              transactions. Security tools give you individual warnings.
              But putting all of that information together can be difficult —
              especially if you&apos;re new to crypto.
            </p>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-white/[0.07] bg-[#0C111A]/80 p-7 shadow-2xl backdrop-blur-xl">
              <div className="mb-7 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-slate-600">
                  RAW BLOCKCHAIN DATA
                </span>

                <span className="text-[10px] text-slate-700">
                  LIVE FEED
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {[
                  ["0x7A...91F", "847", "transactions"],
                  ["0xB2...4C8", "126", "addresses"],
                  ["0x91...A21", "37", "tokens"],
                  ["0x4F...C19", "24", "contracts"],
                ].map(([address, number, label], index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-4"
                  >
                    <span className="text-slate-500">{address}</span>

                    <span className="text-slate-300">
                      {number}{" "}
                      <span className="text-slate-700">{label}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 border-t border-white/[0.05] pt-6 text-center">
                <span className="text-sm text-slate-600">
                  What does all of this actually mean?
                </span>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-cyan-400/15 bg-[#101721] px-5 py-4 shadow-2xl">
              <div className="text-[9px] tracking-[0.2em] text-cyan-400/60">
                THE MISSING LAYER
              </div>

              <div className="mt-1 text-sm font-medium text-white">
                Understanding
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why STOCOMETER */}
      <section
        id="why"
        className="relative z-10 border-t border-white/[0.05] px-6 py-32 lg:px-14"
      >
        <div className="mx-auto max-w-7xl">
          <SectionLabel>WHY STOCOMETER</SectionLabel>

          <div className="mt-5 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              From confusing data
              <br />
              to{" "}
              <span className="text-cyan-300">clear decisions.</span>
            </h2>

            <p className="max-w-sm text-sm leading-6 text-slate-500">
              We don&apos;t just show you blockchain data. We bring the
              important signals together and explain what they mean.
            </p>
          </div>

          <div className="mt-16 overflow-hidden rounded-3xl border border-white/[0.07]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="border-b border-white/[0.06] bg-white/[0.015] p-8 lg:border-b-0 lg:border-r lg:p-12">
                <div className="text-[10px] font-semibold tracking-[0.2em] text-slate-600">
                  THE USUAL WAY
                </div>

                <div className="mt-8 space-y-5">
                  <ComparisonRow
                    bad
                    title="Raw blockchain data"
                    text="Numbers without context"
                  />

                  <ComparisonRow
                    bad
                    title="Separate security checks"
                    text="Information spread across tools"
                  />

                  <ComparisonRow
                    bad
                    title="Hard to interpret"
                    text="Technical information everywhere"
                  />

                  <ComparisonRow
                    bad
                    title="No unified picture"
                    text="You have to connect the dots yourself"
                  />
                </div>
              </div>

              <div className="bg-cyan-400/[0.015] p-8 lg:p-12">
                <div className="text-[10px] font-semibold tracking-[0.2em] text-cyan-400/70">
                  THE STOCOMETER WAY
                </div>

                <div className="mt-8 space-y-5">
                  <ComparisonRow
                    title="Blockchain intelligence"
                    text="Understand wallet activity"
                  />

                  <ComparisonRow
                    title="Security analysis"
                    text="Identify important warning signals"
                  />

                  <ComparisonRow
                    title="Unified risk score"
                    text="One simple risk picture"
                  />

                  <ComparisonRow
                    title="Explainable results"
                    text="Know why the score looks that way"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how"
        className="relative z-10 border-t border-white/[0.05] px-6 py-32 lg:px-14"
      >
        <div className="mx-auto max-w-7xl">
          <SectionLabel>HOW IT WORKS</SectionLabel>

          <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Three steps.
            <br />
            <span className="text-slate-500">One clearer picture.</span>
          </h2>

          <div className="relative mt-20 grid gap-4 lg:grid-cols-3">
            <ProcessCard
              number="01"
              title="LOOK"
              description="STOCOMETER looks at the wallet's blockchain activity."
              detail="Transactions • Addresses • Assets"
            />

            <ProcessCard
              number="02"
              title="CHECK"
              description="Security intelligence helps identify suspicious signals."
              detail="Threats • Flags • Security indicators"
            />

            <ProcessCard
              number="03"
              title="EXPLAIN"
              description="The signals are combined into an understandable risk profile."
              detail="Score • Level • Reasons"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 border-t border-white/[0.05] px-6 py-36 text-center lg:px-14">
        <SectionLabel>YOUR TURN</SectionLabel>

        <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">
          Learn first.
          <br />
          <span className="text-cyan-300">Check later.</span>
        </h2>

        <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-slate-500">
          Enter an Ethereum wallet and see what STOCOMETER can tell you about
          its activity and security signals.
        </p>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-10 rounded-xl bg-cyan-300 px-8 py-4 text-xs font-bold tracking-wide text-[#071014] transition hover:bg-cyan-200 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]"
        >
          CHECK A WALLET ↗
        </button>

        <div className="mx-auto mt-24 flex max-w-xl items-center justify-center gap-4 text-[9px] tracking-[0.25em] text-slate-700">
          <span className="h-px flex-1 bg-slate-800" />
          STOCOMETER RISK ENGINE
          <span className="h-px flex-1 bg-slate-800" />
        </div>
      </section>
    </main>
  );
}


/* ============================================================
   COMPONENTS
============================================================ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.25em] text-cyan-400/60">
      <span className="h-px w-8 bg-cyan-400/30" />
      {children}
    </div>
  );
}


function StatCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-left backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:border-cyan-300/15 hover:bg-white/[0.035]">
      <div className="font-mono text-xs text-cyan-400/40">{number}</div>

      <div className="mt-7 text-xs font-bold tracking-[0.18em] text-slate-200">
        {title}
      </div>

      <p className="mt-2 text-xs leading-6 text-slate-600">{text}</p>
    </div>
  );
}


function LearnCard({
  icon,
  title,
  text,
  warning = false,
}: {
  icon: string;
  title: string;
  text: string;
  warning?: boolean;
}) {
  return (
    <div className="group rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7 transition duration-500 hover:-translate-y-1 hover:border-cyan-300/15 hover:bg-white/[0.035]">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-lg ${
          warning
            ? "border-amber-400/20 bg-amber-400/[0.05] text-amber-300"
            : "border-cyan-400/15 bg-cyan-400/[0.04] text-cyan-300"
        }`}
      >
        {icon}
      </div>

      <h3 className="mt-8 text-base font-medium text-slate-200">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}


function ComparisonRow({
  title,
  text,
  bad = false,
}: {
  title: string;
  text: string;
  bad?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
          bad
            ? "border-red-400/15 bg-red-400/[0.04] text-red-400/60"
            : "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-300"
        }`}
      >
        {bad ? "×" : "✓"}
      </div>

      <div>
        <div className="text-sm font-medium text-slate-300">{title}</div>
        <div className="mt-1 text-xs text-slate-600">{text}</div>
      </div>
    </div>
  );
}


function ProcessCard({
  number,
  title,
  description,
  detail,
}: {
  number: string;
  title: string;
  description: string;
  detail: string;
}) {
  return (
    <div className="relative rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 transition duration-500 hover:border-cyan-300/15 hover:bg-white/[0.035]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-cyan-400/50">{number}</span>

        <span className="h-px w-12 bg-slate-800" />
      </div>

      <h3 className="mt-12 text-sm font-bold tracking-[0.2em] text-cyan-300">
        {title}
      </h3>

      <p className="mt-5 text-base leading-7 text-slate-300">
        {description}
      </p>

      <div className="mt-10 border-t border-white/[0.05] pt-5 font-mono text-[10px] text-slate-600">
        {detail}
      </div>
    </div>
  );
}


/* ============================================================
   RISK DASHBOARD
============================================================ */

function RiskDashboard({
  result,
  onReset,
}: {
  result: AnalysisResult;
  onReset: () => void;
}) {
  const score = result.risk.risk_score;

  const riskColor =
    result.risk.risk_level === "HIGH"
      ? "text-red-400"
      : result.risk.risk_level === "MEDIUM"
        ? "text-amber-300"
        : "text-emerald-400";

  const riskBorder =
    result.risk.risk_level === "HIGH"
      ? "border-red-400/20"
      : result.risk.risk_level === "MEDIUM"
        ? "border-amber-400/20"
        : "border-emerald-400/20";

  return (
    <main className="min-h-screen bg-[var(--background)] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/[0.05] blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-6 py-5 lg:px-14">
        <button
          onClick={onReset}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
            <div className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />
          </div>

          <span className="text-lg font-semibold">
            STOCO<span className="text-cyan-300">METER</span>
          </span>
        </button>

        <button
          onClick={onReset}
          className="rounded-lg border border-white/[0.08] px-4 py-2 text-[10px] font-semibold tracking-wider text-slate-500 transition hover:border-cyan-300/20 hover:text-white"
        >
          ← NEW ANALYSIS
        </button>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:px-14">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="text-[10px] font-semibold tracking-[0.25em] text-cyan-400/60">
              WALLET RISK ANALYSIS
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Risk profile
            </h1>

            <div className="mt-4 break-all font-mono text-xs text-slate-600">
              {result.wallet}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] tracking-wider text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            ANALYSIS COMPLETE
          </div>
        </div>

        {/* Main score */}
        <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div
            className={`relative overflow-hidden rounded-3xl border ${riskBorder} bg-white/[0.02] p-8 sm:p-12`}
          >
            <div className="absolute right-[-100px] top-[-100px] h-80 w-80 rounded-full bg-cyan-400/[0.03] blur-[80px]" />

            <div className="relative flex flex-col items-center justify-center py-8 text-center">
              <div className="text-[10px] font-semibold tracking-[0.25em] text-slate-600">
                BASELINE RISK SCORE
              </div>

              <div className="relative mt-8 flex h-56 w-56 items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-white/[0.05]" />

                <div className="absolute inset-3 rounded-full border border-cyan-400/10" />

                <div className="absolute inset-7 rounded-full border border-white/[0.04]" />

                <div>
                  <div className={`text-7xl font-semibold tracking-[-0.06em] ${riskColor}`}>
                    {score}
                  </div>

                  <div className={`mt-1 text-xs font-bold tracking-[0.25em] ${riskColor}`}>
                    {result.risk.risk_level}
                  </div>
                </div>
              </div>

              <p className="mt-7 max-w-md text-xs leading-6 text-slate-600">
                A rule-based baseline score built from current blockchain
                activity and security intelligence.
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <DashboardStat
              label="TRANSFERS ANALYZED"
              value={result.blockchain.transfer_count.toLocaleString()}
              description="Current scan window"
            />

            <DashboardStat
              label="CONNECTED ADDRESSES"
              value={result.blockchain.unique_addresses.toLocaleString()}
              description="Unique addresses observed"
            />

            <DashboardStat
              label="SECURITY FLAGS"
              value={result.security.flag_count.toString()}
              description={
                result.security.flag_count === 0
                  ? "No positive indicators detected"
                  : "Positive indicators detected"
              }
            />
          </div>
        </div>

        {/* Security + reasons */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-slate-600">
              SECURITY ANALYSIS
            </div>

            <div className="mt-7 grid gap-2 sm:grid-cols-2">
              {[
                ["Phishing", "phishing"],
                ["Cybercrime", "cybercrime"],
                ["Money laundering", "money_laundering"],
                ["Sanctions", "sanctioned"],
                ["Mixer", "mixer"],
                ["Darkweb", "darkweb"],
                ["Financial crime", "financial_crime"],
                ["Stealing attack", "stealing_attack"],
              ].map(([label, key]) => {
                const detected =
                  result.security.indicators[key] === "1";

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.015] px-4 py-3"
                  >
                    <span className="text-xs text-slate-500">
                      {label}
                    </span>

                    <span
                      className={`flex items-center gap-2 text-[10px] font-medium ${
                        detected
                          ? "text-red-400"
                          : "text-emerald-400/80"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          detected
                            ? "bg-red-400"
                            : "bg-emerald-400"
                        }`}
                      />

                      {detected ? "DETECTED" : "CLEAR"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-slate-600">
              WHY THIS SCORE?
            </div>

            <div className="mt-7 space-y-3">
              {result.risk.reasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] p-4"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/[0.06] text-[10px] text-cyan-300">
                    {index + 1}
                  </span>

                  <span className="text-xs leading-5 text-slate-400">
                    {reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
                {/* Wallet Relationship Graph */}
        <div className="mt-4 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.2em] text-slate-600">
                WALLET RELATIONSHIP GRAPH
              </div>

              <div className="mt-2 text-sm text-slate-400">
                Connected addresses observed from blockchain activity
              </div>
            </div>

            <div className="font-mono text-xs text-slate-600">
              {result.blockchain.unique_addresses} connections
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.05] bg-[var(--background)]">
            <WalletGraph
              wallet={result.wallet}
              transfers={result.blockchain.transfers}
            />
          </div>
        </div>
        {/* Assets */}
        <div className="mt-4 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.2em] text-slate-600">
                ASSET ACTIVITY
              </div>

              <div className="mt-2 text-sm text-slate-400">
                Assets observed during the current scan
              </div>
            </div>

            <div className="font-mono text-xs text-slate-600">
              {result.blockchain.assets.length} assets
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {result.blockchain.assets.length > 0 ? (
              result.blockchain.assets.map((asset) => (
                <span
                  key={asset}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 font-mono text-[10px] text-slate-500"
                >
                  {asset}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-600">
                No asset information available.
              </span>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-[10px] leading-5 text-slate-700">
          STOCOMETER provides an informational risk assessment based on
          available blockchain and security signals. A low score does not
          guarantee that a wallet is safe.
        </div>
      </section>
    </main>
  );
}


function DashboardStat({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col justify-between rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
      <div className="text-[10px] font-semibold tracking-[0.2em] text-slate-600">
        {label}
      </div>

      <div className="mt-10">
        <div className="text-4xl font-semibold tracking-[-0.04em] text-slate-200">
          {value}
        </div>

        <div className="mt-2 text-xs text-slate-600">
          {description}
        </div>
      </div>
    </div>
  );
}
function WalletGraph({
  wallet,
  transfers,
}: {
  wallet: string;
  transfers: Transfer[];
}) {
  const graphData = {
    nodes: [
      {
        id: wallet,
        label: "TARGET",
      },
      ...Array.from(
        new Set(
          transfers.flatMap((transfer) =>
            [transfer.from, transfer.to].filter(
            (address): address is string =>
              typeof address === "string" &&
              address.length > 0 &&
              address.toLowerCase() !== wallet.toLowerCase()
)
          )
        )
      ).map((address) => ({
        id: address,
        label: `${address.slice(0, 6)}...${address.slice(-4)}`,
      })),
    ],
    links: transfers
      .filter(
        (transfer) =>
          transfer.from &&
          transfer.to &&
          transfer.from.toLowerCase() !== transfer.to.toLowerCase()
      )
      .map((transfer, index) => ({
      id: `${transfer.hash ?? "link"}-${index}`,
      source: transfer.from!.toLowerCase(),
      target: transfer.to!.toLowerCase(),
})),
  };

  return (
    <ForceGraph
      graphData={graphData}
      nodeLabel="label"
      nodeAutoColorBy="id"
      backgroundColor="var(--background)"
      linkColor={() => "rgba(34,211,238,0.25)"}
      nodeRelSize={5}
      linkWidth={1}
      cooldownTicks={100}
      enableZoomInteraction={true}
      enablePanInteraction={true}
    />
  );
}