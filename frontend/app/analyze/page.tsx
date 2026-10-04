"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const ForceGraph = dynamic(
  () => import("react-force-graph-2d"),
  { ssr: false }
);

const API_BASE = "http://127.0.0.1:8001";

const NETWORKS = [
  { id: "ethereum", label: "Ethereum", symbol: "ETH" },
  { id: "polygon", label: "Polygon", symbol: "MATIC" },
  { id: "base", label: "Base", symbol: "BASE" },
  { id: "arbitrum", label: "Arbitrum", symbol: "ARB" },
  { id: "solana", label: "Solana", symbol: "SOL" },
] as const;

type Network = (typeof NETWORKS)[number]["id"];

type Transfer = {
  from?: string;
  to?: string;
  hash?: string;
  asset?: string;
  value?: number | string;
  category?: string;
  block_number?: string | number;
  timestamp?: string;
};

type GraphNode = {
  id: string;
  type?: string;
  hop?: number;
  is_target?: boolean;
  attribution?: {
    identified?: boolean;
    entity?: string | null;
    method?: string;
    confidence?: number | string | null;
    evidence?: string | null;
  };
  incoming_transfer_count?: number;
  outgoing_transfer_count?: number;
  total_transfer_count?: number;
  unique_counterparty_count?: number;
  intermediary_score?: number;
  flow_score?: number;
  chronological_activity?: number;
  incoming_connections?: number;
  outgoing_connections?: number;
  connection_count?: number;
};

type GraphEdge = {
  id: string;
  source: string;
  target: string;
  hash?: string;
  asset?: string;
  value?: number | string;
  category?: string;
  block_number?: string | number;
  timestamp?: string;
  hop?: number;
};

type FlowPath = {
  path?: string[];
  hops?: number;
  transactions?: string[];
  assets?: string[];
  timestamps?: string[];
  values?: (number | string)[];
  flow_classification?: string;
  continuity_score?: number;
};

type EvidenceTransaction = {
  from?: string;
  to?: string;
  hash?: string;
  asset?: string;
  value?: number | string;
  category?: string;
  block_number?: string | number;
  timestamp?: string;
  attribution?: unknown;
};

type EvidenceChain = {
  path?: string[];
  hops?: number;
  transactions?: EvidenceTransaction[];
  flow_classification?: string;
  continuity_score?: number;
  asset_match?: boolean;
  value_ratio?: number;
};

type VaspEntity = {
  name?: string | null;
  type?: string | null;
  label?: string | null;
  address?: string | null;
  network?: string | null;
  category?: string | null;
};

type Vasp = {
  address?: string;
  attribution?: {
    identified?: boolean;
    entity?: VaspEntity | null;
    method?: string;
    confidence?: number | string | null;
    evidence?: string | null;
  };
  flow_score?: number;
  hop?: number;
  incoming_transfer_count?: number;
  outgoing_transfer_count?: number;
  evidence_paths?: FlowPath[];
  evidence_transactions?: Transfer[];
};

type VaspCandidate = {
  address?: string;
  score?: number;
  level?: string;
  reasons?: string[];
  strong_flow_count?: number;
  partial_flow_count?: number;
  total_transfer_count?: number;
  unique_counterparty_count?: number;
  flow_score?: number;
  chronological_activity?: number;
  attribution?: unknown;
};

type GraphResult = {
  target_wallet: string;
  network: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  flow_paths: FlowPath[];
  evidence_chains: EvidenceChain[];
  identified_vasps: Vasp[];
  vasp_candidates: VaspCandidate[];
  statistics: {
    node_count?: number;
    edge_count?: number;
    direct_counterparty_count?: number;
    second_hop_count?: number;
    expanded_wallet_count?: number;
    max_hops?: number;
    intermediary_candidate_count?: number;
    flow_path_count?: number;
    vasp_candidate_count?: number;
  };
  direct_counterparties?: string[];
  second_hop_wallets?: string[];
  intermediary_candidates?: GraphNode[];
};

type SecurityResult = {
  indicators?: Record<string, string | number | boolean | null>;
  positive_flags?: string[];
  flag_count?: number;
};

type RiskResult = {
  risk_score: number;
  risk_level: string;
  reasons: string[];
};

type AnomalyResult = {
  anomaly_score?: number;
  is_anomaly?: boolean;
  model?: string;
  interpretation?: string;
};

type BlockchainResult = {
  transfer_count?: number;
  unique_addresses?: number;
  unique_counterparties?: number;
  asset_count?: number;
  assets?: string[];
  categories?: Record<string, number>;
  incoming_count?: number;
  outgoing_count?: number;
  incoming_ratio?: number;
  outgoing_ratio?: number;
  activity_span_days?: number;
  active_day_count?: number;
  transaction_frequency?: number;
  repeated_counterparty_count?: number;
  maximum_counterparty_transactions?: number;
  security_flag_count?: number;
  transfers?: Transfer[];
};

type InvestigationResult = {
  status?: string;
  target_wallet?: string;
  network?: string;
  tracing?: unknown;
  identified_vasp_count?: number;
  evidence_transaction_count?: number;
  evidence_chains?: EvidenceChain[];
  vasps?: Vasp[];
  key_findings?: string[];
  confidence?: string;
  report?: string | Record<string, unknown>;
  risk_score?: number;
  risk_level?: string;
};

type AnalysisResult = {
  wallet: string;
  network?: string;
  blockchain?: BlockchainResult;
  security?: SecurityResult;
  risk?: RiskResult;
  anomaly?: AnomalyResult;
  graph?: GraphResult;
  investigation?: InvestigationResult;
  case?: {
    case_id?: string;
    created_at?: string;
    updated_at?: string;
    status?: string;
    target?: {
      wallet?: string;
      network?: string;
    };
    risk?: {
      score?: number;
      level?: string;
    };
  };
};

