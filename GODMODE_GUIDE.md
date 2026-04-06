# GodMode AI Co-pilot Guide

GodMode is CrypD's autonomous AI co-pilot feature for smart contract operations. It provides intelligent agent management, model configuration, and terminal integration for AI-driven development workflows.

## Overview

GodMode enables:
- **Autonomous agents**: AI-powered agents for contract operations
- **Model selection**: Choose from multiple LLM models
- **Parameter tuning**: Configure temperature and token limits
- **Real-time monitoring**: Track agent activity and output
- **Terminal integration**: Execute agent commands with live feedback

## Architecture

### Components

GodMode is composed of several integrated components:

#### 1. **GodModeControlPanel** (`GodModeControlPanel.tsx`)
Configuration interface for AI parameters.

**Controls**:
- **Temperature** (0.0 - 2.0): Controls creativity vs precision
  - Lower (0.0-0.5): Precise, deterministic responses
  - Middle (0.5-1.5): Balanced behavior
  - Higher (1.5-2.0): Creative, exploratory responses
- **Max Tokens** (256 - 8192): Maximum response length
  - 256-1024: Brief responses
  - 2048-4096: Detailed responses
  - 8192: Maximum context responses
- **System Status**: Real-time engine monitoring

#### 2. **GodModeModelSelector** (`GodModeModelSelector.tsx`)
Model selection and configuration.

**Supported Models**:
- GPT-4 (most capable, slower)
- GPT-3.5-Turbo (fast, good quality)
- Claude 3 (excellent reasoning)
- Local models (if configured)

**Usage**:
```typescript
<GodModeModelSelector 
  selectedModel={model}
  onModelChange={setModel}
  available={models}
/>
```

#### 3. **GodModeAgentList** (`GodModeAgentList.tsx`)
Displays active agents and their status.

**Features**:
- List of running agents
- Individual agent status indicators
- Activity history per agent
- Resource usage monitoring

#### 4. **GodModeTerminal** (`GodModeTerminal.tsx`)
Real-time terminal output for agent execution.

**Functionality**:
- Live output streaming
- Command history
- Error highlighting
- Input/output separation

## Getting Started

### 1. Access GodMode

Navigate to: `/nexus/godmode`

Or use the sidebar menu in the admin dashboard.

### 2. Configure AI Parameters

1. Open **Control Panel**
2. Adjust **Temperature** for response style:
   - For precise contract deployments: 0.1 - 0.3
   - For creative suggestions: 1.5 - 1.8
3. Set **Max Tokens** for response length
4. Verify **Engine Status** shows "Running"

### 3. Select AI Model

1. Click **Model Selector**
2. Choose from available models
3. Consider:
   - **Speed**: GPT-3.5-Turbo is fastest
   - **Quality**: Claude 3 or GPT-4 for complex reasoning
   - **Cost**: Smaller models are cheaper

### 4. Launch Agent

1. Click **Launch Agent**
2. Provide initial instructions
3. Monitor execution in **Terminal**
4. View agent status in **Agent List**

## Use Cases

### Smart Contract Deployment

```
Instruction: "Deploy TokenV2 contract to Polygon with maxSupply of 1,000,000 tokens"

Agent will:
1. Prepare deployment parameters
2. Encode contract initialization
3. Sign transaction
4. Monitor confirmation
```

### Contract Analysis

```
Instruction: "Analyze TokenV2.sol for gas optimization opportunities"

Agent will:
1. Review contract code
2. Identify inefficiencies
3. Suggest optimizations
4. Estimate gas savings
```

### Upgradeable Proxy Setup

```
Instruction: "Deploy TokenV2 with ERC1967 proxy on Ethereum Sepolia"

Agent will:
1. Deploy implementation contract
2. Deploy proxy contract
3. Initialize proxy with params
4. Verify upgradeable setup
```

## Configuration Examples

### Conservative Configuration
```typescript
{
  temperature: 0.2,      // Very precise
  maxTokens: 1024,       // Concise responses
  model: "gpt-3.5-turbo" // Fast execution
}
```
**Use for**: Deployments, critical operations

### Balanced Configuration
```typescript
{
  temperature: 0.7,      // Balanced
  maxTokens: 2048,       // Detailed responses
  model: "claude-3"      // Good reasoning
}
```
**Use for**: Analysis, planning, suggestions

### Creative Configuration
```typescript
{
  temperature: 1.5,      // Creative
  maxTokens: 4096,       // Long responses
  model: "gpt-4"         // Most capable
}
```
**Use for**: Brainstorming, exploratory analysis

## Terminal Integration

### Viewing Agent Output

The GodMode Terminal displays:
- **Command execution**: `$ <command>`
- **Output**: Agent response
- **Errors**: In red with stack traces
- **Logs**: Structured JSON if applicable

### Interacting with Agents

Commands available in terminal:

```bash
# Show agent status
godmode status

# View active agents
godmode list

# Stop running agent
godmode stop <agent_id>

# Get agent history
godmode history <agent_id>

# View system logs
godmode logs
```

## Agent Lifecycle

### States

1. **Pending**: Agent waiting to start
2. **Running**: Agent executing instructions
3. **Thinking**: Agent processing complex logic
4. **Waiting**: Awaiting user confirmation or input
5. **Complete**: Agent finished successfully
6. **Error**: Agent encountered an error

