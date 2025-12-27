# Web3 Supply Chain Sensor Attestation (MVP)

## Problem
Sensor data in supply chains (cold-chain, fragile goods) can be altered or disputed after the fact.

## Idea
We create a tamper-evident attestation system where:
- sensor data stays off-chain
- cryptographic commitments are anchored on Ethereum
- buyers can independently verify integrity

## Architecture
sensor → off-chain attestor → hash chain → on-chain commitment → buyer verification

## Current Status
- Canonical sensor record format
- Deterministic record hashing (keccak256)
- Hash-chain batch commitment
- On-chain anchoring (next)

## How It Works (Off-chain)
1. Sensor records are validated (ordering, timestamps)
2. Each record is canonicalized
3. Each record is hashed
4. Hashes are chained into a single batch commitment

<!-- ## Run the demo
```bash
npm install
node tools/load_records.js -->
