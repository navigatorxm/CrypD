// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @dev ERC1967 Proxy — minimal upgradeable proxy
 * Used to deploy TokenV2 as an upgradeable contract via Remix IDE
 *
 * Deployment steps:
 *   1. Deploy TokenV2_Flattened.sol  → get implementation address
 *   2. Deploy this ERC1967Proxy with:
 *        _logic = <TokenV2 implementation address>
 *        _data  = encoded initialize() calldata (use encodeInit below)
 */

/**
 * @dev Storage slot for the implementation address (EIP-1967)
 */
contract ERC1967Proxy {
    // EIP-1967 implementation slot:
    // bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1)
    bytes32 private constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    // EIP-1967 admin slot
    bytes32 private constant _ADMIN_SLOT =
        0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    event Upgraded(address indexed implementation);
    event AdminChanged(address previousAdmin, address newAdmin);

    constructor(address _logic, bytes memory _data) payable {
        _setImplementation(_logic);
        _setAdmin(msg.sender);
        if (_data.length > 0) {
            (bool success, bytes memory returndata) = _logic.delegatecall(_data);
            if (!success) {
                if (returndata.length > 0) {
                    assembly {
                        revert(add(32, returndata), mload(returndata))
                    }
                }
                revert("ERC1967Proxy: initialization failed");
            }
        }
    }

    function _setImplementation(address newImplementation) private {
        require(
            newImplementation.code.length > 0,
            "ERC1967: new implementation is not a contract"
        );
        assembly {
            sstore(_IMPLEMENTATION_SLOT, newImplementation)
        }
        emit Upgraded(newImplementation);
    }

    function _setAdmin(address newAdmin) private {
        assembly {
            sstore(_ADMIN_SLOT, newAdmin)
        }
        emit AdminChanged(address(0), newAdmin);
    }

    function implementation() external view returns (address impl) {
        assembly {
            impl := sload(_IMPLEMENTATION_SLOT)
        }
    }

    function admin() external view returns (address adm) {
        assembly {
            adm := sload(_ADMIN_SLOT)
        }
    }

    fallback() external payable {
        assembly {
            let impl := sload(_IMPLEMENTATION_SLOT)
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    receive() external payable {}
}

/**
 * @dev Helper contract to encode the initialize() calldata for TokenV2
 * Deploy this, call encodeInit() with your parameters,
 * then use the returned bytes as the _data argument for ERC1967Proxy
 */
contract InitEncoder {
    function encodeInit(
        address _v2Pool,
        address _v3Pool,
        string memory name_,
        string memory symbol_,
        string memory meta_,
        uint256 maxSupply_
    ) external pure returns (bytes memory) {
        return abi.encodeWithSignature(
            "initialize(address,address,string,string,string,uint256)",
            _v2Pool,
            _v3Pool,
            name_,
            symbol_,
            meta_,
            maxSupply_
        );
    }
}
