"use client";

import { useState } from "react";
import { NATIVE_ASSETS, NativeAsset } from "@/lib/assets";

interface AssetSelectorProps {
    selectedAsset: NativeAsset;
    onSelect: (asset: NativeAsset) => void;
}

export function AssetSelector({ selectedAsset, onSelect }: AssetSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="asset-selector-container">
            <label className="label">Select Asset</label>
            <div className="selector-relative">
                <button
                    type="button"
                    className="selector-button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="selected-info">
                        <div
                            className="asset-icon-placeholder"
                            style={{ backgroundColor: selectedAsset.color }}
                        >
                            {selectedAsset.symbol[0]}
                        </div>
                        <span className="asset-name">{selectedAsset.name}</span>
                        <span className="asset-symbol">({selectedAsset.symbol})</span>
                    </div>
                    <svg
                        className={`chevron ${isOpen ? "rotate" : ""}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="options-dropdown animate-fade-in">
                        {NATIVE_ASSETS.map((asset) => (
                            <button
                                key={asset.symbol}
                                type="button"
                                className={`option-item ${selectedAsset.symbol === asset.symbol ? "option-selected" : ""
                                    }`}
                                onClick={() => {
                                    onSelect(asset);
                                    setIsOpen(false);
                                }}
                            >
                                <div
                                    className="asset-icon-placeholder"
                                    style={{ backgroundColor: asset.color }}
                                >
                                    {asset.symbol[0]}
                                </div>
                                <div className="option-text">
                                    <span className="option-name">{asset.name}</span>
                                    <span className="option-sub">Native Asset</span>
                                </div>
                                {selectedAsset.symbol === asset.symbol && (
                                    <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
        .asset-selector-container {
          position: relative;
          width: 100%;
        }
        .selector-relative {
          position: relative;
        }
        .selector-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .selector-button:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--border-bright);
        }
        .selected-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .asset-icon-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .asset-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.95rem;
        }
        .asset-symbol {
          color: var(--text-muted);
          font-size: 0.85rem;
          font-family: var(--font-mono);
        }
        .chevron {
          color: var(--text-muted);
          transition: transform 0.2s;
        }
        .chevron.rotate {
          transform: rotate(180deg);
        }
        .options-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: var(--bg-card);
          border: 1px solid var(--border-bright);
          border-radius: var(--radius-md);
          padding: 8px;
          z-index: 50;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .option-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background 0.2s;
          text-align: left;
        }
        .option-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .option-selected {
          background: rgba(56, 189, 248, 0.08) !important;
        }
        .option-text {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .option-name {
          font-weight: 500;
          color: var(--text-primary);
          font-size: 0.9rem;
        }
        .option-sub {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        .check-icon {
          color: var(--accent-cyan);
        }
      `}</style>
        </div>
    );
}
