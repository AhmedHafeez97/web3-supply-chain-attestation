import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { ethers } from "ethers";

export class RegistryReader {
  constructor() {
    const rpcUrl = process.env.SEPOLIA_RPC_URL;
    const registryAddress = process.env.REGISTRY_ADDRESS;

    if (!rpcUrl) throw new Error("Missing SEPOLIA_RPC_URL in .env");
    if (!registryAddress) throw new Error("Missing REGISTRY_ADDRESS in .env");

    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const artifactPath = path.resolve(
      "artifacts/contracts/SensorAttestationRegistry.sol/SensorAttestationRegistry.json"
    );
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

    this.contract = new ethers.Contract(registryAddress, artifact.abi, provider);
  }

  async get(batchId) {
    return await this.contract.get(batchId);
  }
}
