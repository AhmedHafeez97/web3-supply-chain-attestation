// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.28;

contract SensorAttestationRegistry {
    struct AttestationMeta {
        bytes32 deviceIdHash;
        bytes32 commitment;  // hash chain final batch hash
        bytes32 payloadHash;  //hash of canonical JSON payload 
        uint64 startTs;
        uint64 endTs;
        uint32 startSeq;
        uint32 endSeq;
        address attestor; //who anchored this
        uint64 anchoredAt;  //block timestamp at anchor; notarized
    }

    //Map batchId to attestation metadata
    mapping(bytes32 => AttestationMeta) private _attestations;

    //Emitted when a batch is anchored succesfully
    event Attested(
        bytes32 indexed batchId,
        bytes32 indexed deviceIdHash,
        bytes32 commitment,
        bytes32 payloadHash,
        address indexed attestor
    );

    //Safeguard and tis thrown if someone tries to overwrite an existing batch
    error AlreadyAnchored(bytes32 batchId);

    //function for 
    function anchor(
        bytes32 batchId,
        bytes32 deviceIdHash,
        bytes32 commitment,
        bytes32 payloadHash,
        uint64 startTs,
        uint64 endTs,
        uint32 startSeq,
        uint32 endSeq
    ) external {
        //Prevent overwriting an existing attestation
        if (_attestations[batchId].anchoredAt != 0) revert AlreadyAnchored(batchId);

        _attestations[batchId] = AttestationMeta({
            deviceIdHash: deviceIdHash,
            commitment: commitment,
            payloadHash: payloadHash,
            startTs: startTs,
            endTs: endTs,
            startSeq: startSeq,
            endSeq: endSeq,
            attestor: msg.sender,
            anchoredAt: uint64(block.timestamp)
        });

        //Emit an event for off-chain consumers 
        emit Attested(batchId, 
                    deviceIdHash, 
                    commitment,
                    payloadHash, 
                    msg.sender);
    }

    //AttestationMeta Full attestation metadata
    function get(bytes32 batchId) external view returns (AttestationMeta memory) {
        return _attestations[batchId];
    }
}