# CrypD - Web3 Smart Contract Development Platform

A comprehensive, full-stack platform for Ethereum and EVM smart contract development, deployment, and interaction. CrypD combines an integrated Solidity editor, multi-chain deployment tools, and AI-powered features into one powerful development environment.

## Features

### 🔧 **Contract Development**
- **Monaco Editor**: Professional Solidity code editor with syntax highlighting and error detection
- **In-Browser Compilation**: Real-time Solidity compilation via integrated compiler
- **Smart Templates**: Pre-built contract templates (ERC20, ERC721, Governance, etc.)
- **Multi-File Support**: Organize contracts across multiple files with dependency management

### 🚀 **Deployment & Interaction**
- **Multi-Chain Deployment**: Deploy to 7+ EVM networks including:
  - Ethereum Mainnet & Sepolia Testnet
  - BNB Chain & Testnet
  - Polygon & Mumbai Testnet
  - Arbitrum & Sepolia
  - Optimism & OP Sepolia
  - Base & Base Sepolia
  - Avalanche & Fuji Testnet
- **Upgradeable Contracts**: Built-in ERC1967 proxy pattern for contract upgrades
- **TokenV2 Wizard**: Streamlined ERC20 token deployment with initialization
- **Contract Interaction**: Call contract methods and view state directly from dashboard
- **Transaction Tracking**: Monitor deployment status, gas usage, and transaction history

### 🎛️ **Admin Dashboard**
- **Wallet Management**: Connect via MetaMask and RainbowKit
- **Network Selector**: Switch between chains with one click
- **Real-Time Data**: Live block numbers, gas prices, and wallet balances
- **Contract Registry**: Manage and track deployed contracts
- **Transaction Dashboard**: View detailed transaction history and status

### 🧠 **GodMode AI Co-pilot**
- Autonomous agent management for smart contract operations
- Configurable AI models and parameters
- Real-time agent activity monitoring
- Integration with terminal for agent outputs

### 💻 **Terminal Emulation**
- Real WebSocket-based terminal emulation
- Execute shell commands in a secure environment
- Live output streaming with xterm.js UI
- Perfect for running deployment scripts and debugging

### 📊 **Nexus Ecosystem**
- Project management and collaboration tools
- Activity feed for team coordination
- Settings and configuration management

## Tech Stack

### Frontend
- **React 19.2.4** with Next.js 16.2.2 (App Router)
- **Tailwind CSS 4** for styling
- **Monaco Editor** for code editing
- **wagmi 2.19.5** & **viem 2.47.10** for Web3 integration
- **RainbowKit 2.2.10** for wallet connection
- **Zustand 5.0.12** for state management
- **React Hook Form** & **Zod** for form validation
- **Radix UI** for accessible components
- **xterm 6.0.0** for terminal emulation

### Backend
- **Node.js** WebSocket server for terminal sessions
- **node-pty** for shell spawning
- **Next.js API Routes** for Solidity compilation

### Smart Contracts
- **Solidity 0.8.24+** (upgradeable contracts)
- **OpenZeppelin Upgradeable Contracts**
- **ERC1967 Proxy Pattern** for upgradeable deployments

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/navigatorxm/crypd.git
   cd crypd
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the `/frontend` directory:
   ```env
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
   ```

4. **Start the development server**
   ```bash
   # Terminal 1: Frontend
   cd frontend
   npm run dev
   
   # Terminal 2: WebSocket server (for terminal features)
   npm run server
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## Development Setup

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development instructions including:
- Local environment configuration
- Port and service configuration
- Testing and validation procedures
- Deployment checklist

## Project Structure

```
CrypD/
├── frontend/                    # Next.js dApp frontend
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/         # React components
│   │   ├── lib/                # Utilities and constants
│   │   ├── store/              # Zustand state stores
│   │   └── types/              # TypeScript types
│   ├── server.js               # WebSocket terminal server
│   └── package.json
├── contracts/                   # Smart contracts
│   ├── src/                     # Contract source files
│   └── lib/                     # OpenZeppelin dependencies
├── scripts/                     # Deployment and utility scripts
├── tests/                       # Contract tests
├── TokenV2_Flattened.sol       # Production-ready token (flattened)
├── ProxyDeployer.sol           # Proxy helper for upgradeable contracts
├── TODO.md                      # Outstanding development tasks
└── REMIX_DEPLOY_GUIDE.md       # Step-by-step Remix deployment guide
```

## Key Components

### Admin Dashboard (`/admin`)
Main interface for contract management, deployment, and interaction.

### Solidity Editor (`/admin/editor`)
Full-featured code editor with Monaco, real-time compilation, and templates.

### Contract Deployer (`/admin/deploy`)
Guided deployment flow for TokenV2 and custom contracts with proxy support.

### GodMode Co-pilot (`/nexus/godmode`)
AI-powered agent management for autonomous smart contract operations.

### Terminal (`/admin/terminal`)
WebSocket-based terminal emulation for running scripts and commands.

## Deployment

### Development Deployment
1. Use the admin dashboard's Deploy section
2. Select target network and contract type
3. Sign transactions with your wallet
4. Monitor deployment status in transaction history

### Production Deployment
See [REMIX_DEPLOY_GUIDE.md](./REMIX_DEPLOY_GUIDE.md) for detailed production deployment steps using Remix IDE or direct contract flattening.

## Smart Contracts

### TokenV2
An upgradeable ERC20 token contract featuring:
- Maximum supply limit
- Transfer constraints (can be removed by owner)
- Metadata URI support
- Permit functionality (EIP-2612)

**Production File**: `TokenV2_Flattened.sol` (all dependencies flattened)

### ProxyDeployer
Helper contract for deploying upgradeable contracts using the ERC1967 proxy pattern.

## Network Configuration

CrypD supports multiple EVM networks with pre-configured RPC endpoints and block explorers:

| Network | Chain ID | RPC | Explorer |
|---------|----------|-----|----------|
| Ethereum | 1 | Alchemy | Etherscan |
| BNB Chain | 56 | BSCScan | BSCScan |
| Polygon | 137 | QuickNode | PolygonScan |
| Arbitrum | 42161 | Arbitrum | Arbiscan |
| Optimism | 10 | Optimism | Etherscan |
| Base | 8453 | Base | BaseScan |
| Avalanche | 43114 | Avalanche | SnowTrace |

## Testing

Run contract tests:
```bash
# Unit tests
npm run test

# Test coverage
npm run test:coverage
```

## Contributing

Contributions are welcome! Please:
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m "Add your feature"`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a Pull Request

## Outstanding Tasks

See [TODO.md](./TODO.md) for a list of in-progress improvements and upcoming features.

## License

MIT License - See LICENSE file for details

## Support

- 📚 Check [DEVELOPMENT.md](./DEVELOPMENT.md) for setup help
- 🗺️ See [REMIX_DEPLOY_GUIDE.md](./REMIX_DEPLOY_GUIDE.md) for deployment steps
- 📋 Review [TODO.md](./TODO.md) for known issues

## Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for upgradeable contract libraries
- [wagmi](https://wagmi.sh/) for Web3 React hooks
- [viem](https://viem.sh/) for Ethereum client library
- [Tailwind CSS](https://tailwindcss.com/) for styling
