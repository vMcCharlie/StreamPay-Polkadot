"use client";

import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { parseUnits } from "viem";
import { NATIVE_ASSETS } from "@/lib/assets";
import { useCreateStream } from "@/hooks/use-contract";
import { TxToast } from "@/components/tx-toast";
import Link from "next/link";
import { paseoAssetHub } from "@/lib/wagmi-config";

export default function CreateStreamPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(NATIVE_ASSETS[0]);
  const [duration, setDuration] = useState("30");
  const [curveType, setCurveType] = useState(0); // 0: Linear, 1: Exponential, 2: Sigmoid
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    create,
    isPending: isCreating,
    isConfirming: isConfirmingCreate,
    isSuccess: isCreated,
    error: createError,
    hash
  } = useCreateStream();

  const handleCreate = async () => {
    setLocalError(null);

    if (!recipient || !amount || !selectedAsset) return;
    if (chainId !== paseoAssetHub.id) {
      setLocalError("Wrong network. Switch your wallet to Paseo before creating a stream.");
      return;
    }

    if (address && recipient.toLowerCase() === address.toLowerCase()) {
      setLocalError("Recipient must be different from sender.");
      return;
    }

    const now = BigInt(Math.floor(Date.now() / 1000));
    const startTime = now + 90n;
    const stopTime = startTime + BigInt(parseInt(duration) * 86400);
    let depositAmount: bigint;

    try {
      depositAmount = parseUnits(amount, selectedAsset.decimals);
    } catch {
      setLocalError("Invalid amount format.");
      return;
    }

    if (depositAmount <= 0n) {
      setLocalError("Amount must be greater than zero.");
      return;
    }

    create(
      recipient as `0x${string}`,
      depositAmount,
      startTime,
      stopTime,
      curveType
    );
  };

  if (!isConnected) {
    return (
      <div className="container" style={{ paddingBottom: "100px" }}>
        <header className="page-header">
          <div className="page-title-group">
            <h1 className="page-title">Connect Wallet</h1>
            <p className="page-subtitle">Please connect your wallet to create a new payment stream.</p>
          </div>
        </header>

        <div className="form-container animate-fade-up">
          <div className="form-card card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'rgba(56, 189, 248, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'var(--accent-cyan)'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 12V8H6a2 2 0 01-2-2V5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 6V5a2 2 0 012-2h14v4h-2m2 10V12h-3a2 2 0 010 4h3z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 7v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Wallet Not Connected</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '320px', margin: '0 auto 32px' }}>
              To start streaming payments on Polkadot Asset Hub, you need to connect your wallet first.
            </p>
            <div className="form-actions" style={{ maxWidth: '280px', margin: '0 auto' }}>
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

  return (
    <div className="container" style={{ paddingBottom: "100px" }}>
      <header className="page-header">
        <div className="page-title-group">
          <Link href="/dashboard" className="back-link">
            ← Back to Dashboard
          </Link>
          <h1 className="page-title">Create Stream</h1>
          <p className="page-subtitle">Set up a continuous, real-time payment flow</p>
        </div>
      </header>

      <div className="form-container animate-fade-up">
        <div className="form-card card">
          <div className="guide-trigger" title="How to create a stream?">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="guide-popover">
              <h3>Create a Campaign</h3>
              <ol>
                <li><strong>Recipient:</strong> Enter the wallet address of the person/entity you want to pay.</li>
                <li><strong>Lock Amount:</strong> Decide total PAS to stream. These are locked in the contract.</li>
                <li><strong>Select Curve:</strong> Choose how funds unlock over time (Linear is fastest to start).</li>
                <li><strong>Start Streaming:</strong> Confirm transaction. Funds stay safe, recipient cleans them bit by bit.</li>
              </ol>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="label">Recipient Address</label>
              <input
                type="text"
                className="input-field font-mono"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div className="form-group flex-1">
              <label className="label">Amount to Lock</label>
              <div className="input-with-asset">
                <input
                  type="number"
                  className="input-field"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group flex-1">
              <label className="label">Asset</label>
              <div className="asset-pill">
                <span className="asset-dot" />
                <span>{selectedAsset.name}</span>
                <span className="asset-symbol">{selectedAsset.symbol}</span>
              </div>
            </div>

            <div className="form-group full-width">
              <label className="label">Streaming Curve (PVM Optimized)</label>
              <div className="curve-selector">
                <button
                  className={`curve-option ${curveType === 0 ? 'active' : ''}`}
                  onClick={() => setCurveType(0)}
                >
                  <div className="curve-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21L21 3" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="curve-info">
                    <span className="curve-name">Linear</span>
                    <span className="curve-desc">Standard constant flow</span>
                  </div>
                </button>
                <button
                  className={`curve-option ${curveType === 1 ? 'active' : ''}`}
                  onClick={() => setCurveType(1)}
                >
                  <div className="curve-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21C3 21 12 21 21 3" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="curve-info">
                    <span className="curve-name">Exponential</span>
                    <span className="curve-desc">Back-loaded vesting</span>
                  </div>
                </button>
                <button
                  className={`curve-option ${curveType === 2 ? 'active' : ''}`}
                  onClick={() => setCurveType(2)}
                >
                  <div className="curve-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21C12 21 12 3 21 3" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="curve-info">
                    <span className="curve-name">Sigmoid</span>
                    <span className="curve-desc">Phased distribution</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="form-group full-width">
              <label className="label">Stream Duration (Days)</label>
              <div className="duration-slider-container">
                <input
                  type="range"
                  min="1"
                  max="365"
                  className="slider"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <div className="duration-values">
                  <span className="duration-current">{duration} days</span>
                  <span className="duration-end">≈ {Math.floor(parseInt(duration) / 30)} months</span>
                </div>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-header">
              <span className="summary-title">Stream Summary</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2">
                <path d="M12 2v6M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="summary-list">
              <div className="summary-row">
                <span>Rate per day</span>
                <span className="summary-value">
                  {amount ? (parseFloat(amount) / parseInt(duration)).toFixed(6) : "0.00"} {selectedAsset.symbol}
                </span>
              </div>
              <div className="summary-row">
                <span>Rate per second</span>
                <span className="summary-value" style={{ color: curveType === 0 ? 'var(--text-primary)' : 'var(--accent-cyan)' }}>
                  {curveType === 0
                    ? (amount ? (parseFloat(amount) / (parseInt(duration) * 86400)).toFixed(9) : "0.000000000")
                    : curveType === 1 ? "Dynamic (Accelerating)" : "Dynamic (Phased)"}
                  {curveType === 0 && ` ${selectedAsset.symbol}`}
                </span>
              </div>
              <div className="summary-row">
                <span>Total deposit</span>
                <span className="summary-value">{amount || "0"} {selectedAsset.symbol}</span>
              </div>
              <div className="summary-row">
                <span>Ends on</span>
                <span className="summary-value">
                  {new Date(Date.now() + (parseInt(duration) * 86400 + 90) * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="network-note">
            Streams start ~90 seconds after submission to prevent timestamp race reverts.
          </div>

          <div className="form-actions">
            <button
              className="btn-primary full-width success-btn"
              onClick={handleCreate}
              disabled={isCreating || isConfirmingCreate || isCreated || !amount || !recipient}
              style={{ background: "var(--accent-electric)" }}
            >
              {isCreating || isConfirmingCreate ? "Creating..." : isCreated ? "Stream Created" : `Start Streaming ${selectedAsset.symbol}`}
            </button>

            {isCreated && (
              <Link href="/dashboard" className="btn-secondary full-width" style={{ textAlign: 'center', justifyContent: 'center' }}>
                Go to Dashboard
              </Link>
            )}
          </div>

          {(localError || createError) && (
            <div className="error-box animate-fade-in">
              {localError || (createError?.message.includes("User rejected") ? "Transaction rejected" : (createError?.message || "An error occurred"))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .back-link {
          display: inline-flex;
          align-items: center;
          color: var(--accent-cyan);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 12px;
          transition: all 0.2s;
        }
        .back-link:hover { opacity: 0.8; transform: translateX(-2px); }
        
        .form-container {
          max-width: 580px;
          margin: 0 auto;
        }
        
        .form-card {
          padding: 40px;
          position: relative;
        }
        
        .form-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .full-width { width: 100%; }
        .flex-1 { flex: 1; min-width: 200px; }
        
        .summary-card {
          background: rgba(56, 189, 248, 0.03);
          border: 1px solid rgba(56, 189, 248, 0.1);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin: 32px 0;
        }

        .asset-pill {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          color: var(--text-primary);
          font-size: 0.95rem;
          min-height: 48px;
        }
        .asset-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 10px var(--accent-cyan);
        }
        .asset-symbol {
          margin-left: auto;
          font-family: var(--font-mono);
          color: var(--accent-cyan);
          font-size: 0.85rem;
          font-weight: 600;
        }
        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .summary-title {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
        }
        .summary-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .summary-value {
          font-family: var(--font-mono);
          color: var(--text-primary);
          font-weight: 600;
        }
        
        .form-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .network-note {
          margin-bottom: 16px;
          font-size: 0.8rem;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.5;
        }
        
        .slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: var(--border);
          border-radius: 100px;
          outline: none;
          margin: 16px 0;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: var(--accent-cyan);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
          transition: all 0.2s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.6);
        }
        .duration-values {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .duration-current {
          color: var(--accent-cyan);
          font-weight: 600;
        }

        .curve-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          margin-top: 4px;
        }
        .curve-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .curve-option:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(56, 189, 248, 0.4);
        }
        .curve-option.active {
          background: rgba(56, 189, 248, 0.1);
          border-color: var(--accent-cyan);
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.1);
        }
        .curve-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          color: var(--text-muted);
          transition: all 0.2s;
        }
        .curve-option.active .curve-icon {
          background: var(--accent-cyan);
          color: #000;
        }
        .curve-info {
          display: flex;
          flex-direction: column;
        }
        .curve-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .curve-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .guide-trigger {
          position: absolute;
          top: 24px;
          right: 24px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .guide-trigger:hover { color: var(--accent-cyan); }
        .guide-popover {
          position: absolute;
          top: 40px;
          right: 0;
          width: 320px;
          background: #0d0d0f;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border: 1px solid var(--border-bright);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: 0 10px 60px rgba(0, 0, 0, 0.6);
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s;
          z-index: 100;
          pointer-events: none;
        }
        .guide-trigger:hover .guide-popover {
          opacity: 1;
          visibility: visible;
          transform: translateY(8px);
          pointer-events: all;
        }
        .guide-popover h3 {
          font-family: var(--font-display);
          font-size: 1.1rem;
          margin-bottom: 16px;
          color: var(--accent-cyan);
        }
        .guide-popover ol {
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .guide-popover li {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .guide-popover li strong { color: var(--text-primary); }
      `}</style>
      <TxToast
        hash={hash}
        isConfirming={isConfirmingCreate}
        isSuccess={isCreated}
        error={createError}
      />
    </div>
  );
}
