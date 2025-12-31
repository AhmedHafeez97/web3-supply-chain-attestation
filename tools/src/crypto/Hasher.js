//Ethereum Hashing Primitives
import { keccak256, toUtf8Bytes } from "ethers";
import { Canonicalizer } from "./Canonicalizer.js";

export class Hasher {
    static hashUtf8(str){
        return keccak256(toUtf8Bytes(str));
    }

    static hashDeviceId(deviceId){
        return Hasher.hashUtf8(deviceId);
    }

    static hashRecord(record) {
        const canon = Canonicalizer.recordToCanonicalJson(record);
        return Hasher.hashUtf8(canon);
    }

    static hashPayload(payloadHashObj){
        const canon = Canonicalizer.payloadToCanonicalJson(payloadHashObj);
        return Hasher.hashUtf8(canon);
    }
}