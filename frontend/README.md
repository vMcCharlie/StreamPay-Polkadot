# 🌊 StreamPay

**Money that flows like water.**

StreamPay is a high-performance payment streaming protocol built for the **Polkadot Solidity Hackathon 2026**. It enables users to stream native **PAS** per-second on Paseo Asset Hub, providing a non-custodial, transparent, and continuous payroll and vesting solution.

---

## 🏆 Hackathon Alignment

StreamPay is specifically designed for the **Polkadot Hub** ecosystem, targeting both **Track 1 (EVM)** and **Track 2 (PVM)** requirements:

*   **PVM Experiment (Track 2 Focus):** StreamPay implements a **Custom PVM Math Extension** for non-linear streaming curves (Exponential & Sigmoid). This offloads high-precision math to a native Rust precompile, drastically reducing gas costs and increasing precision compared to EVM-only implementations.
*   **Polkadot Native Assets (Track 2):** Streams native **PAS** directly on **Paseo Asset Hub**.
*   **EVM Compatibility (Track 1):** Built with Solidity 0.8.20 and standard EVM tooling (Wagmi, Viem, Metamask) for seamless developer experience on Polkadot Hub.

---

## ✨ Key Features

-   **Advanced Streaming Curves:** Choose between Linear, Exponential (back-loaded), or Sigmoid (phased) vesting models.
-   **PVM-Native Precision:** Non-linear curves are calculated via a simulated PVM Rust precompile for maximum efficiency.
-   **Native Asset Support:** Full support for native **PAS** deposits and withdrawals on Paseo Asset Hub.
-   **Non-Custodial Architecture:** Funds are locked in a PVM-optimized smart contract and released according to the on-chain schedule.
-   **Sender/Recipient Dashboards:** Intuitive streaming interface for tracking incoming and outgoing flows with live balance counters.
-   **Instant Cancellations:** Senders can stop a stream at any time. Vested funds are paid to the recipient, and unvested funds are instantly returned to the sender.

---

## 🛠️ Technical Stack

### Smart Contracts
-   **Language:** Solidity 0.8.20
-   **Transfer Model:** Native value transfer (`msg.value`) for PAS streaming
-   **Logic:** Linear vesting with per-second distribution.

### Frontend
-   **Framework:** Next.js 15 (App Router)
-   **Styling:** Vanilla CSS with custom design tokens for a premium, "fluid" aesthetic.
-   **Web3 Integration:** Wagmi v2 & Viem for robust blockchain interactions.
-   **UI Components:** Custom components built with accessibility and visual excellence in mind.

---

## 🚀 Getting Started

### Prerequisites
-   [Metamask](https://metamask.io/) or any EVM-compatible wallet.
-   Request test tokens from the [Paseo Faucet](https://faucet.polkadot.io/).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/streampay.git
    cd streampay/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Connect to Paseo Asset Hub:**
    The application will automatically prompt you to add the **Paseo Asset Hub** network.

---

## 📡 Deployment Details

-   **Network:** Paseo Asset Hub (Testnet)
-   **Chain ID:** 420420417
-   **RPC URL:** `https://eth-rpc-testnet.polkadot.io`
-   **Block Explorer:** [Subscan - Paseo Asset Hub](https://assethub-paseo.subscan.io/)

### Supported Asset
| Asset | Symbol | Type |
| :--- | :--- | :--- |
| **Paseo Native Token** | PAS | Native chain token |

---

## 🗺️ Roadmap

-   [ ] **XCM Integration:** Enable cross-chain streaming between Polkadot parachains.
-   [ ] **Automation:** Recurring stream renewals for long-term payroll.
-   [ ] **Mobile App:** Dedicated mobile interface for on-the-go stream management.
-   [ ] **Yield-bearing Streams:** Integration with Polkadot DeFi protocols to earn yield on locked deposits.

---

## 👥 Organization
StreamPay is developed as part of the **Polkadot Solidity Hackathon**, co-led by **OpenGuild** and **Web3 Foundation**.

Developed with ❤️ for the Polkadot APAC community.
