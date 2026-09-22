"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Demo authentication flow
    router.push("/");
  }

  return (
    <main className="login-page">
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(34, 211, 238, 0.08),
              transparent 30%
            ),
            var(--background);
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

        .wrapper {
          width: 100%;
          max-width: 440px;
        }

        .brand {
          text-align: center;
          margin-bottom: 28px;
        }

        .logo {
          width: 48px;
          height: 48px;
          margin: 0 auto 15px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(34, 211, 238, 0.5);
          background: rgba(34, 211, 238, 0.08);
          color: var(--cyan);
          font: 700 14px monospace;
          box-shadow: 0 0 30px rgba(34, 211, 238, 0.1);
        }

        .brand-name {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .brand-subtitle {
          margin-top: 7px;
          color: #64748b;
          font: 10px monospace;
          letter-spacing: 0.12em;
        }

        .card {
          padding: 36px;
          border: 1px solid #202c3c;
          background: rgba(16, 22, 33, 0.88);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.02);
        }

        .heading {
          margin: 0;
          font-size: 27px;
          letter-spacing: -0.04em;
        }

        .description {
          margin: 9px 0 28px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }

        .field {
          margin-bottom: 19px;
        }

        .label {
          display: block;
          margin-bottom: 8px;
          color: var(--muted);
          font: 10px monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .input {
          width: 100%;
          padding: 13px 14px;
          border: 1px solid #263445;
          outline: none;
          background: var(--background);
          color: var(--foreground);
          font-size: 14px;
          transition: 0.2s ease;
        }

        .input::placeholder {
          color: #475569;
        }

        .input:focus {
          border-color: rgba(34, 211, 238, 0.65);
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.06);
        }

        .button {
          width: 100%;
          margin-top: 8px;
          padding: 14px;
          border: 1px solid var(--cyan);
          background: var(--cyan);
          color: #061016;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.05em;
          transition: 0.25s ease;
        }

        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(34, 211, 238, 0.18);
        }

        .security {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 22px;
          color: #475569;
          font: 9px monospace;
          letter-spacing: 0.08em;
        }

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.7);
        }

        @media (max-width: 500px) {
          .login-page {
            padding: 18px;
          }

          .card {
            padding: 27px 22px;
          }
        }
      `}</style>

      <div className="wrapper">
        <div className="brand">
          <div className="logo">SC</div>
          <div className="brand-name">STOCOMETER</div>
          <div className="brand-subtitle">
            BLOCKCHAIN RISK INTELLIGENCE
          </div>
        </div>

        <div className="card">
          <h1 className="heading">Welcome back</h1>

          <p className="description">
            Sign in to continue to your STOCOMETER workspace.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="email">
                Email
              </label>

              <input
                id="email"
                className="input"
                type="text"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="password">
                Password
              </label>

              <input
                id="password"
                className="input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button className="button" type="submit">
              SIGN IN →
            </button>
          </form>

          <div className="security">
            <span className="dot" />
            SECURE ACCESS
          </div>
        </div>
      </div>
    </main>
  );
}