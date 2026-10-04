import Link from "next/link";

const concepts = [
  {
    number: "01",
    title: "Wallet",
    text: "A wallet is an address used to send and receive assets on a blockchain. STOCOMETER uses the address as the starting point for an investigation.",
    symbol: "0x",
  },
  {
    number: "02",
    title: "Transaction",
    text: "A transaction records activity between blockchain addresses. Looking at many transactions together reveals patterns that a single transaction cannot.",
    symbol: "→",
  },
  {
    number: "03",
    title: "Counterparty",
    text: "A counterparty is another address that interacts with the wallet. Repeated or unusual relationships can become important investigation signals.",
    symbol: "↔",
  },
  {
    number: "04",
    title: "Asset",
    text: "Assets are the tokens or cryptocurrencies involved in transactions. STOCOMETER tracks the assets observed during the investigation.",
    symbol: "◇",
  },
];

const investigationLayers = [
  {
    number: "01",
    title: "Security signals",
    text: "Security intelligence checks for indicators such as phishing, cybercrime, sanctions, mixers, money laundering, and other suspicious activity.",
  },
  {
    number: "02",
    title: "Behavioral signals",
    text: "Wallet activity is analyzed for unusual patterns, including transaction frequency, counterparties, activity concentration, and other behavioral characteristics.",
  },
  {
    number: "03",
    title: "Risk assessment",
    text: "Multiple signals are combined into an informational risk score. The score helps prioritize investigation; it is not a probability of fraud.",
  },
  {
    number: "04",
    title: "Transaction graph",
    text: "Wallet relationships can be visualized across multiple hops, making direct counterparties, intermediaries, and connected addresses easier to inspect.",
  },
  {
    number: "05",
    title: "VASP intelligence",
    text: "Known service-provider addresses can be attributed, while other addresses can be surfaced as potential VASP candidates based on observed flow behavior.",
  },
  {
    number: "06",
    title: "Evidence",
    text: "Relevant transaction paths and records are organized into evidence chains that help explain how activity moved through the observed graph.",
  },
];

const terms = [
  {
    term: "VASP",
    description:
      "Virtual Asset Service Provider. In STOCOMETER, VASP intelligence helps identify known service-provider addresses and potential service-provider connections.",
  },
  {
    term: "Hop",
    description:
      "A hop represents a step between connected blockchain addresses. A direct transaction is one hop; tracing through another wallet creates additional hops.",
  },
  {
    term: "Flow path",
    description:
      "A chronological sequence of transactions connecting addresses in the investigation graph.",
  },
  {
    term: "Evidence chain",
    description:
      "A structured representation of relevant transactions and their relationships used to explain an observed flow.",
  },
  {
    term: "Anomaly",
    description:
      "A behavioral signal indicating that wallet activity differs from patterns in the model's baseline. It is an investigation signal, not proof of wrongdoing.",
  },
  {
    term: "Risk score",
    description:
      "STOCOMETER's informational assessment based on available blockchain, security, and behavioral signals. It should not be interpreted as a fraud probability.",
  },
];

