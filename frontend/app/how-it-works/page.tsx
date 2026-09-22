"use client";

import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "LOOK",
    description: "We look at blockchain activity connected to a wallet.",
  },
  {
    number: "02",
    title: "CHECK",
    description:
      "We check security intelligence for suspicious activity and known risk signals.",
  },
  {
    number: "03",
    title: "EXPLAIN",
    description:
      "We turn technical blockchain data into a risk assessment people can actually understand.",
  },
];

export default function HowItWorksPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "var(--background)",
      color: "var(--foreground)",
      padding: "120px 5%",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <nav style={{ marginBottom: "80px" }}>
        <Link href="/" style={{ color: "var(--cyan)", textDecoration: "none" }}>
          ← STOCOMETER
        </Link>
      </nav>

      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <p style={{ color: "var(--cyan)", fontFamily: "monospace" }}>
          04 / HOW IT WORKS
        </p>

        <h1 style={{
          fontSize: "clamp(45px, 7vw, 80px)",
          lineHeight: 1,
          letterSpacing: "-.05em"
        }}>
          Look. Check. Explain.
        </h1>

        <p style={{
          color: "#64748b",
          maxWidth: "600px",
          fontSize: "16px",
          lineHeight: 1.8
        }}>
          Three simple steps between a wallet address and a clearer
          understanding of its risk.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          marginTop: "60px"
        }}>
          {steps.map((step) => (
            <div
              key={step.number}
              style={{
                padding: "40px 30px",
                border: "1px solid #1b2533",
                background: "var(--surface)"
              }}
            >
              <span style={{
                color: "var(--cyan)",
                fontFamily: "monospace"
              }}>
                {step.number}
              </span>

              <h2 style={{
                marginTop: "55px",
                fontSize: "30px"
              }}>
                {step.title}
              </h2>

              <p style={{
                color: "#64748b",
                lineHeight: 1.7
              }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}