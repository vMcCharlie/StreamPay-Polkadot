"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAssetByAddress,
  formatTokenAmount,
} from "@/lib/assets";
import {
  getStreamProgress,
  getTimeRemaining,
  formatStreamRate,
  shortenAddress,
} from "@/lib/contract";
import { useStreamBalance } from "@/hooks/use-contract";

interface StreamCardProps {
  id: bigint;
  sender: `0x${string}`;
  recipient: `0x${string}`;
  token: `0x${string}`;
  deposit: bigint;
  withdrawn: bigint;
  startTime: bigint;
  stopTime: bigint;
  curveType: number;
  active: boolean;
  userAddress?: `0x${string}`;
}

export function StreamCard({
  id,
  sender,
  recipient,
  token,
  deposit,
  startTime,
  stopTime,
  curveType,
  active,
  userAddress,
}: StreamCardProps) {
  const asset = getAssetByAddress(token);
  const decimals = asset?.decimals ?? 18;

  const { data: balanceData } = useStreamBalance(id);
  const recipientBal = balanceData ? (balanceData as [bigint, bigint])[0] : 0n;

  const progress = getStreamProgress(startTime, stopTime);
  const timeLeft = getTimeRemaining(stopTime);
  const ratePerDay = formatStreamRate(deposit, startTime, stopTime, decimals);

  const isOutgoing = userAddress?.toLowerCase() === sender.toLowerCase();
  const isIncoming = userAddress?.toLowerCase() === recipient.toLowerCase();

  const [displayed, setDisplayed] = useState(recipientBal);
  useEffect(() => {
    setDisplayed(recipientBal);
  }, [recipientBal]);
  useEffect(() => {
    if (!active) return;
    const now = BigInt(Math.floor(Date.now() / 1000));
    if (now <= startTime || now >= stopTime) return;
    const duration = stopTime - startTime;
    const perSecond = deposit / duration;
    if (perSecond === 0n) return;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + perSecond / 10n);
    }, 100);
    return () => clearInterval(interval);
  }, [active, startTime, stopTime, deposit]);

  return (
    <Link href={`/stream/${id.toString()}`} className="stream-card-link">
      <div className={`card stream-card ${active ? "stream-card-active" : "stream-card-ended"}`}>
        <div className="sc-header">
          <div className="sc-id">
            <span className="sc-id-label">Stream</span>
            <span className="sc-id-num">#{id.toString()}</span>
          </div>
          <div className="sc-badges">
            {isOutgoing && (
              <span className="badge badge-pending">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Sending
              </span>
            )}
            {isIncoming && (
              <span className="badge badge-active">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Receiving
              </span>
            )}
            <span className={`badge ${active ? "badge-active" : "badge-ended"}`}>
              <span className={`badge-dot ${active ? "badge-dot-live" : ""}`} />
              {active ? "Live" : "Ended"}
            </span>
            <span className="badge badge-pending" style={{ background: 'rgba(167, 139, 250, 0.1)', color: 'var(--accent-violet)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
              {curveType === 0 ? 'Linear' : curveType === 1 ? 'Exponential' : 'Sigmoid'}
            </span>
          </div>
        </div>

        <div className="sc-counter-section">
          <div className="sc-counter-label">Earned so far</div>
          <div className="sc-counter">
            <span className="sc-amount">
              {formatTokenAmount(displayed, decimals)}
            </span>
            <span className="sc-symbol">{asset?.symbol ?? "PAS"}</span>
          </div>
          {isIncoming && active && (
            <div className="sc-claim-hint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Click to see claim guide
            </div>
          )}
          <div className="sc-rate">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 6l-9.5 9.5-5-5L1 18" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 6h6v6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {ratePerDay} / day
          </div>
        </div>

        <div className="sc-progress-section">
          <div className="stream-bar">
            <div
              className="stream-bar-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="sc-progress-labels">
            <span>{progress.toFixed(1)}% streamed</span>
            <span>{timeLeft}</span>
          </div>
        </div>

        <div className="sc-footer">
          <div className="sc-party">
            <span className="sc-party-label">From</span>
            <span className="sc-party-addr">{shortenAddress(sender)}</span>
          </div>
          <div className="sc-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="sc-party">
            <span className="sc-party-label">To</span>
            <span className="sc-party-addr">{shortenAddress(recipient)}</span>
          </div>
          <div className="sc-total">
            <span className="sc-party-label">Total</span>
            <span className="sc-total-amount">
              {formatTokenAmount(deposit, decimals)} {asset?.symbol ?? "PAS"}
            </span>
          </div>
        </div>

        <style jsx>{`
          .stream-card-link { text-decoration: none; display: block; }
          .stream-card {
            padding: 24px;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          
          .stream-card-active {
            border-color: rgba(34, 211, 238, 0.1);
          }
          
          .stream-card-ended {
            opacity: 0.6;
            filter: grayscale(0.5);
          }

          .sc-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            z-index: 1;
          }
          .sc-id { display: flex; align-items: baseline; gap: 6px; }
          .sc-id-label {
            font-size: 0.7rem;
            color: var(--text-muted);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .sc-id-num {
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--text-secondary);
          }
          .sc-badges { display: flex; gap: 8px; align-items: center; }
          .badge-dot {
            width: 6px; height: 6px;
            border-radius: 50%;
            background: currentColor;
            display: inline-block;
          }
          .badge-dot-live { animation: pulse-glow 2s infinite; box-shadow: 0 0 8px currentColor; }

          .sc-counter-section { position: relative; z-index: 1; }
          .sc-counter-label {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-bottom: 8px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }
          .sc-counter {
            display: flex;
            align-items: baseline;
            gap: 8px;
            margin-bottom: 4px;
          }
          .sc-amount {
            font-family: var(--font-mono);
            font-size: 2.25rem;
            font-weight: 500;
            color: var(--text-primary);
            letter-spacing: -0.03em;
            line-height: 1;
          }
          .sc-symbol {
            font-family: var(--font-mono);
            font-size: 1rem;
            color: var(--text-secondary);
            font-weight: 500;
          }
          .sc-rate {
            font-size: 0.75rem;
            color: var(--accent-cyan);
            font-family: var(--font-mono);
            display: flex;
            align-items: center;
            gap: 6px;
            opacity: 0.8;
            margin-top: 4px;
          }
          .sc-claim-hint {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.7rem;
            color: var(--accent-cyan);
            background: rgba(56, 189, 248, 0.05);
            padding: 2px 8px;
            border-radius: 4px;
            margin-bottom: 8px;
            font-weight: 500;
          }

          .sc-progress-section { position: relative; z-index: 1; }
          .sc-progress-labels {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 0.75rem;
            color: var(--text-muted);
            font-family: var(--font-mono);
          }

          .sc-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            z-index: 1;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.04);
          }
          .sc-party { display: flex; flex-direction: column; gap: 6px; }
          .sc-party-label {
            font-size: 0.65rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .sc-party-addr {
            font-family: var(--font-mono);
            font-size: 0.8rem;
            color: var(--text-secondary);
            background: rgba(255, 255, 255, 0.03);
            padding: 4px 10px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            white-space: nowrap;
          }
          .sc-arrow {
            color: var(--text-muted);
            opacity: 0.3;
            display: flex;
            align-items: center;
            margin: 0 12px;
          }
          .sc-total { text-align: right; }
          .sc-total-amount {
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--text-primary);
            font-weight: 600;
          }
        `}</style>
      </div>
    </Link>
  );
}
