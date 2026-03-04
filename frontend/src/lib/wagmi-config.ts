import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { injected } from "wagmi/connectors";

export const paseoAssetHub = defineChain({
  id: 420420417,
  name: "Paseo Asset Hub",
  nativeCurrency: {
    name: "PAS",
    symbol: "PAS",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://eth-rpc-testnet.polkadot.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Subscan",
      url: "https://assethub-paseo.subscan.io",
    },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [paseoAssetHub],
  connectors: [injected()],
  transports: {
    [paseoAssetHub.id]: http(),
  },
  ssr: true,
});
