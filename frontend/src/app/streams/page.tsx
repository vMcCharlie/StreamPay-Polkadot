"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { useOutgoingStreams, useIncomingStreams, useStreamData } from "@/hooks/use-contract";
import { StreamCard } from "@/components/stream-card";

export default function MyStreamsPage() {
  const { address, isConnected } = useAccount();
  const [filter, setFilter] = useState<"all" | "incoming" | "outgoing">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "ended">("all");

  const { data: outgoingIds } = useOutgoingStreams(address);
  const { data: incomingIds } = useIncomingStreams(address);

  if (!isConnected) {
    return (
      <div className="container" style={{ paddingBottom: "100px" }}>
        <header className="page-header">
          <div className="page-title-group">
            <h1 className="page-title">Connect Wallet</h1>
            <p className="page-subtitle">Please connect your wallet to view your stream history.</p>
          </div>
        </header>

        <div className="form-container animate-fade-up">
          <div className="form-card card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(56, 189, 248, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'var(--accent-cyan)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 12V8H6a2 2 0 01-2-2V5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 6V5a2 2 0 012-2h14v4h-2m2 10V12h-3a2 2 0 010 4h3z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 7v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Wallet Not Connected</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '320px', margin: '0 auto 24px' }}>
              To view your stream history on Polkadot Asset Hub, you need to connect your wallet first.
            </p>
            <div className="form-actions" style={{ maxWidth: '240px', margin: '0 auto' }}>
              <button
                onClick={() => (window as any).ethereum?.request({ method: 'eth_requestAccounts' })}
                className="btn-primary full-width"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allIncoming = (incomingIds as bigint[] | undefined) || [];
  const allOutgoing = (outgoingIds as bigint[] | undefined) || [];

  return (
    <div className="container" style={{ paddingBottom: "100px" }}>
      <header className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Stream History</h1>
          <p className="page-subtitle">Track every payment you&apos;ve sent or received</p>
        </div>
      </header>

      <div className="filters-bar card">
        <div className="filter-group">
          <span className="filter-label">Direction</span>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'incoming' ? 'active' : ''}`}
              onClick={() => setFilter('incoming')}
            >
              Incoming
            </button>
            <button
              className={`filter-btn ${filter === 'outgoing' ? 'active' : ''}`}
              onClick={() => setFilter('outgoing')}
            >
              Outgoing
            </button>
          </div>
        </div>

        <div className="filter-sep" />

        <div className="filter-group">
          <span className="filter-label">Status</span>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${statusFilter === 'ended' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ended')}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      <div className="streams-list">
        {filter !== 'outgoing' && allIncoming.length > 0 && (
          <div className="list-section">
            <h2 className="section-label">Incoming Streams</h2>
            <div className="grid-2">
              {allIncoming.map(id => (
                <StreamListItem key={`in-${id}`} id={id} userAddress={address} statusFilter={statusFilter} />
              ))}
            </div>
          </div>
        )}

        {filter !== 'incoming' && allOutgoing.length > 0 && (
          <div className="list-section" style={{ marginTop: 48 }}>
            <h2 className="section-label">Outgoing Streams</h2>
            <div className="grid-2">
              {allOutgoing.map(id => (
                <StreamListItem key={`out-${id}`} id={id} userAddress={address} statusFilter={statusFilter} />
              ))}
            </div>
          </div>
        )}

        {allIncoming.length === 0 && allOutgoing.length === 0 && (
          <div className="empty-box animate-fade-up">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2v6M12 18v4M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h4M18 12h4M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="empty-title">No streams found</div>
            <p className="empty-subtitle">No streams found matching your filters.</p>
            <Link href="/create" className="btn-secondary" style={{ marginTop: "24px" }}>Create a Stream</Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .filters-bar {
          display: flex;
          align-items: center;
          padding: 24px 32px;
          gap: 40px;
          margin-bottom: 48px;
        }
        .filter-group { display: flex; align-items: center; gap: 20px; }
        .filter-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          font-weight: 700;
        }
        .filter-buttons {
          display: flex;
          background: rgba(255,255,255,0.03);
          padding: 4px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }
        .filter-btn {
          padding: 8px 20px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn:hover { color: var(--text-primary); }
        .filter-btn.active {
          background: var(--bg-card-hover);
          color: var(--accent-cyan);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .filter-sep { width: 1px; height: 40px; background: var(--border); }
        
        .section-label {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 32px;
          padding-left: 12px;
          border-left: 3px solid var(--accent-cyan);
        }
      `}</style>
    </div>
  );
}

function StreamListItem({
  id,
  userAddress,
  statusFilter
}: {
  id: bigint;
  userAddress: `0x${string}` | undefined;
  statusFilter: "all" | "active" | "ended";
}) {
  const { data } = useStreamData(id);
  if (!data) return null;
  const [sender, recipient, token, deposit, withdrawn, startTime, stopTime, active] =
    data as [`0x${string}`, `0x${string}`, `0x${string}`, bigint, bigint, bigint, bigint, boolean];

  if (statusFilter === 'active' && !active) return null;
  if (statusFilter === 'ended' && active) return null;

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
      active={active}
      userAddress={userAddress}
    />
  );
}