const SECURITY_INDICATORS = [
  ["Cybercrime", "cybercrime"],
  ["Money laundering", "money_laundering"],
  ["Phishing", "phishing"],
  ["Stealing attack", "stealing_attack"],
  ["Blackmail", "blackmail"],
  ["Sanctions", "sanctioned"],
  ["Mixer", "mixer"],
  ["Darkweb", "darkweb"],
  ["Financial crime", "financial_crime"],
  ["Fake token", "fake_token"],
  ["Honeypot", "honeypot"],
  ["Gas abuse", "gas_abuse"],
  ["Malicious mining", "malicious_mining"],
] as const;

function shortAddress(address?: string) {
  if (!address) return "Unknown";
  if (address.length <= 18) return address;
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

function formatScore(score?: number) {
  if (typeof score !== "number") return "—";
  return Math.round(score);
}

function formatPercent(value?: number) {
  if (typeof value !== "number") return "—";
  return `${Math.round(value * 100)}%`;
}

function formatNumber(value?: number) {
  if (typeof value !== "number") return "0";
  return value.toLocaleString();
}

function formatDate(value?: string) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function riskClass(level?: string) {
  switch (level?.toUpperCase()) {
    case "HIGH":
      return {
        text: "text-[var(--high)]",
        border: "border-[var(--high)]/30",
        bg: "bg-[var(--high)]/[0.06]",
        dot: "var(--high)",
      };
    case "MEDIUM":
      return {
        text: "text-[var(--medium)]",
        border: "border-[var(--medium)]/30",
        bg: "bg-[var(--medium)]/[0.06]",
        dot: "var(--medium)",
      };
    default:
      return {
        text: "text-[var(--low)]",
        border: "border-[var(--low)]/30",
        bg: "bg-[var(--low)]/[0.06]",
        dot: "var(--low)",
      };
  }
}

function classificationColor(classification?: string) {
  switch (classification?.toUpperCase()) {
    case "STRONG_FLOW":
      return "var(--low)";
    case "PARTIAL_FLOW":
      return "var(--medium)";
    case "WEAK_FLOW":
      return "var(--muted)";
    default:
      return "var(--cyan)";
  }
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.2em]"
        style={{ color: "var(--cyan)" }}
      >
        {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] sm:text-2xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-3xl text-sm leading-6 theme-muted">
          {description}
        </p>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description?: string;
}) {
  return (
    <div className="theme-surface rounded-2xl border theme-border p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-muted">
        {label}
      </p>

      <p className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs theme-muted">{description}</p>
      )}
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="theme-surface-2 rounded-2xl border theme-border p-8 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-xs leading-5 theme-muted">
        {description}
      </p>
    </div>
  );
}

function WalletGraph({ graph }: { graph: GraphResult }) {
  const graphData = useMemo(() => {
    const nodes =
      graph.nodes?.map((node) => ({
        id: node.id.toLowerCase(),
        label: node.is_target
          ? "TARGET"
          : node.attribution?.entity || shortAddress(node.id),
        isTarget: Boolean(node.is_target),
        identified: Boolean(node.attribution?.identified),
        hop: node.hop ?? 0,
      })) ?? [];

    const links =
      graph.edges?.map((edge, index) => ({
        id: edge.id || `${edge.hash || "edge"}-${index}`,
        source: String(edge.source).toLowerCase(),
        target: String(edge.target).toLowerCase(),
      })) ?? [];

    return { nodes, links };
  }, [graph]);

  if (!graphData.nodes.length) {
    return (
      <EmptyState
        title="No graph data available"
        description="The backend did not return relationship nodes for this investigation."
      />
    );
  }

  return (
    <div className="h-[520px] w-full">
      <ForceGraph
        graphData={graphData}
        nodeLabel="label"
        nodeRelSize={5}
        nodeVal={(node: any) => (node.isTarget ? 4 : 1.8)}
        linkWidth={1}
        linkColor={() => "var(--border)"}
        backgroundColor="var(--background)"
        enableZoomInteraction
        enablePanInteraction
        cooldownTicks={80}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const radius = node.isTarget ? 8 : node.identified ? 6 : 4;

          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);

          ctx.fillStyle = node.isTarget
            ? "var(--cyan)"
            : node.identified
              ? "var(--high)"
              : "var(--muted)";

          ctx.fill();

          if (node.isTarget || node.identified || globalScale > 2.2) {
            const label = node.label;

            ctx.font = `${Math.max(8 / globalScale, 3)}px Arial`;
            ctx.fillStyle = "var(--foreground)";
            ctx.textAlign = "center";

            ctx.fillText(
              label,
              node.x,
              node.y + radius + 9
            );
          }
        }}
      />
    </div>
  );
}

