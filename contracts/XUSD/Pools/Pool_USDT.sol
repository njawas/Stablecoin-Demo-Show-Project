// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import "./XUSDPool.sol";

contract Pool_USDT is XUSDPool {
    address public USDT_address;
    constructor(
        address _xusd_contract_address,
        address _xus_contract_address,
        address _collateral_address,
        address _timelock_address,
        uint256 _pool_ceiling
    ) 
    XUSDPool(_xusd_contract_address, _xus_contract_address, _collateral_address, _timelock_address, _pool_ceiling)
    public {
        USDT_address = _collateral_address;
    }
}
