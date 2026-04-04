import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { source, fileName } = await req.json();

  if (!source) {
    return NextResponse.json({ error: 'No source provided' }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const solc = require('solc');

    const contractName = fileName?.replace('.sol', '') || 'Contract';

    const input = JSON.stringify({
      language: 'Solidity',
      sources: {
        [fileName || 'contract.sol']: { content: source },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode.object', 'evm.deployedBytecode.object'],
          },
        },
        optimizer: { enabled: true, runs: 200 },
      },
    });

    const output = JSON.parse(solc.compile(input));

    const errors: string[] = [];
    const warnings: string[] = [];

    if (output.errors) {
      for (const err of output.errors) {
        if (err.severity === 'error') {
          errors.push(err.formattedMessage || err.message);
        } else {
          warnings.push(err.formattedMessage || err.message);
        }
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors, warnings, abi: [], bytecode: '', contractName: '' });
    }

    // Find compiled contract
    const contracts = output.contracts;
    let abi: any[] = [];
    let bytecode = '';
    let detectedName = contractName;

    for (const file of Object.keys(contracts)) {
      for (const name of Object.keys(contracts[file])) {
        const compiled = contracts[file][name];
        if (compiled.evm?.bytecode?.object) {
          abi = compiled.abi || [];
          bytecode = compiled.evm.bytecode.object;
          detectedName = name;
          break;
        }
      }
      if (bytecode) break;
    }

    if (!bytecode) {
      return NextResponse.json({ errors: ['No bytecode generated. Check your contract.'], warnings, abi: [], bytecode: '', contractName: '' });
    }

    return NextResponse.json({ abi, bytecode, errors, warnings, contractName: detectedName });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Compilation failed' }, { status: 500 });
  }
}
