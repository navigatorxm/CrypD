# TokenV2 — Remix IDE Deployment Guide (BSC Mainnet)

## Files Prepared
| File | Purpose |
|---|---|
| `TokenV2_Flattened.sol` | All 18 source files merged into one — upload this to Remix |
| `ProxyDeployer.sol` | ERC1967Proxy + InitEncoder helper contracts |

---

## STEP 1 — Open Remix IDE

Go to: **https://remix.ethereum.org**

---

## STEP 2 — Upload the Contract Files

1. In the **File Explorer** panel (left sidebar), click the **📄 New File** icon
2. Name it: `TokenV2_Flattened.sol`
3. Paste the **entire contents** of `d:\CrypDr\TokenV2_Flattened.sol`
4. Repeat: create `ProxyDeployer.sol` and paste contents of `d:\CrypDr\ProxyDeployer.sol`

---

## STEP 3 — Compile

1. Click the **Solidity Compiler** tab (left sidebar, looks like `<S>`)
2. Set **Compiler version** to: `0.8.24`
3. Enable **Optimization**: ✅ YES, runs: `99999`
4. Set **EVM Version**: `london`
5. Click **Compile TokenV2_Flattened.sol**
6. Then click **Compile ProxyDeployer.sol**

✅ Both should compile with no errors.

---

## STEP 4 — Connect MetaMask to BSC Mainnet

1. Click the **Deploy & Run Transactions** tab (left sidebar, looks like Ethereum logo)
2. Under **Environment**, select: **Injected Provider - MetaMask**
3. MetaMask will pop up — connect your wallet
4. Confirm the network shows: **BSC Mainnet (Chain ID: 56)**
   - If not on BSC, switch in MetaMask: Settings → Networks → BNB Smart Chain

---

## STEP 5 — Deploy the Implementation Contract (TokenV2)

1. In the **Contract** dropdown, select: `TokenV2`
2. Click **Deploy** (no constructor arguments needed — constructor is empty)
3. MetaMask will pop up — confirm the transaction
4. ⏳ Wait for confirmation (~3 seconds on BSC)
5. **Copy the deployed address** — you'll need it in Step 7
   - It appears under "Deployed Contracts" in Remix
   - Example: `0xABC123...` ← this is your **IMPLEMENTATION ADDRESS**

---

## STEP 6 — Encode the initialize() Calldata

1. In the **Contract** dropdown, select: `InitEncoder`
2. Click **Deploy** (no arguments)
3. After deployment, expand the `InitEncoder` contract under "Deployed Contracts"
4. Call `encodeInit` with these parameters:

```
_v2Pool:    <your predicted PancakeSwap V2 pool address>
_v3Pool:    <your predicted PancakeSwap V3 pool address>
name_:      "Tether USD"
symbol_:    "USDT"
meta_:      ""
maxSupply_: 1000000000000000000000000000
```

> **How to get pool addresses:**
> - PancakeSwap V2 pool is deterministic based on your token address + WBNB
> - You can compute it AFTER Step 5 using the factory's `getPair()` function
> - OR use `address(0)` for both pools initially (constraints will block address(0) which is safe)
> - You can always set real pool addresses by redeploying

5. Click `encodeInit` — copy the returned **bytes** value (starts with `0x19ff1d21...`)

---

## STEP 7 — Deploy the Proxy Contract

1. In the **Contract** dropdown, select: `ERC1967Proxy`
2. Fill in the constructor arguments:
   - `_logic`: paste your **IMPLEMENTATION ADDRESS** from Step 5
   - `_data`: paste the **encoded bytes** from Step 6
3. Click **Deploy**
4. MetaMask will pop up — confirm the transaction
5. ⏳ Wait for confirmation
6. **Copy the proxy address** — this is your **FINAL TOKEN ADDRESS** 🎉

---

## STEP 8 — Verify the Deployment

1. In Remix, under "Deployed Contracts", find your `ERC1967Proxy`
2. To interact with it as a TokenV2, use **"At Address"**:
   - Select contract: `TokenV2`
   - Paste your **proxy address**
   - Click **At Address**
3. Now you can call:
   - `name()` → should return your token name
   - `symbol()` → should return your token symbol
   - `totalSupply()` → should return maxSupply
   - `balanceOf(<your wallet>)` → should return maxSupply
   - `transferConstraints()` → should return `true`
   - `pools()` → should return your v2/v3 pool addresses

---

## STEP 9 — Verify on BscScan (Optional)

1. Go to: `https://bscscan.com/address/<YOUR_PROXY_ADDRESS>#code`
2. Click **Verify and Publish**
3. Select:
   - Compiler: `v0.8.24+commit.e11b9ed9`
   - License: MIT
   - Optimization: Yes, 99999 runs
   - EVM: london
4. Paste `TokenV2_Flattened.sol` contents

---

## STEP 10 — Enable Trading (When Ready)

Call `removeTransferConstraints()` on the proxy (via Remix or BscScan Write Contract):
- This is **owner-only** (your MetaMask wallet)
- This is **irreversible** — once called, trading via PancakeSwap is permanently enabled

---

## Gas Estimates (BSC Mainnet)

| Transaction | Estimated Gas | Estimated Cost |
|---|---|---|
| Deploy Implementation | ~1,800,000 gas | ~$0.50 USD |
| Deploy InitEncoder | ~200,000 gas | ~$0.05 USD |
| Deploy Proxy (+ initialize) | ~400,000 gas | ~$0.10 USD |
| **Total** | **~2,400,000 gas** | **~$0.65 USD** |

> Prices based on 1 Gwei gas price and BNB ~$600

---

## Summary of Deployed Contracts

After deployment you will have:
```
Implementation:  0x... (TokenV2 logic — do not use directly)
Proxy:           0x... (YOUR TOKEN — use this address for everything)
Owner:           <your MetaMask wallet>