export default function AnalyzePage() {
  const [wallet, setWallet] = useState("");
  const [network, setNetwork] = useState<Network>("ethereum");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("stocometer-theme");
    document.documentElement.classList.toggle(
      "light",
      savedTheme === "light"
    );
  }, []);

  const handleAnalyze = async () => {
    if (!wallet.trim()) {
      setError("Please enter a wallet address.");
      return;
    }

    setError("");
    setAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet: wallet.trim(),
          network,
        }),
      });

      let data: any;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The STOCOMETER backend returned an invalid response."
        );
      }

      if (!response.ok) {
        const message =
          data?.error?.message ||
          data?.detail?.message ||
          (typeof data?.detail === "string" ? data.detail : null) ||
          "Wallet analysis failed.";

        throw new Error(message);
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
    <main className="theme-background theme-text min-h-screen">
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

              
            </div>
          </Link>

          <div className="flex items-center gap-5">
            <Link
              href="/analyze/cross-chain"
              className="hidden text-sm theme-muted hover:theme-text sm:block"
            >
              Cross-chain
            </Link>

            <Link
              href="/"
              className="text-sm theme-muted transition hover:text-[var(--foreground)]"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--cyan)" }}
          >
            New investigation
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Analyze a wallet.
          </h1>

          <p className="mt-5 text-sm leading-7 theme-muted sm:text-base">
            Trace blockchain activity, inspect security signals,
            identify possible VASP connections, and turn the
            results into investigation evidence.
          </p>
        </div>

        <div className="theme-surface mt-12 rounded-3xl border theme-border p-5 shadow-sm sm:p-7">
          <div className="grid gap-5 md:grid-cols-[1fr_190px]">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-muted">
                Wallet address
              </label>

              <div className="mt-2 flex h-14 items-center rounded-xl border theme-border theme-surface-2 px-4 focus-within:border-[var(--cyan)]">
                <span className="mr-3 text-sm theme-muted">#</span>

                <input
                  value={wallet}
                  onChange={(event) => {
                    setWallet(event.target.value);
                    setError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleAnalyze();
                    }
                  }}
                  placeholder={
                    network === "solana"
                      ? "Enter Solana wallet address..."
                      : "Enter wallet address..."
                  }
                  className="h-full w-full bg-transparent font-mono text-xs outline-none placeholder:text-[var(--muted)] sm:text-sm"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-muted">
                Network
              </label>

              <select
                value={network}
                onChange={(event) =>
                  setNetwork(event.target.value as Network)
                }
                className="theme-surface-2 theme-text mt-2 h-14 w-full rounded-xl border theme-border px-4 text-sm outline-none"
              >
                {NETWORKS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-[var(--high)]/25 bg-[var(--high)]/[0.05] px-4 py-3 text-xs text-[var(--high)]">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing}
            className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
            style={{
              background: "var(--foreground)",
              color: "var(--background)",
            }}
          >
            {analyzing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Running investigation...
              </>
            ) : (
              <>
                Analyze wallet
                <span>→</span>
              </>
            )}
          </button>

          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.12em] theme-muted">
            <span>Multi-chain</span>
            <span>Security intelligence</span>
            <span>Behavioral analysis</span>
            <span>VASP attribution</span>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            ["01", "Trace", "Follow wallet relationships."],
            ["02", "Check", "Inspect security and behavior."],
            ["03", "Explain", "Understand the resulting evidence."],
          ].map(([number, title, description]) => (
            <div
              key={number}
              className="theme-surface rounded-2xl border theme-border p-5"
            >
              <span
                className="font-mono text-xs"
                style={{ color: "var(--cyan)" }}
              >
                {number}
              </span>

              <h3 className="mt-7 text-sm font-semibold">
                {title}
              </h3>

              <p className="mt-2 text-xs leading-5 theme-muted">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function RiskDashboard({
  result,
  onReset,
}: {
  result: AnalysisResult;
  onReset: () => void;
}) {
  const risk = result.risk;
  const security = result.security;
  const graph = result.graph;
  const investigation = result.investigation;
  const anomaly = result.anomaly;
  const caseData = result.case;
  const blockchain = result.blockchain;

  const level =
    risk?.risk_level ||
    investigation?.risk_level ||
    caseData?.risk?.level ||
    "LOW";

  const score =
    risk?.risk_score ??
    investigation?.risk_score ??
    caseData?.risk?.score ??
    0;

  const styles = riskClass(level);

  const identifiedVasps =
    graph?.identified_vasps ||
    investigation?.vasps ||
    [];

  const candidates = graph?.vasp_candidates || [];

  const evidenceChains =
    graph?.evidence_chains ||
    investigation?.evidence_chains ||
    [];

  const flowPaths = graph?.flow_paths || [];

  const evidenceTransactions = useMemo(() => {
    const seen = new Set<string>();
    const transactions: EvidenceTransaction[] = [];

    for (const chain of evidenceChains) {
      for (const tx of chain.transactions || []) {
        const key =
          tx.hash ||
          `${tx.from}-${tx.to}-${tx.timestamp}-${tx.value}`;

        if (!seen.has(key)) {
          seen.add(key);
          transactions.push(tx);
        }
      }
    }

    for (const vasp of identifiedVasps) {
      for (const tx of vasp.evidence_transactions || []) {
        const key =
          tx.hash ||
          `${tx.from}-${tx.to}-${tx.timestamp}-${tx.value}`;

        if (!seen.has(key)) {
          seen.add(key);
          transactions.push(tx);
        }
      }
    }

    return transactions;
  }, [evidenceChains, identifiedVasps]);

  return (
    <main className="theme-background theme-text min-h-screen">
      <header className="sticky top-0 z-30 border-b theme-border backdrop-blur-xl">
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{
            background:
              "color-mix(in srgb, var(--background) 92%, transparent)",
          }}
        />

        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-3"
          >
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

            <span className="hidden text-sm font-semibold tracking-[0.08em] sm:block">
              STOCOMETER
            </span>
          </button>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="font-mono text-[10px] theme-muted">
                {caseData?.case_id || "INVESTIGATION"}
              </p>

              <p className="text-[9px] uppercase tracking-[0.12em] theme-muted">
                {result.network || investigation?.network}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/analyze/cross-chain"
                className="hidden rounded-full border theme-border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition hover:bg-[var(--surface-2)] sm:block"
              >
                Cross-chain
              </Link>

              <button
                type="button"
                onClick={onReset}
                className="rounded-full border theme-border px-4 py-2 text-xs font-medium transition hover:bg-[var(--surface-2)]"
              >
                New analysis
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="min-w-0">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--cyan)" }}
            >
              Investigation complete
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Wallet investigation
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border theme-border px-3 py-1 text-[10px] uppercase tracking-[0.12em] theme-muted">
                {result.network ||
                  investigation?.network ||
                  "Unknown network"}
              </span>

              {caseData?.status && (
                <span className="rounded-full border border-[var(--low)]/30 bg-[var(--low)]/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--low)]">
                  {caseData.status}
                </span>
              )}

              {caseData?.case_id && (
                <span className="rounded-full border theme-border px-3 py-1 font-mono text-[10px] theme-muted">
                  {caseData.case_id}
                </span>
              )}
            </div>

            <p className="mt-4 break-all font-mono text-xs theme-muted">
              {result.wallet}
            </p>
          </div>

          <div
            className={`flex w-fit items-center gap-2 rounded-full border px-3 py-2 ${styles.border} ${styles.bg}`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: styles.dot }}
            />

            <span
              className={`text-xs font-semibold uppercase tracking-[0.12em] ${styles.text}`}
            >
              {level} risk
            </span>
          </div>
        </div>

        {/* Risk overview */}
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div
            className={`theme-surface rounded-3xl border p-7 sm:p-9 ${styles.border}`}
          >
            <div className="flex flex-col items-center text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] theme-muted">
                Risk score
              </p>

              <div className="relative mt-7 flex h-48 w-48 items-center justify-center">
                <div className="absolute inset-0 rounded-full border theme-border" />

                <div
                  className="absolute inset-4 rounded-full border"
                  style={{ borderColor: "var(--border)" }}
                />

                <div
                  className="absolute inset-8 rounded-full border"
                  style={{ borderColor: styles.dot }}
                />

                <div>
                  <p
                    className={`text-6xl font-semibold tracking-[-0.06em] ${styles.text}`}
                  >
                    {formatScore(score)}
                  </p>

                  <p
                    className={`mt-1 text-[10px] font-bold uppercase tracking-[0.2em] ${styles.text}`}
                  >
                    {level}
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-md text-xs leading-6 theme-muted">
                Informational risk score based on blockchain,
                security, and behavioral signals. It is not a
                probability of fraud and does not independently
                establish criminal activity.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <MetricCard
              label="Transfers analyzed"
              value={formatNumber(blockchain?.transfer_count)}
              description="Current blockchain scan"
            />

            <MetricCard
              label="Connected addresses"
              value={formatNumber(blockchain?.unique_addresses)}
              description="Unique addresses observed"
            />

            <MetricCard
              label="Security flags"
              value={security?.flag_count ?? 0}
              description={
                security?.flag_count
                  ? "Positive indicators detected"
                  : "No positive indicators detected"
              }
            />

            <MetricCard
              label="Evidence chains"
              value={evidenceChains.length}
              description="Generated investigation paths"
            />
          </div>
        </div>

        {/* Investigation confidence */}
        <section className="theme-surface mt-4 rounded-3xl border theme-border p-7 sm:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <SectionTitle
              eyebrow="Investigation confidence"
              title="Evidence confidence"
              description="Confidence reflects the investigation evidence returned by the backend. It does not establish criminal activity or ownership."
            />

            <div
              className="flex w-fit items-center gap-3 rounded-2xl border px-5 py-4"
              style={{
                borderColor:
                  investigation?.confidence?.toLowerCase() === "high"
                    ? "var(--low)"
                    : investigation?.confidence?.toLowerCase() === "medium"
                      ? "var(--medium)"
                      : "var(--border)",
              }}
            >
              <span className="text-xs uppercase tracking-[0.14em] theme-muted">
                Confidence
              </span>

              <span className="text-lg font-semibold uppercase">
                {investigation?.confidence || "—"}
              </span>
            </div>
          </div>
        </section>

        {/* Behavioral intelligence */}
        {anomaly && (
          <section className="theme-surface mt-4 rounded-3xl border theme-border p-7 sm:p-8">
            <SectionTitle
              eyebrow="Behavioral intelligence"
              title="Wallet activity pattern"
              description="Anomaly detection adds behavioral context to the security analysis."
            />

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="Anomaly score"
                value={formatScore(anomaly.anomaly_score)}
                description="Behavioral deviation signal"
              />

              <MetricCard
                label="Model result"
                value={
                  anomaly.is_anomaly
                    ? "ANOMALY"
                    : "NORMAL"
                }
                description={anomaly.model || "Isolation Forest"}
              />

              <div className="theme-surface-2 rounded-2xl border theme-border p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-muted">
                  Interpretation
                </p>

                <p className="mt-4 text-sm leading-6">
                  {anomaly.interpretation ||
                    "No additional interpretation returned."}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Blockchain activity */}
        <section className="theme-surface mt-4 rounded-3xl border theme-border p-7 sm:p-8">
          <SectionTitle
            eyebrow="Blockchain activity"
            title="Asset and transaction activity"
            description="Behavioral and transactional statistics calculated from the current network scan."
          />

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Assets"
              value={formatNumber(blockchain?.asset_count)}
              description={
                blockchain?.assets?.length
                  ? blockchain.assets.join(", ")
                  : "Assets observed"
              }
            />

            <MetricCard
              label="Incoming"
              value={formatNumber(blockchain?.incoming_count)}
              description={
                typeof blockchain?.incoming_ratio === "number"
                  ? `${formatPercent(blockchain.incoming_ratio)} of transfers`
                  : "Incoming transfers"
              }
            />

            <MetricCard
              label="Outgoing"
              value={formatNumber(blockchain?.outgoing_count)}
              description={
                typeof blockchain?.outgoing_ratio === "number"
                  ? `${formatPercent(blockchain.outgoing_ratio)} of transfers`
                  : "Outgoing transfers"
              }
            />

            <MetricCard
              label="Active days"
              value={formatNumber(blockchain?.active_day_count)}
              description={
                typeof blockchain?.activity_span_days === "number"
                  ? `${blockchain.activity_span_days.toFixed(1)} day span`
                  : "Observed activity"
              }
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Counterparties"
              value={formatNumber(blockchain?.unique_counterparties)}
              description="Unique transaction relationships"
            />

            <MetricCard
              label="Transaction frequency"
              value={
                typeof blockchain?.transaction_frequency === "number"
                  ? blockchain.transaction_frequency.toFixed(2)
                  : "0"
              }
              description="Observed activity rate"
            />

            <MetricCard
              label="Repeated counterparties"
              value={formatNumber(blockchain?.repeated_counterparty_count)}
              description="Repeated relationship signals"
            />

            <MetricCard
              label="Max counterpart transactions"
              value={formatNumber(
                blockchain?.maximum_counterparty_transactions
              )}
              description="Highest observed concentration"
            />
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold">
                Assets observed
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {blockchain?.assets?.length ? (
                  blockchain.assets.map((asset) => (
                    <span
                      key={asset}
                      className="rounded-full border theme-border px-3 py-1.5 font-mono text-[10px] theme-muted"
                    >
                      {asset}
                    </span>
                  ))
                ) : (
                  <span className="text-xs theme-muted">
                    No asset list returned.
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold">
                Transaction categories
              </p>

              <div className="mt-3 space-y-2">
                {blockchain?.categories &&
                Object.keys(blockchain.categories).length ? (
                  Object.entries(blockchain.categories).map(
                    ([category, count]) => (
                      <div
                        key={category}
                        className="theme-surface-2 flex items-center justify-between rounded-xl border theme-border px-4 py-3"
                      >
                        <span className="text-xs theme-muted">
                          {category}
                        </span>

                        <span className="font-mono text-xs">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-xs theme-muted">
                    No category breakdown returned.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="theme-surface mt-4 rounded-3xl border theme-border p-7 sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionTitle
              eyebrow="Security intelligence"
              title="Security indicators"
              description="Security intelligence returned by the current address-security analysis."
            />

            <div
              className={`rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                security?.flag_count
                  ? "border-[var(--high)]/30 bg-[var(--high)]/[0.05] text-[var(--high)]"
                  : "border-[var(--low)]/30 bg-[var(--low)]/[0.05] text-[var(--low)]"
              }`}
            >
              {security?.flag_count
                ? `${security.flag_count} positive flag${
                    security.flag_count === 1 ? "" : "s"
                  }`
                : "No positive flags"}
            </div>
          </div>

          <div className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SECURITY_INDICATORS.map(([label, key]) => {
              const raw = security?.indicators?.[key];
              const detected =
                raw === "1" ||
                raw === 1 ||
                raw === true;

              return (
                <div
                  key={key}
                  className="theme-surface-2 flex items-center justify-between rounded-xl border theme-border px-4 py-3"
                >
                  <span className="text-xs theme-muted">
                    {label}
                  </span>

                  <span
                    className={`flex items-center gap-2 text-[10px] font-semibold ${
                      detected
                        ? "text-[var(--high)]"
                        : "text-[var(--low)]"
                    }`}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: detected
                          ? "var(--high)"
                          : "var(--low)",
                      }}
                    />

                    {detected ? "DETECTED" : "CLEAR"}
                  </span>
                </div>
              );
            })}
          </div>

          {security?.positive_flags?.length ? (
            <div className="mt-7 rounded-2xl border border-[var(--high)]/25 bg-[var(--high)]/[0.04] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--high)]">
                Positive security flags
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {security.positive_flags.map((flag) => (
                  <span
                    key={flag}
                    className="rounded-full border border-[var(--high)]/25 px-3 py-1.5 text-xs text-[var(--high)]"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-[var(--low)]/25 bg-[var(--low)]/[0.04] p-5">
              <p className="text-sm font-medium text-[var(--low)]">
                No positive security flags detected.
              </p>

              <p className="mt-1 text-xs leading-5 theme-muted">
                No major security indicators were returned by
                the current security analysis.
              </p>
            </div>
          )}
        </section>

        {/* Risk reasoning */}
        <section className="theme-surface mt-4 rounded-3xl border theme-border p-7 sm:p-8">
          <SectionTitle
            eyebrow="Risk reasoning"
            title="Why this score?"
          />

          <div className="mt-7 space-y-3">
            {risk?.reasons?.length ? (
              risk.reasons.map((reason, index) => (
                <div
                  key={`${reason}-${index}`}
                  className="theme-surface-2 flex items-start gap-3 rounded-xl border theme-border p-4"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px]"
                    style={{
                      borderColor: "var(--cyan)",
                      color: "var(--cyan)",
                    }}
                  >
                    {index + 1}
                  </span>

                  <span className="text-xs leading-5 theme-muted">
                    {reason}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState
                title="No score reasons returned"
                description="The backend did not provide additional risk reasoning."
              />
            )}
          </div>
        </section>

        {/* Graph */}
        <section className="theme-surface mt-4 rounded-3xl border theme-border p-7 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionTitle
              eyebrow="Blockchain tracing"
              title="Transaction relationship graph"
              description="Backend-generated wallet relationships and multi-hop tracing."
            />

            {graph?.statistics && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                <MiniMetric
                  label="Nodes"
                  value={graph.statistics.node_count}
                />

                <MiniMetric
                  label="Edges"
                  value={graph.statistics.edge_count}
                />

                <MiniMetric
                  label="Hops"
                  value={graph.statistics.max_hops}
                />

                <MiniMetric
                  label="Expanded"
                  value={graph.statistics.expanded_wallet_count}
                />
              </div>
            )}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border theme-border">
            {graph ? (
              <WalletGraph graph={graph} />
            ) : (
              <EmptyState
                title="Graph unavailable"
                description="No backend graph was returned for this investigation."
              />
            )}
          </div>

          {graph?.statistics && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Direct counterparties"
                value={formatNumber(
                  graph.statistics.direct_counterparty_count
                )}
                description="First-hop relationships"
              />

              <MetricCard
                label="Second-hop wallets"
                value={formatNumber(
                  graph.statistics.second_hop_count
                )}
                description="Discovered at hop two"
              />

              <MetricCard
                label="Intermediary candidates"
                value={formatNumber(
                  graph.statistics.intermediary_candidate_count
                )}
                description="Flow-based candidates"
              />

              <MetricCard
                label="VASP candidates"
                value={formatNumber(
                  graph.statistics.vasp_candidate_count
                )}
                description="Candidate service providers"
              />
            </div>
          )}
        </section>

        {/* Intermediaries */}
        {graph?.intermediary_candidates?.length ? (
          <section className="theme-surface mt-4 rounded-3xl border theme-border p-7 sm:p-8">
            <SectionTitle
              eyebrow="Flow intelligence"
              title="Intermediary candidates"
              description="Wallets whose transaction behavior suggests an intermediary role in the observed graph."
            />

            <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {graph.intermediary_candidates
                .slice(0, 12)
                .map((node, index) => (
                  <div
                    key={`${node.id}-${index}`}
                    className="theme-surface-2 rounded-2xl border theme-border p-5"
                  >
                    <p className="break-all font-mono text-xs">
                      {shortAddress(node.id)}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <MiniMetric
                        label="Flow"
                        value={formatScore(node.flow_score)}
                      />

                      <MiniMetric
                        label="Transfers"
                        value={node.total_transfer_count}
                      />
                    </div>

                    <p className="mt-4 text-[10px] theme-muted">
                      {node.unique_counterparty_count ?? 0} unique
                      counterparties ·{" "}
                      {node.connection_count ?? 0} connections
                    </p>
                  </div>
                ))}
            </div>
          </section>
        ) : null}

        {/* Flow paths */}
        <section className="theme-surface mt-4 rounded-3xl border theme-border p-7 sm:p-8">
          <SectionTitle
            eyebrow="Flow analysis"
            title="Transaction flow paths"
            description="Chronological paths generated by the graph engine. Strong or partial flow indicates analytical continuity, not proof of common ownership or the exact same funds."
          />

          {flowPaths.length ? (
            <div className="mt-7 space-y-3">
              {flowPaths.slice(0, 12).map((path, index) => (
                <div
                  key={`flow-${index}`}
                  className="theme-surface-2 rounded-2xl border theme-border p-5"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
                        style={{
                          background: "var(--cyan)",
                          color: "var(--background)",
                        }}
                      >
                        {index + 1}
                      </span>

                      <div>
                        <p
                          className="text-xs font-semibold uppercase"
                          style={{
                            color: classificationColor(
                              path.flow_classification
                            ),
                          }}
                        >
                          {(
                            path.flow_classification || "FLOW"
                          ).replaceAll("_", " ")}
                        </p>

                        <p className="mt-1 text-[10px] theme-muted">
                          {path.hops ?? 0} hop
                          {(path.hops ?? 0) === 1 ? "" : "s"}
                          {" · "}
                          continuity{" "}
                          {formatPercent(path.continuity_score)}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] theme-muted">
                      {path.transactions?.length ?? 0} transaction
                      {(path.transactions?.length ?? 0) === 1
                        ? ""
                        : "s"}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {path.path?.map((address, pathIndex) => (
                      <div
                        key={`${address}-${pathIndex}`}
                        className="flex items-center gap-2"
                      >
                        <span className="rounded-lg border theme-border px-2.5 py-1.5 font-mono text-[9px] theme-muted">
                          {shortAddress(address)}
                        </span>

                        {pathIndex <
                          (path.path?.length || 0) - 1 && (
                          <span
                            className="text-xs"
                            style={{ color: "var(--cyan)" }}
                          >
                            →
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {path.assets?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {path.assets.map((asset, assetIndex) => (
                        <span
                          key={`${asset}-${assetIndex}`}
                          className="rounded-full border theme-border px-2.5 py-1 font-mono text-[9px] theme-muted"
                        >
                          {asset}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title="No flow paths returned"
                description="The graph engine did not produce flow paths for this investigation."
              />
            </div>
          )}
        </section>

        {/* VASP attribution */}
        <section className="theme-surface mt-4 rounded-3xl border theme-border p-7 sm:p-8">
          <SectionTitle
            eyebrow="VASP intelligence"
            title="Possible service-provider connections"
            description="Known-address attribution and candidate detection are presented separately from the wallet risk score."
          />

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold">
                  Identified VASPs
                </p>

                <span className="font-mono text-[10px] theme-muted">
                  {identifiedVasps.length}
                </span>
              </div>

              {identifiedVasps.length ? (
                <div className="space-y-3">
                  {identifiedVasps.map((vasp, index) => (
                    <VaspCard
                      key={`${vasp.address}-${index}`}
                      vasp={vasp}
                      identified
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No verified VASP attribution"
                  description="No known VASP address was identified in the returned graph."
                />
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold">
                  VASP candidates
                </p>

                <span className="font-mono text-[10px] theme-muted">
                  {candidates.length}
                </span>
              </div>

              {candidates.length ? (
                <div className="space-y-3">
                  {candidates.slice(0, 8).map(
                    (candidate, index) => (
                      <CandidateCard
                        key={`${candidate.address}-${index}`}
                        candidate={candidate}
                      />
                    )
                  )}
                </div>
              ) : (
                <EmptyState
                  title="No strong candidates"
                  description="The graph did not produce a candidate meeting the current detection thresholds."
                />
              )}
            </div>
          </div>
        </section>

        {/* Evidence chains */}
        <section className="theme-surface mt-4 rounded-3xl border theme-border p-7 sm:p-8">
          <SectionTitle
            eyebrow="Investigation evidence"
            title="Evidence chains"
            description="Chronological transaction paths used to explain movement through the graph."
          />

          {evidenceChains.length ? (
            <div className="mt-7 space-y-3">
              {evidenceChains.slice(0, 12).map(
                (chain, index) => (
                  <EvidenceCard
                    key={`evidence-${index}`}
                    chain={chain}
                    index={index}
                  />
                )
              )}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title="No evidence chains returned"
                description="The investigation did not produce evidence paths for display."
              />
            </div>
          )}
        </section>

        {/* Evidence transactions */}
        <section className="theme-surface mt-4 rounded-3xl border theme-border p-7 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionTitle
              eyebrow="Evidence transactions"
              title="Underlying transaction records"
              description="Transactions associated with the evidence chains and identified VASP evidence."
            />

            <span className="font-mono text-xs theme-muted">
              {evidenceTransactions.length} records
            </span>
          </div>

          {evidenceTransactions.length ? (
            <div className="mt-7 overflow-x-auto rounded-2xl border theme-border">
              <table className="w-full min-w-[760px] text-left">
                <thead className="border-b theme-border theme-surface-2">
                  <tr>
                    <th className="px-4 py-3 text-[9px] uppercase tracking-[0.12em] theme-muted">
                      Transaction
                    </th>
                    <th className="px-4 py-3 text-[9px] uppercase tracking-[0.12em] theme-muted">
                      From
                    </th>
                    <th className="px-4 py-3 text-[9px] uppercase tracking-[0.12em] theme-muted">
                      To
                    </th>
                    <th className="px-4 py-3 text-[9px] uppercase tracking-[0.12em] theme-muted">
                      Asset
                    </th>
                    <th className="px-4 py-3 text-[9px] uppercase tracking-[0.12em] theme-muted">
                      Value
                    </th>
                    <th className="px-4 py-3 text-[9px] uppercase tracking-[0.12em] theme-muted">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {evidenceTransactions.slice(0, 30).map(
                    (tx, index) => (
                      <tr
                        key={`${tx.hash || "tx"}-${index}`}
                        className="border-b theme-border last:border-b-0"
                      >
                        <td className="px-4 py-4">
                          <span className="font-mono text-[10px] theme-muted">
                            {shortAddress(tx.hash)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="font-mono text-[10px]">
                            {shortAddress(tx.from)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="font-mono text-[10px]">
                            {shortAddress(tx.to)}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-xs theme-muted">
                          {tx.asset || "—"}
                        </td>

                        <td className="px-4 py-4 font-mono text-xs">
                          {tx.value ?? "—"}
                        </td>

                        <td className="px-4 py-4 text-[10px] theme-muted">
                          {formatDate(tx.timestamp)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title="No evidence transactions returned"
                description="The backend did not return transaction-level evidence records for this investigation."
              />
            </div>
          )}
        </section>

        {/* Key findings */}
        <section className="theme-surface mt-4 rounded-3xl border theme-border p-7 sm:p-8">
          <SectionTitle
            eyebrow="Investigator summary"
            title="Key findings"
          />

          <div className="mt-7">
            {investigation?.key_findings?.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {investigation.key_findings.map(
                  (finding, index) => (
                    <div
                      key={`${finding}-${index}`}
                      className="theme-surface-2 rounded-2xl border theme-border p-5"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: "var(--cyan)",
                            color: "var(--background)",
                          }}
                        >
                          {index + 1}
                        </span>

                        <p className="text-sm leading-6 theme-muted">
                          {finding}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <EmptyState
                title="No findings returned"
                description="The investigation completed without additional summary findings."
              />
            )}
          </div>
        </section>

        {/* Report */}
        {investigation?.report && (
          <section className="theme-surface mt-4 rounded-3xl border theme-border p-7 sm:p-8">
            <SectionTitle
              eyebrow="Investigation report"
              title="Standardized investigation output"
              description="The report generated by the backend investigation workflow."
            />

            <div className="theme-surface-2 mt-7 rounded-2xl border theme-border p-6">
              {typeof investigation.report === "string" ? (
                <pre className="whitespace-pre-wrap font-sans text-sm leading-7 theme-muted">
                  {investigation.report}
                </pre>
              ) : (
                <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 theme-muted">
                  {JSON.stringify(
                    investigation.report,
                    null,
                    2
                  )}
                </pre>
              )}
            </div>
          </section>
        )}

        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border theme-border theme-surface p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--cyan)" }}
              >
                Need more coverage?
              </p>
              <p className="mt-2 text-sm font-semibold">
                Investigate the wallet across multiple networks.
              </p>
              <p className="mt-1 text-xs leading-5 theme-muted">
                Use STOCOMETER's separate cross-chain workspace to compare
                activity across Ethereum, Polygon, Base, Arbitrum, and Solana.
              </p>
            </div>

            <Link
              href="/analyze/cross-chain"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border theme-border px-4 py-3 text-xs font-semibold transition hover:bg-[var(--surface-2)]"
            >
              Open cross-chain
              <span style={{ color: "var(--cyan)" }}>→</span>
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10 text-center">
          <p className="text-[10px] leading-5 theme-muted">
            STOCOMETER provides informational blockchain risk
            intelligence based on available transaction,
            behavioral, and security signals. Risk scores and
            attribution findings do not independently establish
            criminal activity, ownership, or fraud.
          </p>
        </div>
      </section>
    </main>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value?: number | string;
}) {
  return (
    <div className="theme-surface-2 rounded-xl border theme-border px-3 py-2 text-center">
      <p className="font-mono text-sm">{value ?? 0}</p>

      <p className="mt-0.5 text-[8px] uppercase tracking-[0.12em] theme-muted">
        {label}
      </p>
    </div>
  );
}

function VaspCard({
  vasp,
  identified,
}: {
  vasp: Vasp;
  identified?: boolean;
}) {
  const entity =
  vasp.attribution?.entity?.name ||
  vasp.attribution?.entity?.label ||
  "Known VASP";

  return (
    <div className="theme-surface-2 rounded-2xl border theme-border p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {entity}
          </p>

          <p className="mt-1 break-all font-mono text-[10px] theme-muted">
            {vasp.address}
          </p>
        </div>

        <span
          className="shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase"
          style={{
            borderColor: "var(--low)",
            color: "var(--low)",
          }}
        >
          {identified ? "Identified" : "Candidate"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <MiniMetric
          label="Flow"
          value={
            typeof vasp.flow_score === "number"
              ? Math.round(vasp.flow_score)
              : 0
          }
        />

        <MiniMetric
          label="Incoming"
          value={vasp.incoming_transfer_count}
        />

        <MiniMetric
          label="Outgoing"
          value={vasp.outgoing_transfer_count}
        />
      </div>

      {vasp.attribution?.confidence != null && (
        <p className="mt-4 text-[10px] theme-muted">
          Attribution confidence:{" "}
          <span className="theme-text">
            {vasp.attribution.confidence}
          </span>
        </p>
      )}
    </div>
  );
}

function CandidateCard({
  candidate,
}: {
  candidate: VaspCandidate;
}) {
  const level =
    candidate.level?.toUpperCase() || "LOW";

  const color =
    level === "HIGH"
      ? "var(--high)"
      : level === "MEDIUM"
        ? "var(--medium)"
        : "var(--muted)";

  return (
    <div className="theme-surface-2 rounded-2xl border theme-border p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="break-all font-mono text-xs">
            {candidate.address}
          </p>

          <p className="mt-1 text-[10px] theme-muted">
            {candidate.total_transfer_count ?? 0} transfers
            {" · "}
            {candidate.unique_counterparty_count ?? 0} counterparties
          </p>
        </div>

        <span
          className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.12em]"
          style={{ color }}
        >
          {level}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <MiniMetric
          label="Score"
          value={candidate.score}
        />

        <MiniMetric
          label="Strong"
          value={candidate.strong_flow_count}
        />

        <MiniMetric
          label="Partial"
          value={candidate.partial_flow_count}
        />
      </div>

      {candidate.reasons?.length ? (
        <div className="mt-4 space-y-1">
          {candidate.reasons.slice(0, 4).map(
            (reason, index) => (
              <p
                key={`${reason}-${index}`}
                className="text-[10px] leading-5 theme-muted"
              >
                • {reason}
              </p>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}

function EvidenceCard({
  chain,
  index,
}: {
  chain: EvidenceChain;
  index: number;
}) {
  const classification =
    chain.flow_classification || "FLOW";

  return (
    <div className="theme-surface-2 rounded-2xl border theme-border p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
            style={{
              background: "var(--cyan)",
              color: "var(--background)",
            }}
          >
            {index + 1}
          </span>

          <div>
            <p
              className="text-xs font-semibold uppercase"
              style={{
                color: classificationColor(
                  classification
                ),
              }}
            >
              {classification.replaceAll("_", " ")}
            </p>

            <p className="mt-1 text-[10px] theme-muted">
              {chain.hops ?? 0} hop
              {(chain.hops ?? 0) === 1 ? "" : "s"}
              {" · "}
              continuity{" "}
              {formatPercent(chain.continuity_score)}
            </p>
          </div>
        </div>

        {typeof chain.value_ratio === "number" && (
          <span className="font-mono text-[10px] theme-muted">
            value ratio {chain.value_ratio.toFixed(2)}
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {chain.path?.map((address, pathIndex) => (
          <div
            key={`${address}-${pathIndex}`}
            className="flex items-center gap-2"
          >
            <span className="rounded-lg border theme-border px-2.5 py-1.5 font-mono text-[9px] theme-muted">
              {shortAddress(address)}
            </span>

            {pathIndex <
              (chain.path?.length || 0) - 1 && (
              <span
                className="text-xs"
                style={{ color: "var(--cyan)" }}
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>

      {chain.asset_match !== undefined && (
        <div className="mt-4 text-[10px] theme-muted">
          Asset continuity:{" "}
          <span
            style={{
              color: chain.asset_match
                ? "var(--low)"
                : "var(--medium)",
            }}
          >
            {chain.asset_match
              ? "matched"
              : "different assets"}
          </span>
        </div>
      )}

      {chain.transactions?.length ? (
        <div className="mt-4 text-[10px] theme-muted">
          {chain.transactions.length} underlying transaction
          {chain.transactions.length === 1 ? "" : "s"}
        </div>
      ) : null}
    </div>
  );
}