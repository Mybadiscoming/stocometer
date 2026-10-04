"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8001";

const NETWORKS = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "polygon", name: "Polygon", symbol: "POL" },
  { id: "base", name: "Base", symbol: "BASE" },
  { id: "arbitrum", name: "Arbitrum", symbol: "ARB" },
  { id: "solana", name: "Solana", symbol: "SOL" },
];

type InvestigationResult = {
  target_wallet?: string;
  status?: string;
  networks?: Record<string, unknown>;
  network_results?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  combined?: Record<string, unknown>;
  findings?: string[];
  key_findings?: string[];
  confidence?: string;
  [key: string]: unknown;
};

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

function NetworkIcon({ symbol }: { symbol: string }) {
  return (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-xl border text-[10px] font-semibold"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface-2)",
        color: "var(--cyan)",
      }}
    >
      {symbol}
    </span>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="theme-surface rounded-2xl border theme-border p-5">
      <p className="text-xs theme-muted">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
        {value}
      </p>
    </div>
  );
}

function formatValue(value: unknown, fallback = "—"): string {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function findNumber(
  object: Record<string, unknown> | undefined,
  keys: string[],
): number {
  if (!object) return 0;

  for (const key of keys) {
    const value = object[key];

    if (typeof value === "number") {
      return value;
    }
  }

  return 0;
}

function extractNetworkData(
  result: InvestigationResult,
  network: string,
): Record<string, unknown> | null {
  const possibleContainers = [
    result.networks,
    result.network_results,
    result.combined,
  ];

  for (const container of possibleContainers) {
    if (!container) continue;

    const value = container[network];

    if (value && typeof value === "object") {
      return value as Record<string, unknown>;
    }
  }

  return null;
}

export default function CrossChainPage() {
  const [wallet, setWallet] = useState("");
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([
    "ethereum",
    "polygon",
    "base",
    "arbitrum",
    "solana",
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("stocometer-theme");

    document.documentElement.classList.toggle(
      "light",
      savedTheme === "light",
    );
  }, []);

  function toggleNetwork(network: string) {
    setSelectedNetworks((current) =>
      current.includes(network)
        ? current.filter((item) => item !== network)
        : [...current, network],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!wallet.trim()) {
      setError("Enter a wallet address to begin the investigation.");
      return;
    }

    if (selectedNetworks.length === 0) {
      setError("Select at least one blockchain network.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/investigate/cross-chain`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet: wallet.trim(),
            networks: selectedNetworks,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            data?.detail ||
            "Cross-chain investigation failed.",
        );
      }

      setResult(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to complete the investigation.",
      );
    } finally {
      setLoading(false);
    }
  }

  const summary =
    result?.summary && typeof result.summary === "object"
      ? result.summary
      : result?.combined && typeof result.combined === "object"
        ? result.combined
        : {};

  const networkContainer =
    result?.networks || result?.network_results || {};

  const findings =
    Array.isArray(result?.key_findings)
      ? result.key_findings
      : Array.isArray(result?.findings)
        ? result.findings
        : [];

  const transactionCount = findNumber(summary, [
    "transaction_count",
    "total_transactions",
    "transfer_count",
  ]);

  const networkCount =
    Object.keys(networkContainer).length || selectedNetworks.length;

  const addressCount = findNumber(summary, [
    "unique_addresses",
    "unique_counterparties",
    "address_count",
  ]);

  const vaspCount = findNumber(summary, [
    "vasp_count",
    "identified_vasp_count",
  ]);

  return (
    <main className="theme-background theme-text min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b theme-border backdrop-blur-xl">
        <div
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
          style={{
            background:
              "color-mix(in srgb, var(--background) 88%, transparent)",
          }}
        >
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

          <div className="flex items-center gap-5">
            <Link
              href="/analyze"
              className="hidden text-sm theme-muted hover:theme-text sm:block"
            >
              Single-chain
            </Link>

            <Link
              href="/"
              className="text-sm theme-muted hover:theme-text"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Page intro */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border theme-border px-3 py-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--cyan)" }}
            />

            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] theme-muted">
              Cross-chain investigation
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Investigate activity
            <br />
            across networks.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 theme-muted">
            Analyze a wallet across multiple supported blockchain networks and
            bring the resulting activity into one investigation view.
          </p>
        </div>

        {/* Investigation form */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 theme-surface rounded-3xl border theme-border p-6 sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            {/* Wallet */}
            <div>
              <label
                htmlFor="wallet"
                className="block text-xs font-semibold uppercase tracking-[0.15em] theme-muted"
              >
                Target wallet
              </label>

              <p className="mt-2 text-sm theme-muted">
                Enter the wallet address you want to investigate.
              </p>

              <input
                id="wallet"
                value={wallet}
                onChange={(event) => setWallet(event.target.value)}
                placeholder="Enter wallet address..."
                className="theme-background theme-text mt-5 w-full rounded-xl border theme-border px-4 py-4 font-mono text-sm outline-none transition focus:border-[var(--cyan)]"
              />
            </div>

            {/* Networks */}
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] theme-muted">
                    Networks
                  </p>

                  <p className="mt-2 text-sm theme-muted">
                    Select the chains to include.
                  </p>
                </div>

                <span className="font-mono text-xs theme-muted">
                  {selectedNetworks.length}/5
                </span>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {NETWORKS.map((network) => {
                  const selected = selectedNetworks.includes(network.id);

                  return (
                    <button
                      key={network.id}
                      type="button"
                      onClick={() => toggleNetwork(network.id)}
                      className="flex items-center gap-3 rounded-xl border p-3 text-left transition"
                      style={{
                        borderColor: selected
                          ? "var(--cyan)"
                          : "var(--border)",
                        background: selected
                          ? "color-mix(in srgb, var(--cyan) 7%, var(--surface))"
                          : "var(--surface)",
                      }}
                    >
                      <NetworkIcon symbol={network.symbol} />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          {network.name}
                        </p>

                        <p className="mt-0.5 text-[11px] theme-muted">
                          {selected ? "Included" : "Not selected"}
                        </p>
                      </div>

                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full border text-[10px]"
                        style={{
                          borderColor: selected
                            ? "var(--cyan)"
                            : "var(--border)",
                          color: selected
                            ? "var(--cyan)"
                            : "var(--muted)",
                        }}
                      >
                        {selected ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border p-4 text-sm">
              <p
                className="font-medium"
                style={{ color: "var(--high)" }}
              >
                Investigation error
              </p>

              <p className="mt-1 theme-muted">{error}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 border-t theme-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 theme-muted">
              Cross-chain analysis combines activity from the networks you
              select. It does not independently prove that the same funds
              moved between chains.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              {loading ? "Investigating..." : "Start investigation"}
              {!loading && <ArrowIcon />}
            </button>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="mt-8 theme-surface rounded-3xl border theme-border p-8">
            <div className="flex items-center gap-3">
              <span
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ background: "var(--cyan)" }}
              />

              <p className="text-sm font-medium">
                Building cross-chain investigation
              </p>
            </div>

            <p className="mt-3 text-sm theme-muted">
              Fetching activity and combining the selected networks.
            </p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <section className="mt-12">
            <div className="flex flex-col gap-3 border-b theme-border pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ color: "var(--cyan)" }}
                >
                  Investigation result
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                  Cross-chain overview
                </h2>
              </div>

              <span className="rounded-full border theme-border px-3 py-1.5 text-xs theme-muted">
                {formatValue(result.status, "Completed")}
              </span>
            </div>

            {/* Metrics */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="Networks analyzed" value={networkCount} />

              <Metric
                label="Transactions"
                value={transactionCount || "—"}
              />

              <Metric
                label="Addresses"
                value={addressCount || "—"}
              />

              <Metric label="VASP signals" value={vaspCount || "—"} />
            </div>

            {/* Target */}
            <div className="mt-6 theme-surface rounded-2xl border theme-border p-5">
              <p className="text-xs uppercase tracking-[0.14em] theme-muted">
                Target wallet
              </p>

              <p className="mt-3 break-all font-mono text-sm">
                {formatValue(
                  result.target_wallet,
                  wallet,
                )}
              </p>
            </div>

            {/* Network breakdown */}
            <div className="mt-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] theme-muted">
                  Network activity
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Activity by chain
                </h3>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {NETWORKS.filter((network) =>
                  selectedNetworks.includes(network.id),
                ).map((network) => {
                  const data = extractNetworkData(result, network.id);

                  const transfers = findNumber(data || undefined, [
                    "transfer_count",
                    "transaction_count",
                    "total_transactions",
                  ]);

                  const counterparties = findNumber(data || undefined, [
                    "unique_counterparties",
                    "unique_addresses",
                    "counterparty_count",
                  ]);

                  const riskScore = findNumber(data || undefined, [
                    "risk_score",
                    "score",
                  ]);

                  return (
                    <div
                      key={network.id}
                      className="theme-surface rounded-2xl border theme-border p-5"
                    >
                      <div className="flex items-center gap-3">
                        <NetworkIcon symbol={network.symbol} />

                        <div>
                          <p className="text-sm font-semibold">
                            {network.name}
                          </p>

                          <p className="text-xs theme-muted">
                            {data ? "Analyzed" : "Selected"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-[11px] theme-muted">
                            Transfers
                          </p>

                          <p className="mt-1 text-lg font-semibold">
                            {transfers || "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] theme-muted">
                            Addresses
                          </p>

                          <p className="mt-1 text-lg font-semibold">
                            {counterparties || "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] theme-muted">
                            Risk
                          </p>

                          <p className="mt-1 text-lg font-semibold">
                            {riskScore || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Findings */}
            {findings.length > 0 && (
              <div className="mt-8 theme-surface rounded-2xl border theme-border p-6">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ color: "var(--cyan)" }}
                >
                  Investigation findings
                </p>

                <div className="mt-5 space-y-3">
                  {findings.map((finding, index) => (
                    <div
                      key={`${finding}-${index}`}
                      className="flex gap-3 border-b theme-border pb-3 last:border-b-0 last:pb-0"
                    >
                      <span
                        className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: "var(--cyan)" }}
                      />

                      <p className="text-sm leading-6 theme-muted">
                        {finding}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confidence */}
            {result.confidence && (
              <div className="mt-6 flex flex-col gap-3 rounded-2xl border theme-border p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    Investigation confidence
                  </p>

                  <p className="mt-1 text-xs theme-muted">
                    Confidence reflects the available investigation evidence,
                    not proof of ownership or same-fund movement across chains.
                  </p>
                </div>

                <span
                  className="w-fit rounded-full border px-3 py-1.5 text-xs font-medium"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--cyan)",
                  }}
                >
                  {result.confidence}
                </span>
              </div>
            )}

            {/* Responsible analysis note */}
            <div className="mt-8 border-t theme-border pt-6">
              <p className="text-xs leading-5 theme-muted">
                <span className="font-medium theme-text">
                  Investigation note:
                </span>{" "}
                Cross-chain analysis combines observations from multiple
                blockchains. A relationship between activity on different
                networks should be treated as an investigative signal unless
                supported by additional bridge or transaction-level evidence.
              </p>
            </div>
          </section>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="mt-12 border-t theme-border pt-10">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Select networks",
                  text: "Choose the blockchains you want to include in the investigation.",
                },
                {
                  number: "02",
                  title: "Analyze activity",
                  text: "STOCOMETER gathers and evaluates the available activity for each selected network.",
                },
                {
                  number: "03",
                  title: "Compare signals",
                  text: "Review the combined investigation context and network-specific findings.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="theme-surface rounded-2xl border theme-border p-6"
                >
                  <span className="font-mono text-xs theme-muted">
                    {item.number}
                  </span>

                  <h3 className="mt-8 text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 theme-muted">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}