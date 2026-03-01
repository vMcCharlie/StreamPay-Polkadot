import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  const wallet = ethers.Wallet.createRandom();
  console.log(`\n======================================================`);
  console.log(`🚨 NO PRIVATE KEY FOUND. GENERATED A NEW ONE:`);
  console.log(`   Address:     ${wallet.address}`);
  console.log(`   Private Key: ${wallet.privateKey}`);
  console.log(`   Save this in your .env file as PRIVATE_KEY=...`);
  console.log(`======================================================\n`);
}

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    paseo: {
      url: "https://eth-rpc-testnet.polkadot.io",
      chainId: 420420417,
      accounts: privateKey ? [privateKey] : [],
    },
    hardhat: {
    },
  },
};

export default config;
