"use client";

import { use } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import {
  useStreamData,
  useStreamBalance,
  useWithdraw,
  useCancelStream
} from "@/hooks/use-contract";
import {
  getAssetByAddress,
  formatTokenAmount
} from "@/lib/assets";
import {
  getStreamProgress,
  getTimeRemaining,
  formatStreamRate,
  shortenAddress
} from "@/lib/contract";
import { TxToast } from "@/components/tx-toast";
import { useState, useEffect } from "react";

export default function StreamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const streamId = BigInt(id);
  const { address } = useAccount();

  const { data: streamData, isLoading: isLoadingData } = useStreamData(streamId);
  const { data: balanceData } = useStreamBalance(streamId);

  const {
    withdraw,
    isPending: isWithdrawing,
    isSuccess: isWithdrawn,
    hash: withdrawHash,
    error: withdrawError,
    isConfirming: isConfirmingWithdraw
  } = useWithdraw();

  const {
    cancel,
    isPending: isCancelling,
    isSuccess: isCancelled,
    hash: cancelHash,
    error: cancelError,
    isConfirming: isConfirmingCancel
  } = useCancelStream();

  const [sender, recipient, token, deposit, withdrawnCount, startTime, stopTime, active] =
    (streamData as [`0x${string}`, `0x${string}`, `0x${string}`, bigint, bigint, bigint, bigint, boolean]) || [null, null, null, 0n, 0n, 0n, 0n, false];

  const asset = getAssetByAddress(token || "");
  const decimals = asset?.decimals ?? 18;
  const recipientBal = balanceData ? (balanceData as [bigint, bigint])[0] : 0n;
  const senderBal = balanceData ? (balanceData as [bigint, bigint])[1] : 0n;

  const progress = getStreamProgress(startTime, stopTime);
  const timeLeft = getTimeRemaining(stopTime);
  const ratePerDay = formatStreamRate(deposit, startTime, stopTime, decimals);

  const isSender = address?.toLowerCase() === sender?.toLowerCase();
  const isRecipient = address?.toLowerCase() === recipient?.toLowerCase();

  const [displayed, setDisplayed] = useState(recipientBal);
  useEffect(() => {
    setDisplayed(recipientBal);
  }, [recipientBal]);

  useEffect(() => {
    if (!active || !streamData) return;
    const now = BigInt(Math.floor(Date.now() / 1000));
    if (now <= startTime || now >= stopTime) return;

    const duration = (stopTime as bigint) - (startTime as bigint);
    const perSecond = (deposit as bigint) / (duration > 0n ? duration : 1n);

    const interval = setInterval(() => {
      setDisplayed(prev => (prev as bigint) + (perSecond / 10n));
    }, 100);
    return () => clearInterval(interval);
  }, [active, startTime, stopTime, deposit, streamData]);

  if (isLoadingData) {
    return (
      <div className="container" style={{ paddingTop: "100px", textAlign: "center" }}>
        <div className="animate-spin-slow" style={{ color: 'var(--text-muted)', fontSize: '2rem' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="3s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
        <p style={{ marginTop: 20, color: 'var(--text-muted)' }}>Loading stream details...</p>
      </div>
    );
  }

  if (!sender) {
    return (
      <div className="container" style={{ paddingTop: "100px", textAlign: "center" }}>
        <h1 className="form-title">Stream Not Found</h1>
        <Link href="/dashboard" className="btn-secondary" style={{ marginTop: 20 }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "48px", paddingBottom: "100px" }}>
      <div className="detail-layout">
        <div className="detail-main animate-fade-up">
          <div className="back-nav">
            <Link href="/" className="back-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Dashboard
            </Link>
            <div className="stream-badge-group">
              <span className={`badge ${active ? 'badge-active' : 'badge-ended'}`}>
                {active ? 'Active' : 'Completed'}
              </span>
              <span className="id-badge">#{id}</span>
            </div>
          </div>

          <div className="counter-hero card">
            <div className="ch-label">Claimable Balance</div>
            <div className="ch-main">
              <span className="ch-amount">
                {formatTokenAmount(displayed, decimals)}
              </span>
              <span className="ch-symbol">{asset?.symbol ?? "PAS"}</span>
            </div>
            <div className="ch-rate">
              Streaming <span className="rate-val">{ratePerDay} {asset?.symbol ?? "PAS"}</span> per day
            </div>

            <div className="ch-progress">
              <div className="stream-bar" style={{ height: 8 }}>
                <div className="stream-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="ch-progress-meta">
                <span>{progress.toFixed(2)}% Streamed</span>
                <span>{timeLeft}</span>
              </div>
            </div>
          </div>

          <div className="parties-grid">
            <div className="party-card card">
              <div className="pc-label">Sender</div>
              <div className="pc-addr">{shortenAddress(sender)}</div>
              {isSender && <span className="pc-tag">You</span>}
              <div className="pc-bal-box">
                <span className="pc-bal-label">Remaining</span>
                <span className="pc-bal-val">
                  {formatTokenAmount(senderBal, decimals)} {asset?.symbol ?? "PAS"}
                </span>
              </div>
            </div>
            <div className="pc-arrow">→</div>
            <div className="party-card card">
              <div className="pc-label">Recipient</div>
              <div className="pc-addr">{shortenAddress(recipient)}</div>
              {isRecipient && <span className="pc-tag">You</span>}
              <div className="pc-bal-box">
                <span className="pc-bal-label">Accumulated</span>
                <span className="pc-bal-val">
                  {formatTokenAmount(displayed + withdrawnCount, decimals)} {asset?.symbol ?? "PAS"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-side animate-fade-up delay-200">
          <div className="action-card card">
            <h3 className="ac-title">Stream Actions</h3>

            {isRecipient && active && (
              <div className="action-section">
                <p className="ac-desc">Withdraw your earned tokens to your wallet instantly.</p>
                <button
                  className="btn-primary full-width"
                  onClick={() => withdraw(streamId)}
                  disabled={isWithdrawing || recipientBal === 0n}
                >
                  {isWithdrawing ? "Withdrawing..." : "Withdraw Funds"}
                </button>

                <div className="claim-guide">
                  <div className="cg-header">How to Claim:</div>
                  <div className="cg-step"><span>1</span> <strong>Monitor:</strong> Watch claimable balance grow.</div>
                  <div className="cg-step"><span>2</span> <strong>Withdraw:</strong> Click the button above.</div>
                  <div className="cg-step"><span>3</span> <strong>Confirm:</strong> Approve in your wallet.</div>
                </div>
              </div>
            )}

            {isSender && active && (
              <div className="action-section">
                <div className="divider" />
                <p className="ac-desc">Cancel the stream. Unvested funds return to you, vested funds to the recipient.</p>
                <button
                  className="btn-danger full-width"
                  onClick={() => cancel(streamId)}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Stream"}
                </button>
              </div>
            )}

            {!isSender && !isRecipient && (
              <p className="ac-desc" style={{ textAlign: 'center' }}>
                You are viewing this stream in read-only mode.
              </p>
            )}

            {!active && (
              <div className="ended-notice">
                <div className="en-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="en-text">This stream has ended.</div>
              </div>
            )}
          </div>

          <div className="info-card card">
            <h3 className="ac-title">Stream Details</h3>
            <div className="info-list">
              <div className="info-item">
                <span>Total Deposit</span>
                <span>{formatTokenAmount(deposit, decimals)} {asset?.symbol ?? "PAS"}</span>
              </div>
              <div className="info-item">
                <span>Withdrawn</span>
                <span>{formatTokenAmount(withdrawnCount, decimals)} {asset?.symbol ?? "PAS"}</span>
              </div>
              <div className="info-item">
                <span>Start Time</span>
                <span>{new Date(Number(startTime) * 1000).toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span>Stop Time</span>
                <span>{new Date(Number(stopTime) * 1000).toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span>Asset</span>
                <span className="asset-link">{asset?.name ?? "Paseo"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
          align-items: start;
        }
        
        .back-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          padding: 8px 16px 8px 12px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .back-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateX(-2px);
        }
        .stream-badge-group {
          display: flex;
          gap: 8px;
        }
        .id-badge {
          padding: 4px 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: 6px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .counter-hero {
          padding: 48px;
          text-align: center;
          background: radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.08), transparent 70%);
          margin-bottom: 32px;
        }
        .ch-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }
        .ch-main {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .ch-amount {
          font-family: var(--font-mono);
          font-size: 3.5rem;
          font-weight: 500;
          color: var(--accent-electric);
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .ch-symbol {
          font-size: 1.2rem;
          color: var(--text-secondary);
          font-family: var(--font-mono);
        }
        .ch-rate {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 40px;
        }
        .rate-val { color: var(--accent-cyan); font-weight: 600; }
        
        .ch-progress-meta {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .parties-grid {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .party-card {
          flex: 1;
          padding: 24px;
          position: relative;
        }
        .pc-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }
        .pc-addr {
          font-family: var(--font-mono);
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: 16px;
        }
        .pc-tag {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 2px 8px;
          background: rgba(56, 189, 248, 0.1);
          color: var(--accent-cyan);
          font-size: 0.65rem;
          font-weight: 700;
          border-radius: 4px;
        }
        .pc-bal-box {
          border-top: 1px solid var(--border);
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pc-bal-label { font-size: 0.7rem; color: var(--text-muted); }
        .pc-bal-val { font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); }
        .pc-arrow { color: var(--text-muted); font-size: 1.5rem; flex-shrink: 0; }

        .ac-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .ac-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .action-card { padding: 28px; margin-bottom: 24px; }
        .action-section { }
        .divider { height: 1px; background: var(--border); margin: 24px 0; }
        .full-width { width: 100%; }
        
        .ended-notice {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 20px;
          background: rgba(255,255,255,0.03);
          border-radius: var(--radius-md);
        }
        .en-icon { 
          color: var(--text-muted);
          font-size: 1.5rem; 
        }
        .en-text { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }

        .info-card { padding: 28px; }
        .info-list { display: flex; flex-direction: column; gap: 16px; }
        .info-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
        }
        .info-item span:first-child { color: var(--text-muted); }
        .info-item span:last-child { color: var(--text-secondary); font-family: var(--font-mono); text-align: right; }
        .asset-link { color: var(--accent-cyan) !important; }

        .claim-guide {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px dashed var(--border);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cg-header {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent-cyan);
          margin-bottom: 4px;
        }
        .cg-step {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .cg-step span {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(56, 189, 248, 0.1);
          color: var(--accent-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .cg-step strong { color: var(--text-primary); margin-right: 4px; }

        @media (max-width: 968px) {
          .detail-layout { grid-template-columns: 1fr; }
          .pc-arrow { transform: rotate(90deg); margin: 10px 0; }
          .parties-grid { flex-direction: column; }
          .party-card { width: 100%; }
        }
      `}</style>
      <TxToast
        hash={withdrawHash || cancelHash}
        isConfirming={isConfirmingWithdraw || isConfirmingCancel}
        isSuccess={isWithdrawn || isCancelled}
        error={withdrawError || cancelError}
      />
    </div>
  );
}
