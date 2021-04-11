// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import "./FakeCollateral.sol";

contract FakeCollateral_WETH is FakeCollateral {
    constructor(
        uint256 _genesis_supply,
        string memory _symbol,
        uint8 _decimals
    ) 
    FakeCollateral(_genesis_supply, _symbol, _decimals)
    public {}
}
