import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { ethers } from "ethers";

export class AnchorService {
  constructor() {
    const rpcUrl = process.env.SEPOLIA_RPC_URL;
    const pk = process.env.DEPLOYER_PRIVATE_KEY;
    const registryAddress = process.env.REGISTRY_ADDRESS;

    if (!rpcUrl) throw new Error("Missing SEPOLIA_RPC_URL in .env");
    if (!pk) throw new Error("Missing DEPLOYER_PRIVATE_KEY in .env");
    if (!registryAddress) throw new Error("Missing REGISTRY_ADDRESS in .env");

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(pk, this.provider);
    this.registryAddress = registryAddress;

    // Load ABI from Hardhat artifacts so the call is strongly defined
    const artifactPath = path.resolve(
      "artifacts/contracts/SensorAttestationRegistry.sol/SensorAttestationRegistry.json"
    );
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

    this.contract = new ethers.Contract(registryAddress, artifact.abi, this.wallet);
  }

  /**
   * Anchor attestation on-chain.
   * @param {object} payload must contain batchId, deviceIdHash, commitment, payloadHash, startTs, endTs, startSeq, endSeq
   */
  async anchor(payload) {
    const {
      batchId,
      deviceIdHash,
      commitment,
      payloadHash,
      startTs,
      endTs,
      startSeq,
      endSeq,
    } = payload;

    // Send tx to chain
    const tx = await this.contract.anchor(
      batchId,
      deviceIdHash,
      commitment,
      payloadHash,
      startTs,
      endTs,
      startSeq,
      endSeq
    );

    // Wait for confirmation
    const receipt = await tx.wait();

    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  }
}
