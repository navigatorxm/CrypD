export const CONTRACT_TEMPLATES: Record<string, { name: string; description: string; source: string; category: string }> = {
  erc20: {
    name: 'ERC20 Token',
    description: 'Standard ERC20 token with mint, burn, pause, and ownership',
    category: 'Token',
    source: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract {{NAME}} is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    uint256 public maxSupply;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        uint256 maxSupply_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        maxSupply = maxSupply_ * 10 ** decimals();
        _mint(msg.sender, initialSupply_ * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function _update(address from, address to, uint256 value)
        internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}`,
  },

  erc20_tax: {
    name: 'ERC20 + Tax',
    description: 'ERC20 with buy/sell tax mechanics and auto-liquidity',
    category: 'Token',
    source: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract {{NAME}} {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    uint256 public maxSupply;
    address public owner;
    bool public tradingEnabled;

    uint256 public buyTax = 3;    // 3%
    uint256 public sellTax = 5;   // 5%
    address public taxWallet;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public isExcludedFromTax;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }

    constructor(string memory _name, string memory _symbol, uint256 _supply) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        taxWallet = msg.sender;
        maxSupply = _supply * 10 ** decimals;
        _mint(msg.sender, maxSupply);
        isExcludedFromTax[msg.sender] = true;
    }

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transferWithTax(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        allowance[from][msg.sender] -= amount;
        _transferWithTax(from, to, amount);
        return true;
    }

    function _transferWithTax(address from, address to, uint256 amount) internal {
        uint256 taxAmount = 0;
        if (!isExcludedFromTax[from] && !isExcludedFromTax[to]) {
            taxAmount = (amount * sellTax) / 100;
        }
        balanceOf[from] -= amount;
        balanceOf[taxWallet] += taxAmount;
        balanceOf[to] += (amount - taxAmount);
        emit Transfer(from, taxWallet, taxAmount);
        emit Transfer(from, to, amount - taxAmount);
    }

    function setTax(uint256 _buy, uint256 _sell) external onlyOwner {
        require(_buy <= 25 && _sell <= 25, "Tax too high");
        buyTax = _buy; sellTax = _sell;
    }

    function enableTrading() external onlyOwner { tradingEnabled = true; }
    function excludeFromTax(address addr, bool excluded) external onlyOwner {
        isExcludedFromTax[addr] = excluded;
    }
}`,
  },

  erc721: {
    name: 'ERC721 NFT Collection',
    description: 'Full NFT collection with reveal, royalties, whitelist, and public mint',
    category: 'NFT',
    source: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract {{NAME}} is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public maxSupply;
    uint256 public mintPrice;
    uint256 public maxPerWallet = 5;
    bool public revealed;
    bool public publicMintOpen;
    bool public whitelistMintOpen;
    string public baseURI;
    string public notRevealedURI;
    uint96 public royaltyBps = 500; // 5%

    mapping(address => bool) public whitelist;
    mapping(address => uint256) public mintedPerWallet;

    event Minted(address indexed to, uint256 tokenId);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        uint256 mintPrice_,
        string memory notRevealedURI_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        maxSupply = maxSupply_;
        mintPrice = mintPrice_;
        notRevealedURI = notRevealedURI_;
    }

    function mint(uint256 quantity) external payable {
        require(publicMintOpen, "Public mint not open");
        require(msg.value >= mintPrice * quantity, "Insufficient ETH");
        require(totalSupply() + quantity <= maxSupply, "Exceeds max supply");
        require(mintedPerWallet[msg.sender] + quantity <= maxPerWallet, "Exceeds per-wallet limit");
        mintedPerWallet[msg.sender] += quantity;
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = totalSupply() + 1;
            _safeMint(msg.sender, tokenId);
            emit Minted(msg.sender, tokenId);
        }
    }

    function whitelistMint(uint256 quantity) external payable {
        require(whitelistMintOpen, "Whitelist mint not open");
        require(whitelist[msg.sender], "Not whitelisted");
        require(msg.value >= mintPrice * quantity, "Insufficient ETH");
        require(totalSupply() + quantity <= maxSupply, "Exceeds max supply");
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(msg.sender, totalSupply() + 1);
        }
    }

    function ownerMint(address to, uint256 quantity) external onlyOwner {
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(to, totalSupply() + 1);
        }
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        if (!revealed) return notRevealedURI;
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }

    function reveal(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
        revealed = true;
    }

    function setWhitelist(address[] calldata addresses, bool status) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelist[addresses[i]] = status;
        }
    }

    function setMintState(bool _public, bool _whitelist) external onlyOwner {
        publicMintOpen = _public;
        whitelistMintOpen = _whitelist;
    }

    function withdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}`,
  },

  erc1155: {
    name: 'ERC1155 Multi-Token',
    description: 'Multi-token standard for gaming items, editions, and semi-fungibles',
    category: 'NFT',
    source: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract {{NAME}} is ERC1155, ERC1155Burnable, Ownable {
    string public name;
    string public symbol;

    mapping(uint256 => uint256) public maxSupply;
    mapping(uint256 => uint256) public totalMinted;
    mapping(uint256 => uint256) public mintPrice;
    mapping(uint256 => bool) public mintActive;

    event TokenCreated(uint256 indexed id, uint256 maxSupply, uint256 price);

    constructor(string memory name_, string memory symbol_, string memory uri_)
        ERC1155(uri_) Ownable(msg.sender) {
        name = name_;
        symbol = symbol_;
    }

    function createToken(uint256 id, uint256 _maxSupply, uint256 _price) external onlyOwner {
        maxSupply[id] = _maxSupply;
        mintPrice[id] = _price;
        mintActive[id] = true;
        emit TokenCreated(id, _maxSupply, _price);
    }

    function mint(uint256 id, uint256 amount) external payable {
        require(mintActive[id], "Minting not active");
        require(msg.value >= mintPrice[id] * amount, "Insufficient ETH");
        require(totalMinted[id] + amount <= maxSupply[id], "Exceeds max supply");
        totalMinted[id] += amount;
        _mint(msg.sender, id, amount, "");
    }

    function ownerMint(address to, uint256 id, uint256 amount) external onlyOwner {
        require(totalMinted[id] + amount <= maxSupply[id], "Exceeds max supply");
        totalMinted[id] += amount;
        _mint(to, id, amount, "");
    }

    function setURI(string memory newuri) external onlyOwner { _setURI(newuri); }
    function setMintActive(uint256 id, bool active) external onlyOwner { mintActive[id] = active; }
    function withdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}`,
  },

  multisig: {
    name: 'Multi-Sig Wallet',
    description: 'M-of-N multi-signature wallet for treasury management',
    category: 'Governance',
    source: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract {{NAME}} {
    address[] public owners;
    uint256 public required;

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 confirmations;
    }

    Transaction[] public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmed;
    mapping(address => bool) public isOwner;

    event Deposit(address indexed sender, uint256 value);
    event Submit(uint256 indexed txId);
    event Confirm(address indexed owner, uint256 indexed txId);
    event Revoke(address indexed owner, uint256 indexed txId);
    event Execute(uint256 indexed txId);

    modifier onlyOwner() { require(isOwner[msg.sender], "Not owner"); _; }
    modifier txExists(uint256 txId) { require(txId < transactions.length, "Tx does not exist"); _; }
    modifier notExecuted(uint256 txId) { require(!transactions[txId].executed, "Already executed"); _; }

    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length > 0 && _required > 0 && _required <= _owners.length);
        for (uint256 i = 0; i < _owners.length; i++) {
            isOwner[_owners[i]] = true;
            owners.push(_owners[i]);
        }
        required = _required;
    }

    receive() external payable { emit Deposit(msg.sender, msg.value); }

    function submit(address _to, uint256 _value, bytes calldata _data) external onlyOwner {
        transactions.push(Transaction({ to: _to, value: _value, data: _data, executed: false, confirmations: 0 }));
        emit Submit(transactions.length - 1);
    }

    function confirm(uint256 txId) external onlyOwner txExists(txId) notExecuted(txId) {
        require(!confirmed[txId][msg.sender], "Already confirmed");
        confirmed[txId][msg.sender] = true;
        transactions[txId].confirmations++;
        emit Confirm(msg.sender, txId);
    }

    function execute(uint256 txId) external txExists(txId) notExecuted(txId) {
        require(transactions[txId].confirmations >= required, "Not enough confirmations");
        Transaction storage txn = transactions[txId];
        txn.executed = true;
        (bool success, ) = txn.to.call{value: txn.value}(txn.data);
        require(success, "Execution failed");
        emit Execute(txId);
    }

    function revoke(uint256 txId) external onlyOwner txExists(txId) notExecuted(txId) {
        require(confirmed[txId][msg.sender], "Not confirmed");
        confirmed[txId][msg.sender] = false;
        transactions[txId].confirmations--;
        emit Revoke(msg.sender, txId);
    }

    function getOwners() external view returns (address[] memory) { return owners; }
    function getTransactionCount() external view returns (uint256) { return transactions.length; }
}`,
  },

  dao: {
    name: 'DAO Governor',
    description: 'On-chain governance with proposals, voting, and timelock',
    category: 'Governance',
    source: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract {{NAME}} {
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        address target;
        bytes callData;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startBlock;
        uint256 endBlock;
        bool executed;
        bool canceled;
    }

    address public token; // governance token
    uint256 public votingPeriod = 50400; // ~7 days
    uint256 public quorum = 100e18; // 100 tokens
    uint256 public proposalCount;

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed id, address proposer, string description);
    event Voted(uint256 indexed id, address voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed id);

    constructor(address _token) { token = _token; }

    function propose(address target, bytes calldata data, string calldata description)
        external returns (uint256) {
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount, proposer: msg.sender, description: description,
            target: target, callData: data, votesFor: 0, votesAgainst: 0,
            startBlock: block.number, endBlock: block.number + votingPeriod,
            executed: false, canceled: false
        });
        emit ProposalCreated(proposalCount, msg.sender, description);
        return proposalCount;
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(block.number <= p.endBlock, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        uint256 weight = 1e18; // simplified — use token balance in production
        hasVoted[proposalId][msg.sender] = true;
        if (support) p.votesFor += weight;
        else p.votesAgainst += weight;
        emit Voted(proposalId, msg.sender, support, weight);
    }

    function execute(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(block.number > p.endBlock, "Voting not ended");
        require(!p.executed, "Already executed");
        require(p.votesFor > p.votesAgainst, "Proposal defeated");
        require(p.votesFor >= quorum, "Quorum not reached");
        p.executed = true;
        (bool success, ) = p.target.call(p.callData);
        require(success, "Execution failed");
        emit ProposalExecuted(proposalId);
    }

    function getProposal(uint256 id) external view returns (Proposal memory) {
        return proposals[id];
    }
}`,
  },

  staking: {
    name: 'Staking Contract',
    description: 'Token staking with rewards distribution',
    category: 'DeFi',
    source: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract {{NAME}} {
    IERC20 public stakingToken;
    IERC20 public rewardToken;
    address public owner;

    uint256 public rewardRate = 100; // tokens per second (scaled)
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    uint256 public totalStaked;

    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public userRewardPerTokenPaid;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    constructor(address _stakingToken, address _rewardToken) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        owner = msg.sender;
        lastUpdateTime = block.timestamp;
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) return rewardPerTokenStored;
        return rewardPerTokenStored +
            (((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / totalStaked);
    }

    function earned(address account) public view returns (uint256) {
        return ((stakedBalance[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18)
            + rewards[account];
    }

    function stake(uint256 amount) external updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        totalStaked += amount;
        stakedBalance[msg.sender] += amount;
        stakingToken.transferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external updateReward(msg.sender) {
        require(stakedBalance[msg.sender] >= amount, "Insufficient balance");
        totalStaked -= amount;
        stakedBalance[msg.sender] -= amount;
        stakingToken.transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function claimReward() external updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.transfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function setRewardRate(uint256 _rate) external onlyOwner { rewardRate = _rate; }
}`,
  },

  airdrop: {
    name: 'Airdrop Distributor',
    description: 'Batch airdrop tokens to multiple addresses',
    category: 'Token',
    source: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract {{NAME}} {
    address public owner;

    event AirdropCompleted(address token, uint256 recipients, uint256 totalAmount);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }

    constructor() { owner = msg.sender; }

    function airdropEqual(
        address token,
        address[] calldata recipients,
        uint256 amountEach
    ) external onlyOwner {
        IERC20 t = IERC20(token);
        uint256 total = amountEach * recipients.length;
        require(t.allowance(msg.sender, address(this)) >= total, "Allowance too low");
        for (uint256 i = 0; i < recipients.length; i++) {
            t.transferFrom(msg.sender, recipients[i], amountEach);
        }
        emit AirdropCompleted(token, recipients.length, total);
    }

    function airdropVariable(
        address token,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(recipients.length == amounts.length, "Length mismatch");
        IERC20 t = IERC20(token);
        uint256 total;
        for (uint256 i = 0; i < amounts.length; i++) total += amounts[i];
        require(t.allowance(msg.sender, address(this)) >= total, "Allowance too low");
        for (uint256 i = 0; i < recipients.length; i++) {
            t.transferFrom(msg.sender, recipients[i], amounts[i]);
        }
        emit AirdropCompleted(token, recipients.length, total);
    }

    function withdrawToken(address token) external onlyOwner {
        IERC20 t = IERC20(token);
        t.transfer(owner, t.allowance(address(this), address(this)));
    }
}`,
  },
};

export const TEMPLATE_CATEGORIES = ['All', 'Token', 'NFT', 'Governance', 'DeFi'];
