# Deployment Checklist & Troubleshooting

## Pre-Deployment Validation

### ✅ Contract Compilation Status

| Contract | Status | Notes |
|----------|--------|-------|
| TokenV2_Flattened.sol | ✅ **PASS** | No import issues, ready for deployment |
| ProxyDeployer.sol | ✅ **PASS** | ERC1967 proxy helper, ready |
| TokenV2.sol (multi-file) | ⚠️ Requires config | Need compiler remapping for local use |

### 📋 Why Use Flattened Version?

The multi-file `TokenV2.sol` uses import aliases:
```solidity
import {ERC20Upgradeable} from "@openzeppelin-contracts-upgradeable/...";
```

These require:
- Hardhat/Truffle configuration, OR
- Solc compiler remapping (advanced)

**Solution**: Use the **flattened version** which includes all dependencies and requires no configuration.

---

## Step-by-Step Deployment (Remix IDE)

### Step 1: Deploy Implementation Contract

1. Go to [Remix IDE](https://remix.ethereum.org)
2. Create new file: `TokenV2_Flattened.sol`
3. Copy contents from `/TokenV2_Flattened.sol`
4. Compile with Solidity 0.8.24
5. Deploy (use empty constructor)
6. **Note the implementation address** (e.g., `0x1234...`)

### Step 2: Prepare Initialization Data

1. Create file: `InitEncoder.sol`
2. Copy the `InitEncoder` contract from `/ProxyDeployer.sol`
3. Compile and deploy
4. Call `encodeInit()` with parameters:
   ```
   _v2Pool: 0x0000... (Uniswap V2 pool address or zero address)
   _v3Pool: 0x0000... (Uniswap V3 pool address or zero address)
   name_: "MyToken"
   symbol_: "MYT"
   meta_: "https://..." (metadata URI)
   maxSupply_: 1000000000000000000000000 (with 18 decimals)
   ```
5. **Copy the returned bytes** (init data)

### Step 3: Deploy Proxy

1. Create file: `ERC1967Proxy.sol`
2. Copy the `ERC1967Proxy` contract from `/ProxyDeployer.sol`
3. Compile with Solidity 0.8.24
4. Deploy with parameters:
   ```
   _logic: <TokenV2 implementation address from Step 1>
   _data: <encoded init bytes from Step 2>
   ```
5. **Note the proxy address** (this is your token contract)

### Step 4: Verify Deployment

1. Use Remix's "At Address" feature with proxy address
2. Select `TokenV2` ABI (from flattened contract)
3. Verify state:
   - `maxSupply()` shows correct value
   - `name()` shows "MyToken"
   - `symbol()` shows "MYT"
   - `transferConstraints` is `true` (initial state)
4. Check wallet balance:
   - Deployer should have full `maxSupply`

---

## Common Deployment Errors

### Error 1: "ParserError: Source not found"

**Cause**: Trying to compile multi-file `TokenV2.sol` without Hardhat/Truffle

**Solution**: Use `TokenV2_Flattened.sol` instead

```bash
# ❌ Don't do this:
solc contracts/src/TokenV2.sol

# ✅ Do this:
solc TokenV2_Flattened.sol
```

### Error 2: "initialization failed" (ERC1967Proxy)

**Cause**: 
- Wrong implementation address
- Init data doesn't match function signature
- Implementation contract doesn't have `initialize` function

**Solution**:
1. Verify implementation address is correct
2. Use `InitEncoder.encodeInit()` for init data
3. Check function signature matches: `initialize(address,address,string,string,string,uint256)`

### Error 3: "not a contract" (ERC1967Proxy)

**Cause**: Proxy constructor receives an address that isn't a contract

**Solution**:
1. Verify implementation is actually deployed (has code)
2. Check you're on the correct network
3. Paste exact implementation address from Step 1

### Error 4: "Ownable: caller is not the owner"

**Cause**: Trying to call `removeTransferConstraints()` from non-owner address

**Solution**:
- Only deployer (contract owner) can remove constraints
- Call from the same wallet that deployed the proxy

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Proxy deployed and shows correct implementation
- [ ] Token has correct name and symbol
- [ ] Max supply minted to deployer
- [ ] `transferConstraints = true`
- [ ] Transfer to Uniswap pools fails (constraints working)
- [ ] Owner can call `removeTransferConstraints()`
- [ ] After removal, transfers work to any address
- [ ] Token appears in wallet with correct balance
- [ ] Block explorer shows contract creation transaction

---

## Advanced: Local Hardhat Deployment

If using Hardhat for testing:

```bash
# Install Hardhat
npm install --save-dev hardhat

# Use path-based imports (no aliasing needed)
import {ERC20Upgradeable} from "./lib/openzeppelin-contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

# Or use Hardhat's import remapping in hardhat.config.js
```

---

## Gas Estimates

Typical gas costs for mainnet:

| Operation | Gas | Cost (at 50 gwei) |
|-----------|-----|------------------|
| Deploy TokenV2 | ~2.5M | 0.125 ETH |
| Deploy Proxy | ~1.5M | 0.075 ETH |
| Initialize proxy | Included | Included |
| **Total deployment** | **~4M** | **~0.2 ETH** |
| Transfer token | ~65K | 0.00325 ETH |
| Approve | ~46K | 0.0023 ETH |

---

## Network-Specific Notes

### Ethereum Mainnet
- Use testnet (Sepolia) first
- High gas costs, test with Sepolia first
- Verify contract on Etherscan

### Sepolia Testnet
- Faucet: https://sepoliafaucet.com/
- Gas prices: Low (~20 gwei)
- Good for testing before mainnet

### Polygon/Mumbai
- Lower gas costs
- Compatible with ERC20 standard
- Test cross-chain transfers

### BSC/Arbitrum/Optimism
- Similar deployment process
- Verify contract on appropriate explorer
- Check network gas prices

---

## Troubleshooting Commands

```bash
# Verify contract compiles (flattened version)
npx solc@0.8.24 TokenV2_Flattened.sol --bin --abi

# Get contract bytecode size
npx solc@0.8.24 TokenV2_Flattened.sol --bin | grep -c "^[a-f0-9]"

# Check proxy initialization (after deployment)
# Use Remix "At Address" with proxy address
# Call: implementation() -> should return TokenV2 address
#       admin() -> should return deployer address
```

---

## Support & Resources

- [Remix IDE](https://remix.ethereum.org)
- [OpenZeppelin Upgradeable Contracts](https://docs.openzeppelin.com/contracts/upgradeable/)
- [ERC1967 Proxy Standard](https://eips.ethereum.org/EIPS/eip-1967)
- [Solidity Docs](https://docs.soliditylang.org/)

---

## Final Verification

Before considering deployment complete:

1. ✅ Proxy shows correct implementation address
2. ✅ Token transfers to non-pool addresses
3. ✅ Token transfers blocked to pool addresses (when constraints=true)
4. ✅ Owner can disable constraints
5. ✅ All transfer events logged correctly
6. ✅ Permit functionality works (if testing EIP-2612)
7. ✅ Contract verified on block explorer
