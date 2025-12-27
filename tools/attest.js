import { RecordLoader } from "./src/services/RecordLoader.js";
import { Attestor } from "./src/services/Attestor.js";

const path = "demo/records.jsonl";

const records = RecordLoader.loadJsonl(path);

const attestor = new Attestor({ batchId: 1 });

const { meta, commitment, payload } = attestor.attest(records);

console.log(`Loaded ${records.length} records from ${path}`);
console.log("Meta:", meta);
console.log("BatchHash:", commitment);
console.log("Attestation payload:", payload);