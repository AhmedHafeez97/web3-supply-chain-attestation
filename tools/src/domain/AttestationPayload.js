export class AttestationPayload {
    constructor({deviceIdHash, batchId, startSeq, endSeq, startTs, endTs, commitment}){
        this.deviceIdHash = deviceIdHash;
        this.batchId = batchId;
        this.startSeq = startSeq;
        this.endSeq = endSeq;
        this.startTs = startTs;
        this.endTs = endTs;
        this.commitment = commitment;
        
        Object.freeze(this);
    }
}