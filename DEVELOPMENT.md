# Development Guide

This document provides detailed instructions for setting up and developing CrypD locally.

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: Latest version
- **Wallet**: MetaMask or compatible EVM wallet for testing
- **RPC Keys** (optional): Alchemy or QuickNode API keys for faster RPC access

## Local Development Setup

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/navigatorxm/crypd.git
cd crypd

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Environment Configuration

Create `/frontend/.env.local` with the following:

```env
# Optional: RPC and API keys for improved performance
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key

# WalletConnect configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Optional: API endpoints (defaults to public endpoints)
NEXT_PUBLIC_ETH_RPC=https://eth-mainnet.g.alchemy.com/v2/your-key
```

### 3. Start Development Services

**Terminal 1 - Frontend (Next.js)**
```bash
cd frontend
npm run dev
```
- Runs on `http://localhost:3000`
- Hot reload enabled
- TypeScript checking on save

**Terminal 2 - WebSocket Server (Terminal Emulation)**
```bash
cd frontend
npm run server
```
- Runs on `ws://localhost:3001`
- Provides terminal emulation capability
- Required for terminal features to work

**Terminal 3 (Optional) - Solidity Compilation Watch**
```bash
npm run compile:watch
```
- Watches for `.sol` file changes
- Recompiles on change (if script exists)

### 4. Verify Setup

1. **Frontend**: Navigate to `http://localhost:3000`
2. **Connect Wallet**: Click "Connect" and select MetaMask
3. **Terminal**: Check if terminal loads in `/admin/terminal`
4. **Test Compilation**: Try using the editor at `/admin/editor`

## Development Workflow

### Working with the Editor

1. Go to `/admin/editor`
2. Select or create a Solidity file
3. Edit code in Monaco editor
4. Compile via the "Compile" button
5. View results in the compiler panel

### Testing Contract Deployment

1. Ensure wallet is connected
2. Go to `/admin/deploy`
3. Select target network (start with testnet like Sepolia)
4. Configure contract parameters
5. Sign transaction in wallet
6. Monitor status in `/admin/transactions`

### Working with State Management

CrypD uses Zustand stores for state. Key stores:

**`/frontend/src/store/index.ts`**
- `WalletStore`: Connected wallet, balance, chain
- `ContractStore`: Deployed contracts list
- `TxStore`: Transaction history (persists last 200)
- `EditorStore`: Active files, compilation results
- `UIStore`: UI state (sidebar, terminal height, etc.)

Example usage:
```typescript
import { useWalletStore, useContractStore } from '@/store'

function MyComponent() {
  const { address, balance } = useWalletStore()
  const { contracts, selectedContract } = useContractStore()
  // ...
}
```

## Port Configuration

| Service | Port | Purpose |
|---------|------|---------|
| Next.js Frontend | 3000 | Web UI |
| WebSocket Server | 3001 | Terminal emulation |
| Solidity Compiler | API Route | In-process compilation |

If ports are already in use, modify:
- Frontend: `frontend/package.json` scripts
- WebSocket: `frontend/server.js` port config

## Testing

### Run Tests

```bash
# Unit tests (if configured)
npm test

# Test coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Manual Testing Checklist

- [ ] Wallet connection (MetaMask)
- [ ] Network switching
- [ ] Solidity editor compilation
- [ ] Contract deployment to testnet
- [ ] Contract interaction
- [ ] Terminal functionality
- [ ] State persistence (reload page)
- [ ] Transaction history tracking

## Smart Contract Development

### Structure

```
contracts/
├── src/
│   ├── TokenV2.sol          # Main token implementation
│   ├── interfaces/
│   │   └── ITokenV2.sol     # Token interface
├── lib/
│   └── openzeppelin-contracts-upgradeable/  # OZ deps
```

### Compilation

The frontend has built-in Solidity compilation via the API route `/api/compile`.

For standalone compilation:
```bash
npx solc@0.8.24 contracts/src/TokenV2.sol --optimize
```

### Flattened Contracts

For deployment on Remix or explorers:
```bash
# Already flattened files available:
cat TokenV2_Flattened.sol        # Use this for deployment
cat ProxyDeployer.sol             # Proxy helper
```

## Debugging

### Frontend Debugging

1. **Browser DevTools**
   - F12 or Ctrl+Shift+I
   - Console, Network, Sources tabs
   - Redux DevTools extension (if installed)

2. **Next.js Debug Logs**
   ```bash
   DEBUG=* npm run dev
   ```

3. **VS Code Debugging**
   - Install "Debugger for Chrome" extension
   - Launch config in `.vscode/launch.json`

### Contract Debugging

1. **Compilation Errors**
   - Check editor panel error messages
   - Review Solidity version compatibility
   - Validate import paths

2. **Deployment Issues**
   - Check wallet has enough gas
   - Verify constructor parameters
   - Monitor transaction status

3. **RPC Connection Issues**
   - Try different RPC endpoint
   - Check network configuration
   - Verify wallet is on correct network

## Common Issues

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

### Memory Issues During Compilation
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run dev
```

### Wallet Not Connecting
- Ensure MetaMask is unlocked
- Check correct network in MetaMask
- Clear browser cache
- Try different browser

### Terminal Not Working
- Check WebSocket server is running (`npm run server`)
- Verify port 3001 is available
- Check browser console for errors

## Performance Optimization

### Frontend Build
```bash
npm run build          # Production build
npm run analyze        # Bundle analysis
```

### Contract Optimization
```bash
# Optimize Solidity compilation
npx solc@0.8.24 --optimize --optimize-runs 200
```

## Contributing

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes and test**
   - Test locally thoroughly
   - Update relevant documentation
   - Keep commits atomic and descriptive

3. **Commit with clear messages**
   ```bash
   git commit -m "feat: Add feature description"
   ```

4. **Push and open PR**
   ```bash
   git push origin feature/your-feature
   ```

## Build for Production

```bash
# Frontend
cd frontend
npm run build
npm run start

# WebSocket server runs separately or via Docker
node server.js
```

## Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] No console errors
- [ ] Contract audited (if applicable)
- [ ] Gas optimization verified
- [ ] Network RPC endpoints validated
- [ ] Environment variables set
- [ ] Wallet has sufficient funds for deployment
- [ ] Deployment guide reviewed (REMIX_DEPLOY_GUIDE.md)

## Getting Help

1. Check [TODO.md](./TODO.md) for known issues
2. Review [README.md](./README.md) for overview
3. See [REMIX_DEPLOY_GUIDE.md](./REMIX_DEPLOY_GUIDE.md) for deployment help
4. Check browser console for error messages
5. Review component props and state shape

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [wagmi Documentation](https://wagmi.sh/)
- [viem Documentation](https://viem.sh/)
- [Solidity Docs](https://docs.soliditylang.org/)
- [OpenZeppelin Upgradeable Contracts](https://docs.openzeppelin.com/contracts/upgradeable/)
