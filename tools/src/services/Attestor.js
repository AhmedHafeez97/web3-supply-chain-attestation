import { RecordValidator } from "./RecordValidator.js";
import { Hasher } from "../crypto/Hasher.js";
import { HashChain } from "../crypto/HashChain.js";
import { AttestationPayload } from "../domain/AttestationPayload.js";

export class Attestor {
    constructor({ batchId }) {
        this.batchId = batchId;
    }

    attest(records) {
        const meta = RecordValidator.validate(records);
        const commitment = HashChain.compute(records);
        const deviceIdHash = Hasher.hashDeviceId(meta.deviceId);

        const payload = new AttestationPayload({
            deviceIdHash,
            batchId: this.batchId,
            startSeq: meta.startSeq,
            endSeq: meta.endSeq,
            startTs: meta.startTs,
            endTs: meta.endTs,
            commitment: commitment,
        });

        return { meta, commitment, payload };
    }
}

