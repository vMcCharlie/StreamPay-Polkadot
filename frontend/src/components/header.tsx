"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { shortenAddress } from "@/lib/contract";

export function Header() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/create", label: "New Stream" },
    { href: "/streams", label: "History" },
  ];

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link
            href="/"
            className="logo"
            onClick={() => setMobileOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span
              className="logo-text"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                lineHeight: '1',
              }}
            >
              Stream<span className="brand-accent" style={{ display: 'inline' }}>Pay</span>
            </span>
          </Link>

          <nav className="nav" aria-label="Primary navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                  style={{ position: 'relative' }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="nav-active-indicator"
                      style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: '12px',
                        right: '12px',
                        height: '2px',
                        background: 'var(--accent-cyan)',
                        borderRadius: '10px',
                        boxShadow: '0 0 10px rgba(56, 189, 248, 0.4)',
                        display: 'block'
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="header-right">
            {isConnected && address ? (
              <div className="wallet-cluster desktop-only">
                <span className="wallet-address">{shortenAddress(address)}</span>
                <button onClick={() => disconnect()} className="btn-started" type="button">
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => connect({ connector: injected() })}
                className="btn-started desktop-only"
                type="button"
              >
                Connect Wallet
              </button>
            )}

            <button
              className="menu-btn mobile-only"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              type="button"
            >
              {mobileOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer-backdrop ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(false)} />
      <aside className={`drawer ${mobileOpen ? "open" : ""}`} aria-hidden={!mobileOpen}>
        <div className="drawer-head">
          <span className="drawer-title">Menu</span>
          <button className="menu-btn" onClick={() => setMobileOpen(false)} type="button" aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <nav className="drawer-nav" aria-label="Mobile navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`drawer-link ${isActive ? "drawer-link-active" : ""}`}
                onClick={() => setMobileOpen(false)}
                style={{ position: 'relative' }}
              >
                {link.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '20px',
                      right: '20px',
                      height: '2px',
                      background: 'var(--accent-cyan)',
                      borderRadius: '10px',
                      boxShadow: '0 0 10px rgba(56, 189, 248, 0.4)',
                      display: 'block'
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="drawer-footer">
          {isConnected && address ? (
            <div className="drawer-wallet">
              <span className="wallet-address">{shortenAddress(address)}</span>
              <button
                onClick={() => {
                  disconnect();
                  setMobileOpen(false);
                }}
                className="btn-started"
                type="button"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                connect({ connector: injected() });
                setMobileOpen(false);
              }}
              className="btn-started"
              style={{ width: "100%", justifyContent: "center" }}
              type="button"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </aside>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 120;
          background: rgba(9, 9, 11, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          height: 80px;
          display: flex;
          align-items: center;
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0 48px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
        }
        .logo {
          text-decoration: none;
          flex-shrink: 0;
          white-space: nowrap;
          transition: transform 0.2s ease;
        }
        .logo svg {
          filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.3));
        }
        .logo:hover {
          transform: translateY(-1px);
        }
        .logo-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
        }
        .logo-text {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.03em;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 32px;
          background: rgba(255, 255, 255, 0.03);
          padding: 6px 24px;
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          position: relative;
        }
        .nav-link:hover {
          color: var(--text-primary);
        }
        .nav-link.nav-link-active {
          color: var(--text-primary);
          font-weight: 600;
        }
        .nav-link.nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 12px;
          right: 12px;
          height: 2px;
          background: var(--accent-cyan);
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .btn-started {
          background: var(--text-primary);
          color: var(--bg-base);
          font-weight: 600;
          font-size: 0.9rem;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-started:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .wallet-cluster {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .wallet-address {
          font-family: var(--font-mono);
          font-size: 0.825rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          padding: 10px 16px;
          border-radius: 8px;
        }

        .menu-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-primary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .desktop-only {
          display: flex;
        }
        .mobile-only {
          display: none;
        }

        .drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 130;
        }
        .drawer-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }
        .drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 320px;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background: var(--bg-base);
          border-left: 1px solid var(--border);
          z-index: 131;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          box-shadow: -20px 0 40px rgba(0,0,0,0.3);
        }
        .drawer.open {
          transform: translateX(0);
        }
        .drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .drawer-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .drawer-link {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          padding: 12px 16px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .drawer-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }
        .drawer-link-active {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.08);
          font-weight: 600;
        }
        .drawer-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .drawer-wallet {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (max-width: 1024px) {
          .nav {
            display: none;
          }
          .desktop-only {
            display: none;
          }
          .mobile-only {
            display: flex;
          }
          .header-inner {
            padding: 0 24px;
          }
        }
      `}</style>
    </>
  );
}
