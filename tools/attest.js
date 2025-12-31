import { RecordLoader } from "./src/services/RecordLoader.js";
import { Attestor } from "./src/services/Attestor.js";
import { AnchorService } from "./src/services/AnchorService.js";
import { Hasher } from "./src/crypto/Hasher.js";

const path = "demo/records.jsonl";

const records = RecordLoader.loadJsonl(path);

const batchLabel = "batch-" + new Date().toISOString();

const batchId = Hasher.hashUtf8(batchLabel)

const attestor = new Attestor({ batchId });

const { meta, commitment, payload } = attestor.attest(records);

console.log(`Loaded ${records.length} records from ${path}`);
console.log("Meta:", meta);
console.log("BatchLabel (off-chain):", batchLabel);
console.log("BatchId (bytes32, on-chain key):", batchId);
console.log("Commitment (hash chain):", commitment);
console.log("Attestation payload:", payload);

// 6) Anchor attestation on Sepolia
const anchorService = new AnchorService();
const res = await anchorService.anchor(payload);

console.log("Anchored on Sepolia:", res);