export default function LearnPage() {
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

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <div className="max-w-3xl">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--cyan)" }}
          >
            01 / Learn
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">
            Understand the investigation.
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 theme-muted sm:text-base">
            You do not need to be a blockchain expert to understand
            what STOCOMETER is showing you. This guide explains the
            basic concepts behind wallet activity, risk signals,
            transaction flows, and investigation evidence.
          </p>
        </div>
      </section>

      {/* Core concepts */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--cyan)" }}
          >
            Start with the basics
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
            The building blocks
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-3xl border theme-border bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {concepts.map((concept) => (
            <article
              key={concept.number}
              className="theme-surface min-h-[300px] p-7"
            >
              <div className="flex items-start justify-between">
                <span
                  className="font-mono text-[10px]"
                  style={{ color: "var(--muted)" }}
                >
                  {concept.number}
                </span>

                <span
                  className="font-mono text-lg"
                  style={{ color: "var(--cyan)" }}
                >
                  {concept.symbol}
                </span>
              </div>

              <h3 className="mt-16 text-2xl font-semibold tracking-[-0.03em]">
                {concept.title}
              </h3>

              <p className="mt-3 text-xs leading-6 theme-muted">
                {concept.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* How signals work */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--cyan)" }}
            >
              How STOCOMETER thinks about risk
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              One signal is rarely the whole story.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 theme-muted">
              STOCOMETER combines several types of information rather
              than treating a single transaction or indicator as a
              conclusion.
            </p>
          </div>

          <div className="space-y-3">
            {investigationLayers.map((layer) => (
              <article
                key={layer.number}
                className="theme-surface rounded-2xl border theme-border p-6"
              >
                <div className="flex gap-5">
                  <span
                    className="pt-0.5 font-mono text-[10px]"
                    style={{ color: "var(--cyan)" }}
                  >
                    {layer.number}
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold">
                      {layer.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 theme-muted">
                      {layer.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Risk score */}
      <section className="border-y theme-border">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--cyan)" }}
              >
                Read the result
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                What does the risk score mean?
              </h2>
            </div>

            <div>
              <p className="text-sm leading-7 theme-muted">
                The STOCOMETER risk score is an informational
                assessment derived from the signals available during
                the investigation. It can incorporate security
                indicators, transaction behavior, and anomaly signals.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  [
                    "Low",
                    "Fewer significant risk signals were identified in the current analysis.",
                    "var(--low)",
                  ],
                  [
                    "Medium",
                    "The investigation contains signals that may warrant additional attention.",
                    "var(--medium)",
                  ],
                  [
                    "High",
                    "Multiple or significant risk indicators were identified.",
                    "var(--high)",
                  ],
                ].map(([level, description, color]) => (
                  <div
                    key={level}
                    className="theme-surface rounded-2xl border theme-border p-5"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: color }}
                      />

                      <span className="text-sm font-semibold">
                        {level}
                      </span>
                    </div>

                    <p className="mt-2 pl-5 text-xs leading-6 theme-muted">
                      {description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border theme-border bg-[var(--surface-2)] p-5">
                <p className="text-xs font-semibold">
                  Important distinction
                </p>

                <p className="mt-2 text-xs leading-6 theme-muted">
                  A risk score is not a probability of fraud and does
                  not independently establish criminal activity,
                  ownership, or wrongdoing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Glossary */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-2xl">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--cyan)" }}
          >
            Quick reference
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Terms you will see
          </h2>

          <p className="mt-4 text-sm leading-7 theme-muted">
            A few terms used throughout STOCOMETER and its
            investigation results.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border theme-border bg-[var(--border)] md:grid-cols-2">
          {terms.map((item) => (
            <article
              key={item.term}
              className="theme-surface p-7"
            >
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--cyan)" }}
              >
                {item.term}
              </h3>

              <p className="mt-3 text-xs leading-6 theme-muted">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Network support */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="theme-surface rounded-3xl border theme-border p-7 sm:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--cyan)" }}
              >
                Supported networks
              </p>

              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
                Ethereum, Polygon, Base, Arbitrum, and Solana.
              </h2>

              <p className="mt-3 max-w-2xl text-xs leading-6 theme-muted">
                Select the network that matches the wallet you are
                investigating. Cross-chain investigation is treated
                separately when multiple networks need to be analyzed
                together.
              </p>
            </div>

            <Link
              href="/analyze"
              className="inline-flex h-11 items-center justify-center rounded-xl px-5 text-xs font-semibold transition hover:opacity-90"
              style={{
                background: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              Explore an investigation →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t theme-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-xs font-semibold tracking-[0.08em]">
            STOCOMETER
          </p>

          <p className="text-[10px] theme-muted">
            Blockchain risk intelligence
          </p>
        </div>
      </footer>
    </main>
  );
}