"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function LiveCounterDemo() {
  const [amount, setAmount] = useState(1247.8312);
  useEffect(() => {
    const interval = setInterval(() => {
      setAmount((v) => v + 0.0023);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  return <span>{amount.toFixed(4)}</span>;
}

function ParticleOrbs() {
  return (
    <div className="particles" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`orb orb-${i + 1}`} />
      ))}
      <style jsx>{`
        .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.15;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #38BDF8, transparent);
          top: -100px; left: -100px;
          animation: float 8s ease-in-out infinite;
        }
        .orb-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, #06D6A0, transparent);
          top: 40%; right: -50px;
          animation: float 10s ease-in-out infinite reverse;
        }
        .orb-3 {
          width: 250px; height: 250px;
          background: radial-gradient(circle, #818CF8, transparent);
          bottom: 20%; left: 30%;
          animation: float 7s ease-in-out infinite;
          animation-delay: 2s;
        }
        .orb-4 {
          width: 180px; height: 180px;
          background: radial-gradient(circle, #38BDF8, transparent);
          bottom: 10%; right: 25%;
          animation: float 9s ease-in-out infinite;
          animation-delay: 4s;
        }
        .orb-5 {
          width: 120px; height: 120px;
          background: radial-gradient(circle, #06D6A0, transparent);
          top: 30%; left: 15%;
          animation: float 6s ease-in-out infinite reverse;
          animation-delay: 1s;
        }
        .orb-6 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, #F59E0B, transparent);
          top: 60%; left: 55%;
          animation: float 11s ease-in-out infinite;
          animation-delay: 3s;
          opacity: 0.08;
        }
      `}</style>
    </div>
  );
}

