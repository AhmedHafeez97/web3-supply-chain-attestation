export class Canonicalizer {
    static recordToCanonicalJson(record) {
        //Fixed key oder
        const canon = {
            deviceId: record.deviceId,
            seq: record.seq,
            ts: record.ts,
            tempC_x100: record.tempC_x100,
            rh_x100: record.rh_x100,
            shock_mg: record.shock_mg,
            battery_mv: record.battery_mv,
        };
        return JSON.stringify(canon);
    }

    static payloadToCanonicalJson(payloadHashObj) {
        const canon = {
            batchId: payloadHashObj.batchId,
            deviceIdHash: payloadHashObj.deviceIdHash,
            commitment: payloadHashObj.commitment,
            startSeq: payloadHashObj.startSeq,
            endSeq: payloadHashObj.endSeq,
            startTs: payloadHashObj.startTs,
            endTs: payloadHashObj.endTs,
        };
        return JSON.stringify(canon);
    }
}