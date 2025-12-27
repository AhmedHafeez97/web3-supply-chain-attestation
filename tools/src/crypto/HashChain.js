import { keccak256, concat, zeroPadValue } from "ethers";
import { Hasher } from "./Hasher.js";

export class HashChain{
    static compute(records) {
        let h = zeroPadValue("0x00", 32); // h0
    
        records.forEach((record) => {
          const rh = Hasher.hashRecord(record); // 0x.. bytes32
          h = keccak256(concat([h, rh]));  // hi = keccak(hi-1 || rh)
        });
    
        return h; // batchHash
      }
}