function StreamFlowDemo() {
  return (
    <div className="flow-demo">
      <div className="flow-node flow-sender animate-fade-up delay-200">
        <div className="flow-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 11h6M9 15h6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flow-label">Sender</div>
        <div className="flow-sub">DAO / Company</div>
      </div>
      <div className="flow-middle animate-fade-up delay-300">
        <div className="flow-tokens">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`flow-token flow-token-${i + 1}`}>
              $
            </div>
          ))}
        </div>
        <div className="flow-pipe">
          <div className="flow-pipe-fill" />
          <div className="flow-per-sec">
            <span className="flow-rate">+$0.0023</span>
            <span className="flow-unit">/sec</span>
          </div>
        </div>
        <div className="flow-asset-badge">
          <span className="flow-dot" />
          PAS
        </div>
      </div>
      <div className="flow-node flow-recipient animate-fade-up delay-400">
        <div className="flow-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flow-label">Recipient</div>
        <div className="flow-sub">Freelancer / Team</div>
      </div>

      <style jsx>{`
        .flow-demo {
          display: flex;
          align-items: center;
          gap: 0;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 32px;
          position: relative;
          overflow: hidden;
        }
        .flow-demo::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(56,189,248,0.03), rgba(6,214,160,0.03));
          pointer-events: none;
        }
        .flow-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          width: 120px;
        }
        .flow-avatar {
          width: 56px; height: 56px;
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }
        .flow-label {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-primary);
        }
        .flow-sub {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-align: center;
        }
        .flow-middle {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
        }
        .flow-tokens {
          display: flex;
          gap: 8px;
          justify-content: center;
        }
        .flow-token {
          width: 28px; height: 28px;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: #050810;
          animation: float 2s ease-in-out infinite;
        }
        .flow-token-1 { animation-delay: 0s; }
        .flow-token-2 { animation-delay: 0.3s; }
        .flow-token-3 { animation-delay: 0.6s; }
        .flow-token-4 { animation-delay: 0.9s; }
        .flow-token-5 { animation-delay: 1.2s; }
        .flow-pipe {
          width: 100%;
          position: relative;
        }
        .flow-pipe-fill {
          height: 3px;
          background: var(--grad-brand);
          border-radius: 2px;
          background-size: 200% 200%;
          animation: stream-flow 2s linear infinite;
        }
        .flow-per-sec {
          text-align: center;
          margin-top: 8px;
        }
        .flow-rate {
          font-family: var(--font-mono);
          font-size: 0.9rem;
          color: var(--accent-electric);
          font-weight: 500;
        }
        .flow-unit {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-left: 4px;
        }
        .flow-asset-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(56,189,248,0.08);
          border: 1px solid rgba(56,189,248,0.2);
          border-radius: 100px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--accent-cyan);
        }
        .flow-dot {
          width: 5px; height: 5px;
          background: var(--accent-electric);
          border-radius: 50%;
          animation: pulse-glow 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Per-Second Precision",
    desc: "Tokens stream continuously, every block. Recipients can withdraw any time and see their balance tick up in real-time.",
    color: "var(--accent-cyan)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Non-Custodial",
    desc: "Funds are locked in a PVM smart contract. No middleman. The contract enforces every rule automatically.",
    color: "var(--accent-electric)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Native PAS Streaming",
    desc: "Streams native PAS directly on Paseo Asset Hub with no wrapped assets.",
    color: "var(--accent-violet)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 14l-4-4 4-4M15 14l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Cancellable Streams",
    desc: "Senders can cancel at any time. Vested tokens go to the recipient, unvested tokens return to sender.",
    color: "var(--accent-gold)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Full Transparency",
    desc: "Every stream is on-chain and publicly verifiable. Share your stream link to prove your payment arrangement.",
    color: "var(--accent-cyan)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "PVM Native",
    desc: "Built on Polkadot's Revive VM (PVM), the next-generation smart contract engine purpose-built for Polkadot.",
    color: "var(--accent-electric)",
  },
];

const stats = [
  { label: "Assets Supported", value: "PAS" },
  { label: "Blockchain", value: "Polkadot Hub" },
  { label: "Proven Model", value: "$2B+ Streamed" },
  { label: "Update Freq", value: "Per Block" },
];

const useCases = [
  {
    title: "DAOs & Teams",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 21h18M9 21V9l6-6v18M15 3l-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    desc: "Pay contributors per-second instead of monthly. Align incentives and retain top talent.",
    tag: "Governance",
  },
  {
    title: "Freelancers",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3M9 12h6M9 16h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    desc: "Share stream links as payment proof. No invoicing delays, no net-30 nightmares.",
    tag: "B2B",
  },
  {
    title: "Grants",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    desc: "Release funding milestone by milestone. Automatic vesting schedules with on-chain accountability.",
    tag: "Funding",
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <div className="landing">
      <div className="bg-mesh" />
      <section className="hero" ref={heroRef}>
        <ParticleOrbs />
        <div className="container hero-inner">
          <div className="hero-content animate-fade-up">
            <div className="hero-pill">
              <span className="pill-dot" />
              Live on Paseo Asset Hub
            </div>
            <h1 className="hero-title">
              Money that flows
              <br />
              <span className="grad-text">like water.</span>
            </h1>
            <p className="hero-desc">
              StreamPay lets you lock tokens into a contract that releases them
              per-second to any recipient. The future of payroll, grants, and
              contributor compensation.
            </p>
            <div className="hero-cta">
              <Link href="/create" className="btn-primary">
                Start Streaming
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/streams" className="btn-secondary">
                View My Streams
              </Link>
            </div>

            <div className="hero-counter-demo animate-fade-up delay-300">
              <span className="hcd-label">You have earned</span>
              <div className="hcd-amount">
                <LiveCounterDemo />
                <span className="hcd-symbol">PAS</span>
              </div>
              <span className="hcd-sub">from active streams</span>
              <div className="hcd-indicator">
                <span className="hcd-dot" />
                LIVE
              </div>
            </div>
          </div>

          <div className="hero-visual animate-fade-up delay-400">
            <StreamFlowDemo />

            <div className="stat-float stat-float-1 animate-float">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-electric)" strokeWidth="2">
                <path d="M23 6l-9.5 9.5-5-5L1 18" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 6h6v6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <div className="sf-value">+$1,247.83</div>
                <div className="sf-label">Streamed today</div>
              </div>
            </div>
            <div className="stat-float stat-float-2 animate-float" style={{ animationDelay: "1.5s" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <div className="sf-value">14d 6h 22m</div>
                <div className="sf-label">Stream remaining</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker-section">
        <div className="ticker-wrap">
          <div className="ticker-content">
            {Array.from({ length: 4 }).flatMap((_, i) =>
              [
                "Per-second payroll",
                "Non-custodial vaults",
                "PVM Smart Contracts",
                "Native PAS streaming",
                "Live balance counters",
                "Cancellable streams",
              ].map((item, j) => (
                <span key={`${i}-${j}`} className="ticker-item">
                  {item}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <section className="section stats-section">
        <div className="container">
          <div className="grid-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className="stat-card animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">How It Works</div>
            <h2 className="section-title">
              Three steps to continuous payments
            </h2>
          </div>
          <div className="steps-flow">
            {[
              {
                num: "01",
                title: "Deposit & Create",
                desc: "Choose a recipient, total PAS amount, and stream duration. Deposit native PAS to create your stream.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    <path d="M2 2l7.586 7.586" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                num: "02",
                title: "Watch It Flow",
                desc: "The contract calculates exactly how many tokens the recipient has earned. The balance counter ticks up every second.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                num: "03",
                title: "Withdraw Anytime",
                desc: "Recipients withdraw vested tokens whenever they want. Senders can cancel to reclaim unvested tokens instantly.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <path d="M1 10h22M14 14h4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((step, i) => (
              <div key={i} className={`step animate-fade-up delay-${(i + 1) * 200}`}>
                <div className="step-num">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {i < 2 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Features</div>
            <h2 className="section-title">Built for the Polkadot ecosystem</h2>
          </div>
          <div className="grid-3">
            {features.map((f, i) => (
              <div
                key={i}
                className={`feature-card card animate-fade-up delay-${100 + i * 100}`}
              >
                <div
                  className="feature-icon"
                  style={{ color: f.color, borderColor: `${f.color}25`, background: `${f.color}10` }}
                >
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Who uses Stream<span className="brand-accent">Pay</span>?</h2>
          </div>
          <div className="grid-3">
            {useCases.map((u, i) => (
              <div
                key={i}
                className={`usecase-card card animate-fade-up delay-${200 + i * 150}`}
              >
                <div className="uc-header">
                  <span className="uc-icon">{u.icon}</span>
                  <span className="badge badge-active">{u.tag}</span>
                </div>
                <h3 className="uc-title">{u.title}</h3>
                <p className="uc-desc">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card animate-fade-up">
            <div className="cta-glow" />
            <div className="cta-content">
              <div className="cta-tag">Get Started</div>
              <h2 className="cta-title">
                Start streaming payments today.
              </h2>
              <p className="cta-desc">
                Connect your wallet to Paseo Asset Hub and create your first stream in under 2 minutes.
              </p>
              <div className="cta-actions">
                <Link href="/create" className="btn-primary" style={{ fontSize: "1rem", padding: "16px 32px" }}>
                  Create a Stream
                  <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                    <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <a
                  href="https://faucet.polkadot.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: "1rem" }}
                >
                  Get Testnet Tokens
                </a>
              </div>
              <p className="cta-note">Powered by Polkadot Asset Hub</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing { position: relative; }

        .hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 60px 0 80px;
        }
        .hero-inner {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .hero-content { display: flex; flex-direction: column; gap: 28px; }
        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 100px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--accent-cyan);
          width: fit-content;
          letter-spacing: 0.04em;
        }
        .pill-dot {
          width: 6px; height: 6px;
          background: var(--accent-cyan);
          border-radius: 50%;
          animation: pulse-glow 2s infinite;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.8rem, 4.5vw, 4.2rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }
        .hero-desc {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 480px;
        }
        .hero-cta { display: flex; gap: 16px; flex-wrap: wrap; }

        .hero-counter-demo {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(6, 214, 160, 0.06);
          border: 1px solid rgba(6, 214, 160, 0.2);
          border-radius: var(--radius-md);
          flex-wrap: wrap;
        }
        .hcd-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .hcd-amount {
          display: flex;
          align-items: baseline;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 1.4rem;
          font-weight: 500;
          color: var(--accent-electric);
        }
        .hcd-symbol {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .hcd-sub {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        .hcd-indicator {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          background: rgba(6, 214, 160, 0.15);
          border-radius: 100px;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--accent-electric);
          letter-spacing: 0.1em;
        }
        .hcd-dot {
          width: 5px; height: 5px;
          background: var(--accent-electric);
          border-radius: 50%;
          animation: pulse-glow 1s infinite;
        }

        .hero-visual { position: relative; }
        .stat-float {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }
        .stat-float-1 { bottom: -20px; left: -30px; }
        .stat-float-2 { top: -20px; right: -20px; }
        .sf-value {
          font-family: var(--font-mono);
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        .sf-label { font-size: 0.7rem; color: var(--text-muted); }

        .ticker-section {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 16px 0;
          background: rgba(56, 189, 248, 0.02);
          overflow: hidden;
        }
        .ticker-item {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-secondary);
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        .stats-section { padding-top: 60px; padding-bottom: 60px; }
        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px;
          text-align: center;
          transition: border-color 0.25s;
        }
        .stat-card:hover { border-color: var(--border-bright); }
        .stat-value {
          font-family: var(--font-mono);
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--accent-cyan);
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .section-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .section-tag {
          display: inline-block;
          padding: 5px 16px;
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 100px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--accent-cyan);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.15;
        }

        .steps-flow {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          position: relative;
        }
        .step {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 36px 28px;
          position: relative;
          transition: border-color 0.25s;
        }
        .step:hover { border-color: var(--border-bright); }
        .step:first-child {
          border-radius: var(--radius-lg) 0 0 var(--radius-lg);
          border-right: none;
        }
        .step:nth-child(2) {
          border-radius: 0;
          border-right: none;
        }
        .step:last-child {
          border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
        }
        .step:only-child { border-radius: var(--radius-lg); border-right: 1px solid var(--border); }
        .step-num {
          font-family: var(--font-mono);
          font-size: 2.5rem;
          font-weight: 300;
          color: rgba(56, 189, 248, 0.2);
          position: absolute;
          top: 20px;
          right: 24px;
        }
        .step-icon { 
          margin-bottom: 16px; 
          color: var(--accent-cyan);
        }
        .step-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }
        .step-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.65;
        }
        .step-connector {
          position: absolute;
          right: -14px;
          top: 50%;
          width: 28px;
          height: 28px;
          background: var(--bg-card);
          border: 1px solid var(--border-bright);
          border-radius: 50%;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(-50%);
        }

        .feature-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .feature-icon {
          width: 48px; height: 48px;
          border-radius: 12px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .feature-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-primary);
        }
        .feature-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.65;
          flex: 1;
        }

        .usecase-card { padding: 28px; }
        .uc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .uc-icon { color: var(--text-secondary); }
        .uc-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text-primary);
          margin-bottom: 10px;
        }
        .uc-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.65;
        }

        .cta-section { padding: 100px 0 60px; }
        .cta-card {
          position: relative;
          background: var(--bg-card);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }
        .cta-glow {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, rgba(56,189,248,0.1), rgba(6,214,160,0.1), transparent);
          pointer-events: none;
          border-radius: inherit;
        }
        .cta-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
          padding: 72px 48px;
        }
        .cta-tag {
          display: inline-block;
          padding: 5px 16px;
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 100px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--accent-cyan);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .cta-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }
        .cta-desc {
          font-size: 1rem;
          color: var(--text-secondary);
          max-width: 500px;
          line-height: 1.7;
        }
        .cta-actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
        .cta-note {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        @media (max-width: 968px) {
          .hero-inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .steps-flow {
            grid-template-columns: 1fr;
          }
          .step, .step:not(:last-child), .step:not(:first-child) {
            border-radius: var(--radius-lg);
            border: 1px solid var(--border);
          }
          .step-connector { display: none; }
        }
      `}</style>
    </div>
  );
}
