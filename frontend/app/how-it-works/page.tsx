import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Look",
    description:
      "Start with a wallet address and examine the blockchain activity connected to it.",
  },
  {
    number: "02",
    title: "Check",
    description:
      "Review security intelligence, behavioral patterns, transaction activity, and other risk signals.",
  },
  {
    number: "03",
    title: "Explain",
    description:
      "Turn complex blockchain data into a clear investigation with evidence, relationships, and understandable findings.",
  },
];

const capabilities = [
  {
    title: "Blockchain tracing",
    description:
      "Follow transactions and wallet relationships across supported blockchain networks.",
  },
  {
    title: "Security intelligence",
    description:
      "Surface known security indicators and distinguish detected signals from clear results.",
  },
  {
    title: "Behavioral analysis",
    description:
      "Look for unusual wallet activity and patterns that may require closer investigation.",
  },
  {
    title: "VASP intelligence",
    description:
      "Identify known VASP addresses and surface potential service-provider connections.",
  },
  {
    title: "Evidence analysis",
    description:
      "Connect transaction paths and supporting records into investigation-ready evidence.",
  },
  {
    title: "Risk assessment",
    description:
      "Combine blockchain, security, and behavioral signals into an interpretable risk assessment.",
  },
];

export default function HowItWorksPage() {
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
            04 / How it works
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">
            Look. Check. Explain.
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 theme-muted sm:text-base">
            STOCOMETER turns a wallet address into a structured
            blockchain investigation — bringing transaction activity,
            security intelligence, behavioral signals, and evidence
            together in one place.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-px overflow-hidden rounded-3xl border theme-border bg-[var(--border)] md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="theme-surface p-7 sm:p-9"
            >
              <span
                className="font-mono text-xs"
                style={{ color: "var(--cyan)" }}
              >
                {step.number}
              </span>

              <h2 className="mt-16 text-3xl font-semibold tracking-[-0.035em]">
                {step.title}
              </h2>

              <p className="mt-4 text-sm leading-7 theme-muted">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Investigation flow */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--cyan)" }}
            >
              From address to insight
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              One investigation.
              <br />
              Multiple layers of evidence.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 theme-muted">
              A wallet address is only the starting point. STOCOMETER
              combines several analytical layers so investigators can
              move from raw transactions to a clearer understanding
              of what happened.
            </p>
          </div>

          <div className="space-y-3">
            {[
              [
                "01",
                "Wallet",
                "Enter the address and select its blockchain network.",
              ],
              [
                "02",
                "Transactions",
                "Trace incoming, outgoing, and connected wallet activity.",
              ],
              [
                "03",
                "Signals",
                "Check security indicators and behavioral anomalies.",
              ],
              [
                "04",
                "Relationships",
                "Map direct counterparties, intermediaries, and multi-hop flows.",
              ],
              [
                "05",
                "Attribution",
                "Look for known VASP addresses and potential service-provider connections.",
              ],
              [
                "06",
                "Evidence",
                "Organize relevant paths and transactions into an investigation summary.",
              ],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="theme-surface flex gap-5 rounded-2xl border theme-border p-5 sm:p-6"
              >
                <span
                  className="pt-0.5 font-mono text-[10px]"
                  style={{ color: "var(--cyan)" }}
                >
                  {number}
                </span>

                <div>
                  <h3 className="text-sm font-semibold">
                    {title}
                  </h3>

                  <p className="mt-1 text-xs leading-6 theme-muted">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-y theme-border">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--cyan)" }}
            >
              Investigation layers
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              What STOCOMETER looks at
            </h2>

            <p className="mt-4 text-sm leading-7 theme-muted">
              Each layer answers a different part of the investigation.
              Together they provide a more complete view of wallet
              activity and risk.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border theme-border bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <article
                key={capability.title}
                className="theme-surface p-7"
              >
                <h3 className="text-sm font-semibold">
                  {capability.title}
                </h3>

                <p className="mt-3 text-xs leading-6 theme-muted">
                  {capability.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-chain note */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="theme-surface rounded-3xl border theme-border p-7 sm:p-10">
          <div className="max-w-3xl">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--cyan)" }}
            >
              Multiple networks
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Investigate the network that matters.
            </h2>

            <p className="mt-4 text-sm leading-7 theme-muted">
              STOCOMETER supports Ethereum, Polygon, Base, Arbitrum,
              and Solana investigations. Cross-chain investigation is
              handled separately when analysis across multiple networks
              is required.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="border-t theme-border pt-12 text-center">
          <p className="text-sm theme-muted">
            Ready to investigate a wallet?
          </p>

          <Link
            href="/analyze"
            className="mt-5 inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold transition hover:opacity-90"
            style={{
              background: "var(--foreground)",
              color: "var(--background)",
            }}
          >
            Start an investigation
            <span className="ml-2">→</span>
          </Link>
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