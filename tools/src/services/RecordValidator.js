export class RecordValidator {
    static validate(records){
        if(records.length === 0) throw new Error("No reocrds");
        
        const deviceId = records[0].deviceId;
        if(typeof deviceId !== "string" || deviceId.length === 0){
            throw new Error("deviceId must be a non-empty string")
        }

        records.forEach((record, idx) => {
            if(record.deviceId !== deviceId){
                throw new Error(`deviceId mismatch at index #{idx}`);
            }

            const numericFields = [
                "seq",
                "ts",
                "tempC_x100",
                "rh_x100",
                "shock_mg",
                "battery_mv",
            ];

            numericFields.forEach((f) => {
                if(typeof record[f] !== "number" || Number.isNaN(record[f])){
                    throw new Error(`Field ${f} must be a number at index ${i}`);
                }
            });

            if (idx > 0){
                const prev = records[idx - 1];

                if(record.seq !== prev.seq + 1) throw new Error(`seq gap at index${idx}`);

                if(record.ts < prev.ts) throw new Error(`ts is backwards at index ${idx}`);
            }
        });

        return {
            deviceId, 
            startSeq: records[0].seq,
            endSeq: records[records.length - 1].seq,
            startTs: records[0].ts,
            endTs: records[records.length - 1].ts,
        }
    }
}