export class AttestationPayload {
    constructor({deviceIdHash, batchId, startSeq, endSeq, startTs, endTs, commitment, payloadHash}){
        this.deviceIdHash = deviceIdHash;
        this.batchId = batchId;
        this.startSeq = startSeq;
        this.endSeq = endSeq;
        this.startTs = startTs;
        this.endTs = endTs;
        this.commitment = commitment;

        this.payloadHash = payloadHash
        
        Object.freeze(this);
    }

    static payloadHashObject({
        deviceIdHash,
        batchId,
        startSeq,
        endSeq,
        startTs,
        endTs,
        commitment,
    }) {
        return {
            batchId,
            deviceIdHash,
            commitment,
            startSeq,
            endSeq,
            startTs,
            endTs,
        };
    }
}