import { RecordLoader } from "./src/services/RecordLoader.js";
import { RecordValidator } from "./src/services/RecordValidator.js";
import { HashChain } from "./src/crypto/HashChain.js";
import { Hasher } from "./src/crypto/Hasher.js";
import { AttestationPayload } from "./src/domain/AttestationPayload.js";
import { RegistryReader } from "./src/services/RegistryReader.js";

const path = "demo/records.jsonl";

// 👇 Buyer needs the batch label (from shipment docs / QR / email / invoice)
const batchLabel = "batch-2025-12-31T01:01:02.124Z";

// 1) Load and validate records
const records = RecordLoader.loadJsonl(path);
const meta = RecordValidator.validate(records);

// 2) Recompute commitment and hashes
const commitment = HashChain.compute(records);
const deviceIdHash = Hasher.hashDeviceId(meta.deviceId);

// 3) Recompute batchId from batchLabel (same rule as attestor)
const batchId = Hasher.hashUtf8(batchLabel);

// 4) Recompute payloadHash deterministically (same rule as attestor)
const phObj = AttestationPayload.payloadHashObject({
  deviceIdHash,
  batchId,
  startSeq: meta.startSeq,
  endSeq: meta.endSeq,
  startTs: meta.startTs,
  endTs: meta.endTs,
  commitment,
});
const payloadHash = Hasher.hashPayload(phObj);

// 5) Fetch on-chain attestation
const reader = new RegistryReader();
const onChain = await reader.get(batchId);

// 6) Compare
const okCommitment = onChain.commitment === commitment;
const okPayloadHash = onChain.payloadHash === payloadHash;
const okDevice = onChain.deviceIdHash === deviceIdHash;

// Ranges come back as BigInt-like values in ethers v6; normalize for comparison
const okStartSeq = Number(onChain.startSeq) === meta.startSeq;
const okEndSeq = Number(onChain.endSeq) === meta.endSeq;
const okStartTs = Number(onChain.startTs) === meta.startTs;
const okEndTs = Number(onChain.endTs) === meta.endTs;

console.log(`Loaded ${records.length} records from ${path}`);
console.log("BatchLabel:", batchLabel);
console.log("BatchId:", batchId);

console.log("Computed commitment:", commitment);
console.log("On-chain commitment:", onChain.commitment);

console.log("Computed payloadHash:", payloadHash);
console.log("On-chain payloadHash:", onChain.payloadHash);

if (
  okCommitment &&
  okPayloadHash &&
  okDevice &&
  okStartSeq &&
  okEndSeq &&
  okStartTs &&
  okEndTs
) {
  console.log("******* INTEGRITY VERIFIED (ON-CHAIN) ******");
} else {
  console.log("xxxxxxx VERIFICATION FAILED xxxxxxx");
  console.log({
    okCommitment,
    okPayloadHash,
    okDevice,
    okStartSeq,
    okEndSeq,
    okStartTs,
    okEndTs,
  });
}
