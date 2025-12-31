import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { ethers } from "ethers";

async function main() {
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const pk = process.env.DEPLOYER_PRIVATE_KEY;

  if (!rpcUrl) throw new Error("Missing SEPOLIA_RPC_URL in .env");
  if (!pk) throw new Error("Missing DEPLOYER_PRIVATE_KEY in .env");

  // 1) Connect to Sepolia
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // 2) Create a signing wallet (this wallet will pay gas)
  const wallet = new ethers.Wallet(pk, provider);
  console.log("Deploying with account:", wallet.address);

  // 3) Load compiled artifact (ABI + bytecode) produced by `hardhat compile`
  const artifactPath = path.resolve(
    "artifacts/contracts/SensorAttestationRegistry.sol/SensorAttestationRegistry.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  const abi = artifact.abi;
  const bytecode = artifact.bytecode;

  // 4) Create factory and deploy
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy();

  console.log("Deployment tx:", contract.deploymentTransaction().hash);

  await contract.waitForDeployment();

  console.log("SensorAttestationRegistry deployed to:", await contract.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
