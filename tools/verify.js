import {RecordLoader} from "./src/services/RecordLoader.js";
import {RecordValidator} from "./src/services/RecordValidator.js";
import {HashChain} from "./src/crypto/HashChain.js";


const path = "demo/records.jsonl";

const expectedCommitment = 
 "0x61c4c28f69194ecc2c99680e738e67ee29f86b248961aa623c81e06019749b74";

 const records = RecordLoader.loadJsonl(path);
 RecordValidator.validate(records);

 const computed = HashChain.compute(records);

 console.log("Expected: ", expectedCommitment);
 console.log("Computed: ", computed);

 if(computed === expectedCommitment){
    console.log("INTEGRITY VERIFIED");
 }
 else{
    console.log("FAILED: COMMITMENT MISMATCH")
 }
