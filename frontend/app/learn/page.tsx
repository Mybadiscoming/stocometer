"use client";

import Link from "next/link";

const cryptoCards = [
  {
    number: "01",
    title: "Wallet",
    text: "A wallet is your place on the blockchain. It can send, receive, and hold crypto.",
    symbol: "0x",
  },
  {
    number: "02",
    title: "Blockchain",
    text: "Think of it as a giant public notebook. Every transaction gets recorded.",
    symbol: "⌘",
  },
  {
    number: "03",
    title: "Transaction",
    text: "A transaction is simply crypto moving from one address to another.",
    symbol: "→",
  },
  {
    number: "04",
    title: "Risk",
    text: "Risk means there are signals that a wallet or its activity deserves attention.",
    symbol: "!",
  },
];

export default function LearnPage() {
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
          01 / START HERE
        </p>

        <h1 style={{
          fontSize: "clamp(45px, 7vw, 80px)",
          lineHeight: 1,
          letterSpacing: "-.05em"
        }}>
          Crypto, explained like you're five.
        </h1>

        <p style={{
          color: "#64748b",
          maxWidth: "600px",
          fontSize: "16px",
          lineHeight: 1.8
        }}>
          You shouldn't need to understand blockchain technology before you
          can understand whether something looks risky.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          marginTop: "60px",
          borderTop: "1px solid #1b2533"
        }}>
          {cryptoCards.map((card) => (
            <div
              key={card.number}
              style={{
                minHeight: "280px",
                padding: "28px",
                borderRight: "1px solid #1b2533",
                borderBottom: "1px solid #1b2533",
                background: "var(--surface)"
              }}
            >
              <span style={{ color: "#475569", fontFamily: "monospace" }}>
                {card.number}
              </span>

              <div style={{
                marginTop: "55px",
                fontSize: "25px",
                fontWeight: 700
              }}>
                {card.title}
              </div>

              <p style={{
                color: "#64748b",
                lineHeight: 1.7,
                fontSize: "14px"
              }}>
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}