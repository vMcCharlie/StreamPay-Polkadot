"use client";

import { useEffect, useState } from "react";

export function TxToast({ hash, isConfirming, isSuccess, error }: {
  hash?: string;
  isConfirming: boolean;
  isSuccess: boolean;
  error?: Error | null;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hash || isConfirming || isSuccess || error) {
      setVisible(true);
      if (isSuccess || error) {
        const timer = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [hash, isConfirming, isSuccess, error]);

  if (!visible) return null;

  return (
    <div className="tx-toast animate-fade-up">
      <div className="toast-content">
        <div className={`toast-icon ${isSuccess ? 'success' : error ? 'error' : 'pending'}`}>
          {isSuccess ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : error ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <div className="spinner-sm" />
          )}
        </div>
        <div className="toast-body">
          <div className="toast-title">
            {isConfirming ? "Transaction Pending" :
              isSuccess ? "Transaction Confirmed" :
                error ? "Transaction Failed" : "Transaction Sent"}
          </div>
          {hash && (
            <a
              href={`https://assethub-paseo.subscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="toast-link"
            >
              View on Explorer
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          )}
          {error && <div className="toast-err-msg">{error.message.slice(0, 40)}...</div>}
        </div>
        <button className="toast-close" onClick={() => setVisible(false)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <style jsx>{`
        .tx-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          width: 320px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        .toast-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
        }
        .toast-icon {
          width: 28px; height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .toast-icon.pending {
          background: rgba(34, 211, 238, 0.12);
          color: var(--accent-cyan);
        }
        .toast-icon.success {
          background: rgba(52, 211, 153, 0.12);
          color: var(--accent-electric);
        }
        .toast-icon.error {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
        }
        .spinner-sm {
          width: 14px;
          height: 14px;
          border: 2px solid var(--border);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin-slow 1s linear infinite;
        }
        .toast-body { flex: 1; display: flex; flex-direction: column; gap: 3px; }
        .toast-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-primary);
        }
        .toast-link {
          font-size: 0.7rem;
          color: var(--accent-cyan);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .toast-link:hover {
          text-decoration: underline;
        }
        .toast-err-msg { 
          font-size: 0.65rem; 
          color: #ef4444; 
          margin-top: 2px;
        }
        .toast-close {
          background: none; border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.15s ease;
        }
        .toast-close:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}
