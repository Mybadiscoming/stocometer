import Link from "next/link";

const rawData = [
  {
    title: "Transaction volume",
    text: "Large numbers of transactions and connected addresses can make meaningful relationships difficult to see.",
  },
  {
    title: "Technical complexity",
    text: "Blockchain data is precise, but raw transaction records rarely explain what the activity means.",
  },
  {
    title: "Fragmented signals",
    text: "Security, behavioral, and attribution information can come from different analytical layers.",
  },
  {
    title: "Unclear priorities",
    text: "The challenge is not only finding data. It is understanding which signals deserve attention.",
  },
];

const stocometer = [
  {
    title: "Structured investigation",
    text: "Start with one wallet and move through activity, relationships, signals, and evidence.",
  },
  {
    title: "Security intelligence",
    text: "Bring security indicators and positive flags into the same investigation.",
  },
  {
    title: "Behavioral context",
    text: "Analyze activity patterns alongside raw blockchain transactions.",
  },
  {
    title: "Explainable assessment",
    text: "Present a risk score together with the signals and reasoning behind it.",
  },
];

const principles = [
  {
    number: "01",
    title: "Clarity over complexity",
    description:
      "Blockchain data should remain accurate without forcing every investigator to interpret raw technical information alone.",
  },
  {
    number: "02",
    title: "Evidence over assumptions",
    description:
      "Transaction relationships, flow paths, security signals, and attribution should be presented as evidence with appropriate context.",
  },
  {
    number: "03",
    title: "Signals, not conclusions",
    description:
      "A risk indicator can justify further investigation. It should not be presented as proof of fraud, ownership, or criminal activity.",
  },
];

export default function WhyStocometerPage() {
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
        <div className="max-w-4xl">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--cyan)" }}
          >
            05 / Why STOCOMETER
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
            Don't just see the data.
            <br />
            Understand it.
          </h1>

          <p className="mt-7 max-w-2xl text-sm leading-7 theme-muted sm:text-base">
            Blockchain data can tell you what happened. STOCOMETER
            is designed to help you understand the relationships,
            signals, and evidence behind it.
          </p>
        </div>
      </section>

      {/* The problem */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-px overflow-hidden rounded-3xl border theme-border bg-[var(--border)] lg:grid-cols-2">
          {/* Raw experience */}
          <div className="theme-surface p-7 sm:p-10">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-muted">
                The problem
              </p>

              <span className="font-mono text-[10px] theme-muted">
                RAW DATA
              </span>
            </div>

            <h2 className="mt-10 max-w-lg text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              A lot of blockchain data.
              <br />
              Not enough context.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 theme-muted">
              A wallet investigation can quickly become difficult to
              interpret when transactions, addresses, security signals,
              and technical terminology are viewed separately.
            </p>

            <div className="mt-10 space-y-3">
              {rawData.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border theme-border bg-[var(--surface-2)] p-5"
                >
                  <p className="text-xs font-semibold">
                    {item.title}
                  </p>

                  <p className="mt-2 text-xs leading-6 theme-muted">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* STOCOMETER */}
          <div className="theme-surface p-7 sm:p-10">
            <div className="flex items-center justify-between">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: "var(--cyan)" }}
              >
                The STOCOMETER approach
              </p>

              <span
                className="font-mono text-[10px]"
                style={{ color: "var(--cyan)" }}
              >
                INTELLIGENCE
              </span>
            </div>

            <h2 className="mt-10 max-w-lg text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Intelligence built for understanding.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 theme-muted">
              STOCOMETER brings multiple analytical layers together
              so investigators can move from raw activity to a clearer,
              evidence-based picture.
            </p>

            <div className="mt-10 space-y-3">
              {stocometer.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border theme-border bg-[var(--surface-2)] p-5"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]"
                      style={{
                        background: "var(--cyan)",
                        color: "var(--background)",
                      }}
                    >
                      ✓
                    </span>

                    <div>
                      <p className="text-xs font-semibold">
                        {item.title}
                      </p>

                      <p className="mt-2 text-xs leading-6 theme-muted">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What makes it different */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--cyan)" }}
            >
              What makes it different
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Built to connect the pieces.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 theme-muted">
              STOCOMETER is not intended to replace the underlying
              blockchain data. It organizes and contextualizes that
              data so important relationships and signals are easier
              to investigate.
            </p>
          </div>

          <div className="space-y-3">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="theme-surface rounded-2xl border theme-border p-6 sm:p-7"
              >
                <div className="flex gap-5">
                  <span
                    className="pt-0.5 font-mono text-[10px]"
                    style={{ color: "var(--cyan)" }}
                  >
                    {principle.number}
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold">
                      {principle.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 theme-muted">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Investigation layers */}
      <section className="border-y theme-border">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--cyan)" }}
            >
              One investigation
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              From wallet activity to evidence.
            </h2>

            <p className="mt-4 text-sm leading-7 theme-muted">
              The product brings together the layers an investigator
              needs to move from an address to an informed assessment.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border theme-border bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "Blockchain activity",
                "Transactions, assets, counterparties, and activity patterns.",
              ],
              [
                "Security intelligence",
                "Known security indicators and positive risk signals.",
              ],
              [
                "Behavioral analysis",
                "Anomaly detection and activity characteristics.",
              ],
              [
                "Relationship graph",
                "Direct and multi-hop connections between wallets.",
              ],
              [
                "VASP intelligence",
                "Known attribution and potential service-provider candidates.",
              ],
              [
                "Investigation evidence",
                "Flow paths, evidence chains, findings, and a standardized report.",
              ],
            ].map(([title, description]) => (
              <article
                key={title}
                className="theme-surface p-7"
              >
                <h3 className="text-sm font-semibold">
                  {title}
                </h3>

                <p className="mt-3 text-xs leading-6 theme-muted">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible interpretation */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="theme-surface rounded-3xl border theme-border p-7 sm:p-10">
          <div className="max-w-3xl">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--cyan)" }}
            >
              Designed for responsible analysis
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              A signal is a reason to investigate, not a verdict.
            </h2>

            <p className="mt-4 text-sm leading-7 theme-muted">
              STOCOMETER presents risk scores, security indicators,
              attribution, and transaction relationships with context.
              These findings are intended to support investigation and
              prioritization; they do not independently establish
              fraud, criminal activity, ownership, or intent.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="border-t theme-border pt-12 text-center">
          <p className="text-sm theme-muted">
            Ready to see the difference?
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