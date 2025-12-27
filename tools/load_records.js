import fs from "fs";
import { keccak256, toUtf8Bytes, concat, zeroPadValue } from "ethers";
import { log } from "console";

const path = "demo/records.jsonl";
const raw = fs.readFileSync(path, "utf8");

const lines = raw.split("\n").filter(Boolean);
const records = lines.map((line, idx) => {
    try {
        return JSON.parse(line);
    }
    catch (e) {
        throw new Error(`Invalid JSON on line ${idx + 1}: ${line}`);
    }
});

const validateRecords = (records) => {
    if (records.length === 0) {
        throw new Error("No records");
    }

    const deviceId = records[0].deviceId;
    if (typeof deviceId != "string" || deviceId.length === 0) {
        throw new Error("deviceId must be a non-empty string");
    }

    records.forEach((record, index) => {
        // device Id consistency
        if (record.deviceId != deviceId) {
            throw new Error(`deviceId mismatch at index ${index}`)
        }

        // numeric field checks
        const numericFields = [
            "seq",
            "ts",
            "tempC_x100",
            "rh_x100",
            "shock_mg",
            "battery_mv",
        ];

        numericFields.forEach((f) => {
            if (typeof record[f] !== "number" || Number.isNaN(record[f])) {
                throw new Error(`Field ${f} must be a number at index ${index}`)
            }
        });

        // seq + ts ordering

        if (index > 0) {
            const prev = records[index - 1];

            if (record.seq !== prev.seq + 1) {
                throw new Error(`seq must increase by 1 index ${index}`);
            }

            if (record.ts < prev.ts) {
                throw new Error(
                    `ts must be non-decreasing at index ${index}: got ${record.ts} < ${prev.ts}`
                );
            }
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

const canonicalizeRecord = (r) => {
    const canon = {
        deviceId: r.deviceId,
        seq: r.seq,
        ts: r.ts,
        tempC_x100: r.tempC_x100,
        rh_x100: r.rh_x100,
        shock_mg: r.shock_mg,
        battery_mv: r.battery_mv,
    };

    return JSON.stringify(canon);
};

const hashRecord = (record) => {
    const canon = canonicalizeRecord(record);
    const bytes = toUtf8Bytes(canon);
    return keccak256(bytes);
}

const computeHashChain = (records) => {
    let h = zeroPadValue("0x00", 32);

    records.forEach((record, i) => {
        const rh = hashRecord(record);
        const combined = concat([h, rh]);

        h = keccak256(combined);
    });

    return h;
}

const meta = validateRecords(records);

const batchHash = computeHashChain(records);
console.log("BatchHash", batchHash);

