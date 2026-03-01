import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const deployer = (await ethers.getSigners())[0];
  console.log("Deploying contract with the account:", deployer.address);
  
  const StreamPay = await ethers.getContractFactory("StreamPay");
  const streamPay = await StreamPay.deploy();
  await streamPay.waitForDeployment();
  const address = await streamPay.getAddress();

  console.log("StreamPay deployed to:", address);

  // Update frontend config
  const deploymentConfigPath = path.join(__dirname, "../../frontend/src/lib/deployment.json");
  if (fs.existsSync(deploymentConfigPath)) {
      const config = {
          address: address,
          deployer: deployer.address,
          network: network.name,
      };
      fs.writeFileSync(deploymentConfigPath, JSON.stringify(config, null, 2));
      console.log("Frontend deployment configuration updated at:", deploymentConfigPath);
  } else {
      console.log(`Frontend deployment path not found: ${deploymentConfigPath}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});