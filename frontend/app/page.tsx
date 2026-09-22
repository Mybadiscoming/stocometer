"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const steps = [
  {
    number: "01",
    title: "LOOK",
    description:
      "We look at blockchain activity connected to a wallet.",
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

function NetworkVisual() {
  return (
    <div className="network-visual">
      <div className="network-grid" />

      <div className="network-glow glow-one" />
      <div className="network-glow glow-two" />

      <div className="connection connection-one" />
      <div className="connection connection-two" />
      <div className="connection connection-three" />
      <div className="connection connection-four" />
      <div className="connection connection-five" />
      <div className="connection connection-six" />

      <div className="node node-center">
        <span>SC</span>
      </div>

      <div className="node node-one">
        <span>0x</span>
      </div>

      <div className="node node-two">
        <span>◆</span>
      </div>

      <div className="node node-three">
        <span>01</span>
      </div>

      <div className="node node-four">
        <span>↗</span>
      </div>

      <div className="node node-five">
        <span>TX</span>
      </div>

      <div className="scan-ring ring-one" />
      <div className="scan-ring ring-two" />

      <div className="visual-label label-top">
        <span className="live-dot" />
        NETWORK INTELLIGENCE
      </div>

      <div className="visual-label label-bottom">
        BLOCKCHAIN DATA
        <span>•</span>
        RISK SIGNALS
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="site">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--background);
          color: var(--foreground);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .site {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 78% 12%,
              rgba(34, 211, 238, 0.08),
              transparent 28%
            ),
            radial-gradient(
              circle at 15% 55%,
              rgba(59, 130, 246, 0.05),
              transparent 25%
            ),
            var(--background);
        }

        .container {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        /* NAV */

        .nav {
          position: fixed;
          z-index: 50;
          top: 0;
          left: 0;
          right: 0;
          border-bottom: 1px solid
            ${scrolled ? "rgba(148,163,184,.12)" : "transparent"};
          background: ${scrolled
            ? "rgba(8,11,18,.78)"
            : "rgba(8,11,18,.15)"};
          backdrop-filter: blur(18px);
          transition: 0.3s ease;
        }

        .nav-inner {
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          font-weight: 800;
          letter-spacing: -0.04em;
          font-size: 19px;
        }

        .brand-mark {
          width: 31px;
          height: 31px;
          border: 1px solid rgba(34, 211, 238, 0.5);
          background: rgba(34, 211, 238, 0.08);
          display: grid;
          place-items: center;
          color: var(--cyan);
          font-family: monospace;
          font-size: 12px;
          box-shadow: 0 0 24px rgba(34, 211, 238, 0.12);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 30px;
          color: var(--muted);
          font-size: 13px;
        }

        .nav-links a {
          transition: 0.2s;
        }

        .nav-links a:hover {
          color: var(--foreground);
        }

        .nav-button {
          padding: 10px 17px;
          border: 1px solid rgba(34, 211, 238, 0.35);
          background: rgba(34, 211, 238, 0.08);
          color: #67e8f9;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          transition: 0.2s;
        }

        .nav-button:hover {
          background: rgba(34, 211, 238, 0.15);
          border-color: rgba(34, 211, 238, 0.7);
        }

        /* HERO */

        .hero {
          min-height: 100vh;
          padding: 150px 0 90px;
          display: flex;
          align-items: center;
          position: relative;
        }

        .hero::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.035) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(148, 163, 184, 0.035) 1px,
              transparent 1px
            );
          background-size: 70px 70px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.02fr 0.98fr;
          gap: 50px;
          align-items: center;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #67e8f9;
          font-family: monospace;
          font-size: 11px;
          letter-spacing: 0.13em;
          margin-bottom: 22px;
        }

        .eyebrow-line {
          width: 28px;
          height: 1px;
          background: var(--cyan);
        }

        .hero h1 {
          max-width: 720px;
          margin: 0;
          font-size: clamp(52px, 6.2vw, 88px);
          line-height: 0.95;
          letter-spacing: -0.065em;
          font-weight: 800;
        }

        .hero h1 .accent {
          color: var(--cyan);
          text-shadow: 0 0 50px rgba(34, 211, 238, 0.16);
        }

        .hero-description {
          max-width: 560px;
          margin: 28px 0 0;
          color: var(--muted);
          font-size: 17px;
          line-height: 1.75;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-top: 34px;
        }

        .primary-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 21px;
          background: var(--cyan);
          color: #061016;
          font-size: 13px;
          font-weight: 800;
          border: 1px solid var(--cyan);
          transition: 0.25s ease;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(34, 211, 238, 0.2);
        }

        .secondary-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 20px;
          border: 1px solid #253041;
          color: #cbd5e1;
          font-size: 13px;
          font-weight: 700;
          background: rgba(16, 22, 33, 0.5);
          transition: 0.25s ease;
        }

        .secondary-button:hover {
          border-color: #3b4b60;
          transform: translateY(-2px);
        }

        .hero-meta {
          display: flex;
          gap: 25px;
          margin-top: 40px;
          color: #64748b;
          font-size: 11px;
          font-family: monospace;
        }

        .hero-meta span {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .tiny-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.7);
        }

        /* NETWORK VISUAL */

        .network-visual {
          height: 570px;
          position: relative;
          border: 1px solid rgba(148, 163, 184, 0.12);
          background: rgba(10, 15, 24, 0.55);
          overflow: hidden;
          box-shadow:
            inset 0 0 80px rgba(34, 211, 238, 0.025),
            0 30px 100px rgba(0, 0, 0, 0.3);
        }

        .network-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(148, 163, 184, 0.06) 1px,
              transparent 1px
            );
          background-size: 45px 45px;
          transform: perspective(700px) rotateX(50deg) scale(1.6);
          transform-origin: center bottom;
          opacity: 0.55;
        }

        .network-glow {
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.13;
        }

        .glow-one {
          background: var(--cyan);
          top: 30%;
          left: 38%;
        }

        .glow-two {
          background: #3b82f6;
          bottom: 10%;
          right: 10%;
        }

        .node {
          position: absolute;
          z-index: 5;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(34, 211, 238, 0.35);
          background: rgba(8, 11, 18, 0.92);
          display: grid;
          place-items: center;
          color: #67e8f9;
          font: 10px monospace;
          box-shadow: 0 0 25px rgba(34, 211, 238, 0.1);
          animation: float 4s ease-in-out infinite;
        }

        .node-center {
          width: 78px;
          height: 78px;
          top: 44%;
          left: 47%;
          border-color: var(--cyan);
          background: rgba(8, 16, 23, 0.96);
          color: var(--cyan);
          font-size: 15px;
          font-weight: 800;
          box-shadow:
            0 0 35px rgba(34, 211, 238, 0.15),
            inset 0 0 25px rgba(34, 211, 238, 0.05);
          animation: pulse 3s ease-in-out infinite;
        }

        .node-one {
          top: 20%;
          left: 18%;
        }

        .node-two {
          top: 18%;
          right: 17%;
          animation-delay: -1s;
        }

        .node-three {
          top: 66%;
          left: 13%;
          animation-delay: -2s;
        }

        .node-four {
          top: 73%;
          right: 18%;
          animation-delay: -1.5s;
        }

        .node-five {
          top: 39%;
          right: 5%;
          animation-delay: -0.5s;
        }

        .connection {
          position: absolute;
          z-index: 2;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(34, 211, 238, 0.5),
            transparent
          );
          transform-origin: left center;
        }

        .connection-one {
          width: 300px;
          top: 42%;
          left: 21%;
          transform: rotate(23deg);
        }

        .connection-two {
          width: 280px;
          top: 45%;
          left: 51%;
          transform: rotate(-27deg);
        }

        .connection-three {
          width: 300px;
          top: 48%;
          left: 18%;
          transform: rotate(31deg);
        }

        .connection-four {
          width: 270px;
          top: 52%;
          left: 50%;
          transform: rotate(32deg);
        }

        .connection-five {
          width: 200px;
          top: 46%;
          left: 52%;
          transform: rotate(-5deg);
        }

        .connection-six {
          width: 180px;
          top: 70%;
          left: 19%;
          transform: rotate(-20deg);
        }

        .scan-ring {
          position: absolute;
          z-index: 1;
          border: 1px solid rgba(34, 211, 238, 0.12);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .ring-one {
          width: 270px;
          height: 270px;
          animation: ringPulse 4s infinite;
        }

        .ring-two {
          width: 430px;
          height: 430px;
          animation: ringPulse 4s 1s infinite;
        }

        .visual-label {
          position: absolute;
          z-index: 8;
          color: #64748b;
          font: 9px monospace;
          letter-spacing: 0.13em;
        }

        .label-top {
          top: 23px;
          left: 23px;
        }

        .label-bottom {
          bottom: 23px;
          right: 23px;
          display: flex;
          gap: 8px;
        }

        .live-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          margin-right: 7px;
          box-shadow: 0 0 10px #22c55e;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.04);
          }
        }

        @keyframes ringPulse {
          0% {
            opacity: 0.05;
            transform: translate(-50%, -50%) scale(0.9);
          }

          50% {
            opacity: 0.2;
          }

          100% {
            opacity: 0.05;
            transform: translate(-50%, -50%) scale(1.08);
          }
        }

        /* SIGNAL BAR */

        .signal-bar {
          border-top: 1px solid rgba(148, 163, 184, 0.08);
          border-bottom: 1px solid rgba(148, 163, 184, 0.08);
          padding: 14px 0;
          overflow: hidden;
          color: #475569;
          font: 10px monospace;
          letter-spacing: 0.12em;
        }

        .signal-track {
          display: flex;
          justify-content: center;
          gap: 34px;
          white-space: nowrap;
        }

        /* SECTIONS */

        .section {
          padding: 125px 0;
        }

        .section-header {
          max-width: 700px;
          margin-bottom: 58px;
        }

        .section-number {
          color: var(--cyan);
          font: 11px monospace;
          letter-spacing: 0.12em;
          margin-bottom: 15px;
        }

        .section h2 {
          margin: 0;
          font-size: clamp(38px, 5vw, 65px);
          line-height: 1;
          letter-spacing: -0.055em;
        }

        .section-intro {
          margin-top: 20px;
          color: #64748b;
          line-height: 1.7;
          font-size: 15px;
          max-width: 600px;
        }

        /* CRYPTO CARDS */

        .crypto-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid #1b2533;
          border-left: 1px solid #1b2533;
        }

        .crypto-card {
          min-height: 290px;
          padding: 27px;
          border-right: 1px solid #1b2533;
          border-bottom: 1px solid #1b2533;
          background: rgba(16, 22, 33, 0.4);
          transition: 0.3s ease;
          position: relative;
        }

        .crypto-card:hover {
          background: rgba(16, 22, 33, 0.85);
          transform: translateY(-4px);
        }

        .card-number {
          color: #475569;
          font: 10px monospace;
        }

        .card-symbol {
          position: absolute;
          right: 25px;
          top: 25px;
          width: 43px;
          height: 43px;
          border: 1px solid #263445;
          display: grid;
          place-items: center;
          color: var(--cyan);
          font: 13px monospace;
        }

        .crypto-card h3 {
          margin: 75px 0 12px;
          font-size: 24px;
          letter-spacing: -0.03em;
        }

        .crypto-card p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.75;
        }

        /* PROBLEM */

        .problem {
          position: relative;
          background: #0b1018;
          border-top: 1px solid rgba(148, 163, 184, 0.07);
          border-bottom: 1px solid rgba(148, 163, 184, 0.07);
        }

        .problem-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 90px;
          align-items: center;
        }

        .problem-title {
          font-size: clamp(40px, 5vw, 67px);
          line-height: 1;
          letter-spacing: -0.055em;
          margin: 0;
        }

        .problem-title span {
          color: #64748b;
        }

        .problem-copy {
          color: var(--muted);
          font-size: 16px;
          line-height: 1.8;
        }

        .raw-data {
          margin-top: 30px;
          border: 1px solid #202c3c;
          background: var(--background);
          padding: 20px;
          font: 10px/2 monospace;
          color: #475569;
          overflow: hidden;
        }

        .raw-data .cyan {
          color: var(--cyan);
        }

        .raw-data .red {
          color: #ef4444;
        }

        /* INTRO */

        .intro-panel {
          border: 1px solid #1e2b3b;
          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(34, 211, 238, 0.07),
              transparent 30%
            ),
            #0d131d;
          padding: 55px;
          position: relative;
          overflow: hidden;
        }

        .intro-panel::after {
          content: "STOCOMETER";
          position: absolute;
          right: -30px;
          bottom: -40px;
          color: rgba(255, 255, 255, 0.015);
          font-size: 120px;
          font-weight: 900;
          letter-spacing: -0.08em;
        }

        .intro-panel h2 {
          max-width: 750px;
        }

        .intro-panel h2 span {
          color: var(--cyan);
        }

        .intro-copy {
          max-width: 620px;
          color: var(--muted);
          line-height: 1.8;
          margin: 22px 0 0;
        }

        /* STEPS */

        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid #1b2533;
        }

        .step {
          padding: 35px 28px 25px;
          border-right: 1px solid #1b2533;
          border-bottom: 1px solid #1b2533;
        }

        .step:last-child {
          border-right: 0;
        }

        .step-number {
          color: var(--cyan);
          font: 11px monospace;
        }

        .step h3 {
          margin: 45px 0 10px;
          font-size: 27px;
          letter-spacing: -0.03em;
        }

        .step p {
          margin: 0;
          color: #64748b;
          line-height: 1.7;
          font-size: 13px;
        }

        /* DIFFERENCE */

        .difference {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid #1b2533;
        }

        .difference-column {
          padding: 35px;
        }

        .difference-column:first-child {
          border-right: 1px solid #1b2533;
        }

        .difference-label {
          font: 10px monospace;
          letter-spacing: 0.1em;
          color: #64748b;
          margin-bottom: 30px;
        }

        .difference-title {
          font-size: 27px;
          letter-spacing: -0.03em;
          margin-bottom: 25px;
        }

        .difference-list {
          display: grid;
          gap: 14px;
        }

        .difference-item {
          display: flex;
          gap: 11px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
        }

        .difference-item::before {
          content: "—";
          color: #475569;
        }

        .difference-column:last-child .difference-item::before {
          content: "✓";
          color: var(--cyan);
        }

        /* CTA */

        .cta {
          padding: 145px 0;
          text-align: center;
          position: relative;
        }

        .cta::before {
          content: "";
          position: absolute;
          width: 600px;
          height: 300px;
          left: 50%;
          top: 30%;
          transform: translate(-50%, -50%);
          background: rgba(34, 211, 238, 0.06);
          filter: blur(100px);
          pointer-events: none;
        }

        .cta-content {
          position: relative;
          z-index: 2;
        }

        .cta h2 {
          max-width: 800px;
          margin: 0 auto;
          font-size: clamp(48px, 7vw, 88px);
          line-height: 0.95;
          letter-spacing: -0.065em;
        }

        .cta h2 span {
          color: var(--cyan);
        }

        .cta p {
          max-width: 520px;
          margin: 25px auto 0;
          color: #64748b;
          line-height: 1.7;
          font-size: 15px;
        }

        .cta-button {
          margin-top: 35px;
        }

        /* FOOTER */

        .footer {
          border-top: 1px solid #182230;
          padding: 30px 0;
        }

        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #475569;
          font: 10px monospace;
        }

        .footer-brand {
          color: var(--muted);
          font-weight: 700;
        }

        .footer-right {
          display: flex;
          gap: 20px;
        }

        /* RESPONSIVE */

        @media (max-width: 900px) {
          .hero-content,
          .problem-layout,
          .difference {
            grid-template-columns: 1fr;
          }

          .hero {
            padding-top: 125px;
          }

          .network-visual {
            height: 460px;
          }

          .crypto-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .steps {
            grid-template-columns: 1fr;
          }

          .step,
          .step:last-child {
            border-right: 0;
          }

          .difference-column:first-child {
            border-right: 0;
            border-bottom: 1px solid #1b2533;
          }

          .nav-links {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .container {
            width: min(100% - 28px, 1180px);
          }

          .hero {
            padding-bottom: 60px;
          }

          .hero h1 {
            font-size: 51px;
          }

          .hero-description {
            font-size: 15px;
          }

          .hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .primary-button,
          .secondary-button {
            justify-content: center;
          }

          .hero-meta {
            flex-wrap: wrap;
            gap: 12px;
          }

          .network-visual {
            height: 390px;
          }

          .crypto-grid {
            grid-template-columns: 1fr;
          }

          .crypto-card {
            min-height: 240px;
          }

          .section {
            padding: 90px 0;
          }

          .intro-panel {
            padding: 30px;
          }

          .difference-column {
            padding: 28px;
          }

          .footer-inner {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .footer-right {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="brand">
            <span className="brand-mark">SC</span>
            STOCOMETER
          </Link>

          
          <div className="nav-links">
            <Link href="/learn">Learn</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/why-stocometer">Why STOCOMETER</Link>
            <Link href="/settings" className="settings-icon" aria-label="Settings">⚙️ </Link>
  

          </div>

        

          <Link href="/analyze" className="nav-button">
            CHECK A WALLET →
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="container hero-content">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" />
              BLOCKCHAIN RISK INTELLIGENCE
            </div>

            <h1>
              Crypto doesn't have to be{" "}
              <span className="accent">confusing.</span>
            </h1>

            <p className="hero-description">
              STOCOMETER turns complicated blockchain activity into simple,
              understandable risk intelligence — so you can make better
              decisions before trusting a wallet.
            </p>

            <div className="hero-actions">
              <Link href="/analyze" className="primary-button">
                CHECK A WALLET <span>→</span>
              </Link>

              <a href="#learn" className="secondary-button">
                LEARN THE BASICS ↓
              </a>
            </div>

            <div className="hero-meta">
              <span>
                <i className="tiny-dot" />
                ETHEREUM DATA
              </span>

              <span>SECURITY INTELLIGENCE</span>
              <span>EXPLAINABLE RISK</span>
            </div>
          </div>

          <NetworkVisual />
        </div>
      </section>

      <div className="signal-bar">
        <div className="signal-track">
          <span>BLOCKCHAIN</span>
          <span>•</span>
          <span>WALLET ACTIVITY</span>
          <span>•</span>
          <span>SECURITY SIGNALS</span>
          <span>•</span>
          <span>RISK INTELLIGENCE</span>
          <span>•</span>
          <span>EXPLAINABLE DATA</span>
        </div>
      </div>

      <section className="section" id="learn">
        <div className="container">
          <div className="section-header">
            <div className="section-number">01 / START HERE</div>

            <h2>Crypto, explained like you're five.</h2>

            <p className="section-intro">
              You shouldn't need to understand blockchain technology before
              you can understand whether something looks risky.
            </p>
          </div>

          <div className="crypto-grid">
            {cryptoCards.map((card) => (
              <div className="crypto-card" key={card.number}>
                <div className="card-number">{card.number}</div>

                <div className="card-symbol">{card.symbol}</div>

                <h3>{card.title}</h3>

                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section problem">
        <div className="container problem-layout">
          <div>
            <div className="section-number">02 / THE PROBLEM</div>

            <h2 className="problem-title">
              The blockchain tells you everything.
              <br />
              <span>It doesn't explain anything.</span>
            </h2>
          </div>

          <div>
            <p className="problem-copy">
              Blockchain data is public, but raw data is difficult to
              understand. Addresses, transactions, token movements and
              security signals can quickly become overwhelming.
            </p>

            <div className="raw-data">
              <div>
                <span className="cyan">from:</span> 0x7a...91bf
              </div>

              <div>
                <span className="cyan">to:</span> 0x42...e821
              </div>

              <div>
                <span className="cyan">value:</span> 14.8200 ETH
              </div>

              <div>
                <span className="cyan">block:</span> 23194821
              </div>

              <div>
                <span className="red">security_signal:</span> ???
              </div>

              <div>
                <span className="red">risk:</span> ???
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="intro-panel">
            <div className="section-number">03 / MEET STOCOMETER</div>

            <h2>
              From blockchain noise
              <br />
              to <span>understandable risk.</span>
            </h2>

            <p className="intro-copy">
              STOCOMETER brings blockchain activity and security intelligence
              together, then organizes it into a simple risk picture.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="container">
          <div className="section-header">
            <div className="section-number">04 / HOW IT WORKS</div>

            <h2>Look. Check. Explain.</h2>

            <p className="section-intro">
              Three simple steps between a wallet address and a clearer
              understanding of its risk.
            </p>
          </div>

          <div className="steps">
            {steps.map((step) => (
              <div className="step" key={step.number}>
                <div className="step-number">{step.number}</div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="why">
        <div className="container">
          <div className="section-header">
            <div className="section-number">05 / WHY STOCOMETER</div>

            <h2>Don't just see the data. Understand it.</h2>
          </div>

          <div className="difference">
            <div className="difference-column">
              <div className="difference-label">
                RAW BLOCKCHAIN EXPERIENCE
              </div>

              <div className="difference-title">
                A wall of technical information.
              </div>

              <div className="difference-list">
                <div className="difference-item">
                  Thousands of transactions and addresses
                </div>

                <div className="difference-item">
                  Technical blockchain terminology
                </div>

                <div className="difference-item">
                  Security signals spread across different sources
                </div>

                <div className="difference-item">
                  Difficult to tell what actually matters
                </div>
              </div>
            </div>

            <div className="difference-column">
              <div className="difference-label">STOCOMETER</div>

              <div className="difference-title">
                Intelligence built for understanding.
              </div>

              <div className="difference-list">
                <div className="difference-item">
                  One wallet → one clear analysis
                </div>

                <div className="difference-item">
                  Blockchain activity organized for you
                </div>

                <div className="difference-item">
                  Security intelligence in one place
                </div>

                <div className="difference-item">
                  A risk score with reasons behind it
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-content">
          <div className="section-number">06 / TAKE THE NEXT STEP</div>

          <h2>
            Before you trust a wallet,
            <br />
            <span>understand it.</span>
          </h2>

          <p>
            Enter an Ethereum wallet address and see what its blockchain
            activity and security signals tell you.
          </p>

          <Link href="/analyze" className="primary-button cta-button">
            CHECK A WALLET <span>→</span>
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">STOCOMETER</div>

          <div className="footer-right">
            <span>BLOCKCHAIN RISK INTELLIGENCE</span>
            <span>ETHEREUM</span>
            <span>2026</span>
          </div>
        </div>
      </footer>
    </main>
  );
}