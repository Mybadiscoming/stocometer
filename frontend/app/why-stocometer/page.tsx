"use client";

import Link from "next/link";

const rawData = [
  "Thousands of transactions and addresses",
  "Technical blockchain terminology",
  "Security signals spread across different sources",
  "Difficult to tell what actually matters",
];

const stocometer = [
  "One wallet → one clear analysis",
  "Blockchain activity organized for you",
  "Security intelligence in one place",
  "A risk score with reasons behind it",
];

export default function WhyStocometerPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#080b12",
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
          05 / WHY STOCOMETER
        </p>

        <h1 style={{
          fontSize: "clamp(45px, 7vw, 80px)",
          lineHeight: 1,
          letterSpacing: "-.05em"
        }}>
          Don't just see the data. Understand it.
        </h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          marginTop: "60px"
        }}>
          <div style={{
            padding: "40px",
            border: "1px solid #1b2533",
            background: "var(--surface)"
          }}>
            <p style={{ color: "#64748b", fontFamily: "monospace" }}>
              RAW BLOCKCHAIN EXPERIENCE
            </p>

            <h2>A wall of technical information.</h2>

            {rawData.map((item) => (
              <p key={item} style={{
                color: "#64748b",
                lineHeight: 1.6
              }}>
                — {item}
              </p>
            ))}
          </div>

          <div style={{
            padding: "40px",
            border: "1px solid #1b2533",
            background: "#0d131d"
          }}>
            <p style={{ color: "var(--cyan)", fontFamily: "monospace" }}>
              STOCOMETER
            </p>

            <h2>Intelligence built for understanding.</h2>

            {stocometer.map((item) => (
              <p key={item} style={{
                color: "var(--muted)",
                lineHeight: 1.6
              }}>
                <span style={{ color: "var(--cyan)" }}>✓</span> {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}