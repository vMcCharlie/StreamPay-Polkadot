"use client";

import { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import Link from "next/link";
import { useIncomingStreams, useOutgoingStreams, useStreamData } from "@/hooks/use-contract";
import { StreamCard } from "@/components/stream-card";

function ConnectPrompt() {
  const { connect } = useConnect();

  return (
    <div className="connect-prompt">
      <div className="cp-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="cp-title">Connect your wallet</h2>
      <p className="cp-desc">Connect your wallet to view and manage your PAS streams.</p>
      <button
        onClick={() => connect({ connector: injected() })}
        className="btn-primary"
        style={{ fontSize: "1rem", padding: "14px 28px" }}
      >
        Connect Wallet
      </button>

      <style jsx>{`
        .connect-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 18px;
          padding: 72px 32px;
          background: var(--bg-card);
          border: 1px dashed var(--border-bright);
          border-radius: var(--radius-xl);
          max-width: 520px;
          margin: 0 auto;
        }
        .cp-icon {
          color: var(--text-muted);
        }
        .cp-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .cp-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 420px;
        }
      `}</style>
    </div>
  );
}

function StreamListItem({
  id,
  userAddress,
}: {
  id: bigint;
  userAddress: `0x${string}` | undefined;
}) {
  const { data } = useStreamData(id);
  if (!data) return null;

  const [sender, recipient, token, deposit, withdrawn, startTime, stopTime, curveType, active] =
    data as [`0x${string}`, `0x${string}`, `0x${string}`, bigint, bigint, bigint, bigint, number, boolean];

  return (
    <StreamCard
      id={id}
      sender={sender}
      recipient={recipient}
      token={token}
      deposit={deposit}
      withdrawn={withdrawn}
      startTime={startTime}
      stopTime={stopTime}
      curveType={curveType}
      active={active}
      userAddress={userAddress}
    />
  );
}

function StreamList({
  ids,
  userAddress,
  emptyMessage,
}: {
  ids: bigint[] | undefined;
  userAddress: `0x${string}` | undefined;
  emptyMessage: string;
}) {
  if (!ids || ids.length === 0) {
    return (
      <div className="empty-box animate-fade-up">
        <div className="empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 12a2 2 0 100 4 2 2 0 000-4z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="empty-title">No streams yet</div>
        <p className="empty-subtitle">{emptyMessage}</p>
        <Link href="/create" className="btn-secondary" style={{ marginTop: "24px" }}>
          Create a Stream
        </Link>
      </div>
    );
  }

  return (
    <div className="grid-2">
      {ids.map((id) => (
        <StreamListItem key={id.toString()} id={id} userAddress={userAddress} />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming");

  const { data: outgoingIds } = useOutgoingStreams(address);
  const { data: incomingIds } = useIncomingStreams(address);

  const totalStreams =
    ((outgoingIds as bigint[] | undefined)?.length ?? 0) +
    ((incomingIds as bigint[] | undefined)?.length ?? 0);

  return (
    <div className="container" style={{ paddingBottom: "100px" }}>
      <header className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your real-time PAS payment streams</p>
        </div>
        <Link href="/create" className="btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          New Stream
        </Link>
      </header>

      {isConnected && (
        <div className="dash-stats card">
          <div className="ds-item">
            <span className="ds-label">Incoming</span>
            <span className="ds-val">{(incomingIds as bigint[] | undefined)?.length ?? 0}</span>
          </div>
          <div className="ds-sep" />
          <div className="ds-item">
            <span className="ds-label">Outgoing</span>
            <span className="ds-val">{(outgoingIds as bigint[] | undefined)?.length ?? 0}</span>
          </div>
          <div className="ds-sep" />
          <div className="ds-item">
            <span className="ds-label">Total Streams</span>
            <span className="ds-val">{totalStreams}</span>
          </div>
        </div>
      )}

      {!isConnected ? (
        <ConnectPrompt />
      ) : (
        <>
          <div className="tabs">
            <button
              className={`tab ${activeTab === "incoming" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("incoming")}
            >
              Incoming
              {(incomingIds as bigint[] | undefined)?.length ? (
                <span className="tab-count">{(incomingIds as bigint[] | undefined)!.length}</span>
              ) : null}
            </button>

            <button
              className={`tab ${activeTab === "outgoing" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("outgoing")}
            >
              Outgoing
              {(outgoingIds as bigint[] | undefined)?.length ? (
                <span className="tab-count">{(outgoingIds as bigint[] | undefined)!.length}</span>
              ) : null}
            </button>
          </div>

          <StreamList
            ids={activeTab === "incoming" ? (incomingIds as bigint[] | undefined) : (outgoingIds as bigint[] | undefined)}
            userAddress={address}
            emptyMessage={
              activeTab === "incoming"
                ? "No incoming streams yet. Ask someone to stream PAS to your wallet."
                : "No outgoing streams yet. Create your first PAS stream."
            }
          />
        </>
      )}

      <style jsx>{`
        .dash-stats {
          display: flex;
          align-items: center;
          gap: 48px;
          padding: 32px 40px;
          margin-bottom: 48px;
        }
        .ds-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ds-val {
          font-family: var(--font-mono);
          font-size: 2rem;
          font-weight: 500;
          color: var(--text-primary);
          line-height: 1;
        }
        .ds-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
        }
        .ds-sep {
          width: 1px;
          height: 48px;
          background: var(--border);
        }

        .tabs {
          display: flex;
          gap: 32px;
          margin-bottom: 32px;
          border-bottom: 1px solid var(--border);
          padding-left: 8px;
        }
        .tab {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 4px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: all 0.2s;
          position: relative;
        }
        .tab:hover {
          color: var(--text-primary);
        }
        .tab-active {
          color: var(--text-primary);
          font-weight: 600;
        }
        .tab-active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--accent-violet);
          box-shadow: 0 0 10px rgba(167, 139, 250, 0.3);
        }
        .tab-count {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 6px;
        }
        .tab-active .tab-count {
          background: rgba(167, 139, 250, 0.1);
          color: var(--accent-violet);
        }
      `}</style>
    </div>
  );
}
