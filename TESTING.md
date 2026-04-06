# Testing Guide

This document describes the testing setup and procedures for CrypD smart contracts and frontend.

## Test Structure

### Smart Contract Tests

Located in `/tests/` directory:

- **Ballot_test.sol**: Remix-style tests for the Ballot contract using `remix_tests.sol` framework
- **storage.test.js**: JavaScript/Hardhat tests for the Storage contract using Chai assertions

### Test Types

#### 1. Solidity Tests (Remix Tests)

Used for testing contracts directly in Solidity.

**File**: `tests/Ballot_test.sol`

```solidity
import "remix_tests.sol";

contract BallotTest {
    function checkWinningProposal() public {
        // Test assertions
        Assert.equal(...);
    }
}
```

**Running Remix Tests**:
1. Open in Remix IDE
2. Go to Test tab
3. Select and run individual tests or "Run All"

#### 2. JavaScript Tests (Hardhat/Chai)

Used for integration testing with ethers.js.

**File**: `tests/storage.test.js`

```javascript
describe("Storage", function () {
  it("test initial value", async function () {
    const Storage = await ethers.getContractFactory("Storage");
    const storage = await Storage.deploy();
    expect((await storage.retrieve()).toNumber()).to.equal(0);
  });
});
```

**Running JavaScript Tests**:
```bash
# Via Hardhat
npx hardhat test

# Via Chai
npx mocha tests/**/*.test.js
```

## Test Coverage

### Current Coverage

| Contract | Tests | Coverage |
|----------|-------|----------|
| Storage | 2 | Basic (initial value, update/retrieve) |
| Ballot | 1 | Partial (winning proposal) |
| TokenV2 | 0 | Not yet covered |

### Recommended Coverage

Add tests for:
- TokenV2 initialization
- Token transfers with constraints
- Permit functionality
- Owner-only functions
- Proxy upgrades
- Access control

## Running Tests

### Setup

```bash
# Install test dependencies
npm install

# For Hardhat tests
npm install --save-dev hardhat ethers chai
```

### Execute Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/storage.test.js

# Run with verbose output
npm test -- --verbose

# Run with coverage report
npm run test:coverage
```

### Continuous Testing

```bash
# Watch mode - rerun tests on file changes
npm run test:watch
```

## Writing New Tests

### Solidity Test Template

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "remix_tests.sol";
import "../contracts/src/TokenV2.sol";

contract TokenV2Test {
    TokenV2 tokenV2;
    
    function beforeAll() public {
        // Setup before each test
        tokenV2 = new TokenV2();
    }
    
    function testInitialize() public {
        // Implement test
        Assert.equal(address(tokenV2), address(tokenV2), "Contract deployed");
    }
}
```

### JavaScript Test Template

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenV2", function () {
    let tokenV2;
    let owner;
    
    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        const TokenV2Factory = await ethers.getContractFactory("TokenV2");
        tokenV2 = await TokenV2Factory.deploy();
        await tokenV2.deployed();
    });
    
    it("should initialize with correct parameters", async function () {
        // Test assertion
        expect(await tokenV2.maxSupply()).to.equal(0);
    });
});
```

## Testing Best Practices

### 1. Test Organization

- **One contract per test file**: `TokenV2.test.js`
- **Grouped by functionality**: `describe()` blocks
- **Clear test names**: "should transfer tokens when not constrained"

### 2. Assertions

Use clear, specific assertions:

```javascript
// Good
expect(balance).to.equal(expectedValue);

// Avoid
expect(balance).to.be.ok;
```

### 3. Setup and Teardown

```javascript
beforeEach(async function () {
    // Setup for each test
});

afterEach(async function () {
    // Cleanup if needed
});
```

### 4. Test Independence

- Tests should not depend on each other
- Use `beforeEach()` to reset state
- Avoid shared test fixtures

### 5. Error Testing

```javascript
// Test for expected errors
it("should revert when unauthorized", async function () {
    await expect(
        tokenV2.removeTransferConstraints()
    ).to.be.revertedWith("Ownable: caller is not the owner");
});
```

## Debugging Tests

### Hardhat Console Output

Add logging in tests:

```javascript
console.log("Token address:", tokenV2.address);
console.log("Owner balance:", await tokenV2.balanceOf(owner.address));
```

### Debug Transactions

```javascript
const tx = await tokenV2.transfer(other.address, amount);
const receipt = await tx.wait();
console.log("Gas used:", receipt.gasUsed.toString());
```

### Remix IDE Testing

1. Open `tests/Ballot_test.sol`
2. Use Remix's Test tab
3. View execution logs
4. Step through test execution

## Continuous Integration

GitHub Actions workflow automatically runs tests on:
- Push to main, develop, or feature branches
- Pull requests

See `.github/workflows/test.yml` for configuration.

### CI Test Results

Tests must pass before merging PRs. Check the CI status:
1. GitHub PR checks section
2. GitHub Actions logs
3. Local test run before pushing

## Test Metrics

### Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 85%
- **Lines**: > 80%

### Generate Coverage Report

```bash
npx hardhat coverage
```

This generates HTML report in `coverage/` directory.

## Common Testing Issues

### Issue: "Contract not found"
**Solution**: Ensure contract path is correct in import

### Issue: "ethers is not defined"
**Solution**: Add `const { ethers } = require("hardhat");` at top

### Issue: Tests timeout
**Solution**: Increase timeout: `this.timeout(10000);`

### Issue: Contract deployment fails in test
**Solution**: Verify constructor parameters match contract interface

## Performance Testing

For gas optimization testing:

```javascript
const tx = await contract.functionName();
const receipt = await tx.wait();
console.log("Gas used:", receipt.gasUsed.toString());
```

Target gas limits:
- Token transfer: < 60,000 gas
- Approve: < 50,000 gas
- Complex operations: < 200,000 gas

## Test Maintenance

- Update tests when contracts change
- Remove obsolete tests
- Keep test code clean and readable
- Document complex test scenarios
- Review coverage reports regularly

## Resources

- [Hardhat Testing](https://hardhat.org/tutorial/testing-contracts)
- [Chai Assertions](https://www.chaijs.com/api/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Remix Unit Testing](https://remix-ide.readthedocs.io/en/latest/unit_testing.html)

## Next Steps

To improve test coverage:

1. Add TokenV2 initialization tests
2. Test transfer with constraints
3. Test permit functionality
4. Add integration tests
5. Set up coverage reporting in CI
6. Establish 80%+ coverage goal