### Monitoring

View agent status in **Agent List**:
- Green indicator: Running successfully
- Yellow indicator: Processing/waiting
- Red indicator: Error encountered
- Gray indicator: Stopped

### Resource Limits

Each agent has limits:
- **Memory**: Max 2.4 GB per agent
- **Execution time**: Configurable timeout (default 30 minutes)
- **Token usage**: Capped by max tokens setting
- **Concurrent agents**: Up to 5 simultaneously

## Advanced Configuration

### Setting Custom System Prompt

```typescript
interface GodModeConfig {
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  model: string;
  tools: Tool[];
  constraints: Constraint[];
}
```

### Tool Integration

Agents can use available tools:
- **ContractDeployer**: Deploy contracts
- **TransactionSigner**: Sign transactions
- **ContractInteractor**: Call contract methods
- **CompilationEngine**: Compile Solidity
- **TerminalExecutor**: Run shell commands

### Constraints

Define operational constraints:
```typescript
{
  maxGasPrice: "100 gwei",
  minConfirmations: 3,
  allowedNetworks: ["ethereum", "polygon"],
  requiresApproval: true
}
```

## Best Practices

### 1. Clear Instructions

**Good**:
"Deploy TokenV2 contract with name='MyToken', symbol='MYT', maxSupply='1000000' on Polygon Mumbai testnet"

**Avoid**:
"Deploy the token thing on the testnet"

### 2. Appropriate Temperature

- **Deployments**: Low temperature (0.1-0.3)
- **Analysis**: Medium temperature (0.6-0.8)
- **Exploration**: High temperature (1.2-1.8)

### 3. Monitor Execution

- Watch terminal output for progress
- Check agent status for errors
- Review transaction logs
- Verify results on blockchain explorer

### 4. Error Handling

If agent encounters error:
1. Review error message in terminal
2. Adjust parameters if needed
3. Simplify instructions if too complex
4. Retry with confirmed parameters

## Troubleshooting

### Agent Won't Start

**Solution**: 
- Check engine status shows "Running"
- Verify WebSocket connection to `/ws/godmode`
- Try refreshing page

### Terminal Output Frozen

**Solution**:
- Check network connection
- Restart agent
- Clear terminal cache: Local Storage > Clear

### Model Selection Unavailable

**Solution**:
- Verify API credentials in environment
- Check available models: `godmode models`
- Ensure model subscription is active

### Slow Response Times

**Solution**:
- Reduce max tokens setting
- Choose faster model (GPT-3.5-Turbo)
- Simplify instructions
- Check network latency

## Security Considerations

### Important Notes

1. **Never expose API keys** in terminal output
2. **Private keys** should not be shared with agents
3. **Transactions** require explicit user confirmation
4. **Rate limiting** protects against abuse
5. **Audit logs** track all agent operations

### Best Practices

- Rotate API keys regularly
- Use testnet for experimentation
- Review agent actions before confirmation
- Enable 2FA for account security
- Monitor transaction costs

## Performance Optimization

### Reduce Latency

1. Use models closer to your location
2. Set lower max tokens
3. Simplify instructions
4. Use faster models for quick tasks

### Cost Optimization

1. GPT-3.5-Turbo: Cheapest, fast enough for most tasks
2. Set max tokens conservatively
3. Reuse successful configurations
4. Monitor API usage and costs

## Integration with Other Features

### With Contract Editor

Agent can review and improve code:
```
"Review TokenV2.sol and suggest gas optimizations"
```

### With Deployment Tools

Agent can automate deployments:
```
"Deploy TokenV2 to Ethereum, BSC, and Polygon with same parameters"
```

### With Transaction Dashboard

Agent provides transaction analysis:
```
"Analyze gas usage in last 10 transactions and suggest optimizations"
```

## API Reference

### Core Types

```typescript
interface Agent {
  id: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  model: string;
  temperature: number;
  maxTokens: number;
  startTime: number;
  endTime?: number;
  output: string;
  error?: string;
}

interface GodModeConfig {
  temperature: number;
  maxTokens: number;
  model: string;
  systemPrompt?: string;
}
```

### Events

```typescript
// Agent started
on('agent:start', (agent: Agent) => {})

// Agent output
on('agent:output', (chunk: string) => {})

// Agent complete
on('agent:complete', (agent: Agent) => {})

// Agent error
on('agent:error', (error: Error) => {})
```

## Resources

- **Component Docs**: `/frontend/src/components/nexus/`
- **Store Management**: `/frontend/src/store/index.ts`
- **Configuration**: `.env.local` (API keys)
- **Logs**: Browser DevTools Console

## Future Enhancements

Planned improvements to GodMode:

- [ ] Custom agent training
- [ ] Multi-agent collaboration
- [ ] Advanced reasoning mode
- [ ] Cost analytics dashboard
- [ ] Agent marketplace
- [ ] Batch operations
- [ ] Scheduled tasks
- [ ] Action replay/simulation

## Support

For issues or questions:

1. Check terminal output for error details
2. Review browser console logs
3. Check network connectivity
4. Verify API credentials
5. Try test configuration first
