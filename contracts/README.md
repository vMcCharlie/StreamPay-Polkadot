# StreamPay Smart Contracts

This directory contains the core logic for the StreamPay protocol, a high-performance payment streaming system built for the Polkadot ecosystem.

## 📜 Overview

StreamPay's primary contract, `StreamPay.sol`, handles the creation, management, and settlement of payment streams. It supports both standard linear streaming and advanced non-linear distribution models (Exponential and Sigmoid) by leveraging a custom PVM Math Extension.

### Key Logic
- **Stream Creation:** Senders lock native tokens into a stream for a specific recipient and duration.
- **Dynamic Balancing:** The contract calculates the "earned" amount in real-time based on the elapsed time and chosen curve.
- **Permissionless Withdrawals:** Recipients can claim their earned balance at any time. Senders can cancel streams to reclaim unearned funds.
- **PVM Integration:** For non-linear curves, the contract offloads high-precision math to a native precompile (PVM Math Extension) at address `0x...501`.

## 🏗️ Technical Architecture

### Core Data Structure: `Stream`
```solidity
struct Stream {
    address sender;
    address recipient;
    address token;       // Currently 0x0 for native assets
    uint256 deposit;     // Total locked amount
    uint256 withdrawn;   // Amount already claimed
    uint256 startTime;
    uint256 stopTime;
    CurveType curveType; // Linear, Exponential, or Sigmoid
    bool active;
}
```

### Supported Curves (`CurveType`)
1.  **Linear (0):** Funds are released at a constant rate over the duration.
2.  **Exponential (1):** Back-loaded release, where moving towards the end of the duration accelerates the fund availability.
3.  **Sigmoid (2):** S-curve release, starting slow, accelerating in the middle, and tapering off at the end. Perfect for phased vesting.

## 🚀 Key Functions

### `createStream`
Creates a new stream by depositing native tokens.
- `recipient`: Address entitled to the funds.
- `startTime`: When the stream begins.
- `stopTime`: When the stream ends and all funds are available.
- `curveType`: The distribution model to follow.

### `streamBalance`
Returns the current claimable balance for the recipient and the remaining balance for the sender.
- `id`: The unique ID of the stream.

### `withdraw`
Allows the recipient to claim their earned funds.
- `id`: The unique ID of the stream.

### `cancel`
Allows the sender to cancel an active stream. Remaining funds are split between sender and recipient according to the current balance calculation.

## 🛠️ Development & Deployment

The contracts are built using **Hardhat**.

### Prerequisites
- Node.js & npm
- A `.env` file with `PRIVATE_KEY` and `PASEO_RPC_URL` (see `.env.example`)

### Commands
```bash
# Compile contracts
npx hardhat compile

# Run tests (if applicable)
npx hardhat test

# Deploy to Paseo Asset Hub
npx hardhat run scripts/deploy.ts --network paseo
```

### Deployment Details
- **Network:** Paseo Testnet (Asset Hub)
- **Contract Address:** `0x74ABB06A03317AEB37dD45fF0BF58fDc9a165e57`
