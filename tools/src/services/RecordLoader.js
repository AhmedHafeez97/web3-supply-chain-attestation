import fs from "fs";
import { SensorRecord } from "../domain/SensorRecord.js";

export class RecordLoader {
    static loadJsonl(path) {
        const raw = fs.readFileSync(path, "utf-8");
        const lines = raw.split("\n").filter(Boolean);

        return lines.map((line, idx) => {
            try {
                const obj = JSON.parse(line);
                return new SensorRecord(obj);
            }
            catch {
                throw new Error(`Invlaid JSON at line ${idx + 1}`);
            }
        });
    }
}