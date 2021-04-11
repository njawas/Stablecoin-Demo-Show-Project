```
 __    __  __    __   ______   _______      __       __                                         
/  |  /  |/  |  /  | /      \ /       \    /  \     /  |                                        
$$ |  $$ |$$ |  $$ |/$$$$$$  |$$$$$$$  |   $$  \   /$$ |  ______   _______    ______   __    __ 
$$  \/$$/ $$ |  $$ |$$ \__$$/ $$ |  $$ |   $$$  \ /$$$ | /      \ /       \  /      \ /  |  /  |
 $$  $$<  $$ |  $$ |$$      \ $$ |  $$ |   $$$$  /$$$$ |/$$$$$$  |$$$$$$$  |/$$$$$$  |$$ |  $$ |
  $$$$  \ $$ |  $$ | $$$$$$  |$$ |  $$ |   $$ $$ $$/$$ |$$ |  $$ |$$ |  $$ |$$    $$ |$$ |  $$ |
 $$ /$$  |$$ \__$$ |/  \__$$ |$$ |__$$ |__ $$ |$$$/ $$ |$$ \__$$ |$$ |  $$ |$$$$$$$$/ $$ \__$$ |
$$ |  $$ |$$    $$/ $$    $$/ $$    $$//  |$$ | $/  $$ |$$    $$/ $$ |  $$ |$$       |$$    $$ |
$$/   $$/  $$$$$$/   $$$$$$/  $$$$$$$/ $$/ $$/      $$/  $$$$$$/  $$/   $$/  $$$$$$$/  $$$$$$$ |
                                                                                      /  \__$$ |
                                                                                      $$    $$/ 
                                                                                       $$$$$$/  
```





# XUSD Stablecoin

<p align="center">
🖥 Website – https://xusd.money
</p>


## What is XUSD?
<b> XUSD is a partial-collateralized and partial-algorithmic stablecoin protocol: </b>

  * <b>Partial-Collateralized</b> – Parts of XUSD supply is backed by collateral and parts of the supply algorithmic. The ratio of collateralized and algorithmic depends on the market's pricing of the XUSD stablecoin. If XUSD is trading at above $1, the protocol decreases the collateral ratio. If XUSD is trading at under $1, the protocol increases the collateral ratio. 
  * <b>Two Tokens</b> – XUSD is the stablecoin targeting a tight band around $1/coin. XUSD Shares (XUS) is the governance token which accrues seigniorage revenue and excess collateral value.
  * <b>Swap-based Monetary Policy</b> – XUSD uses principles from automated market makers like Uniswap to create swap-based price discovery and real-time stabilization incentives through arbitrage.
  * <b>Community Governance</b> – We will set the `owner_address` to a burn address and transfer the timelock admin to a multi-sig address when the protocol is stable, after that, all decisions must be made by community voting, and executed through the timelock contract. But before that, we would like to maintain some control over the protocol so that we can react fast to emergencies or new opportunities.
  * <b>Fair Distribution</b> 
      * No private sale & No premine
      * All XUS is minted as reward of liquidity farming
      * 4% staking rewards to dev address for development and marketing
      * Only 500 XUS & 500 XUSD minted at genesis to bootstrap liquidity
  * <b>Mint/Redeem Fees</b> 
      * 0.7% minting & 0.3% redemption fee at launch, decrease to zero gradually
      * Gathered to contract `XUSDFeePool`
      * Fees will be used to buyback XUS or distributed to XUS holders
  * <b>XUS Staking Rewards</b> 
      * ~~10 million~~ 500k total supply
      * Reward rate half every month, first month reward: min. 100k, max. 300k
      * Collateral ratio(CR) boost
          * No boost when global CR is 100%
          * 3x boost when global CR is 0%
          * 3*(1-CR) boost when global CR is between 0% and 100%

## Contracts

* XUSDStablecoin: 0x1c9BA9144505aaBa12f4b126Fda9807150b88f80
* XUSDShares: 0x875650dD46b60c592d5a69a6719e4e4187A3ca81
* XUSDFeePool: 0x6049B0831F8da67f3FE80f5FA07BD300E8f2F22C
* Timelock: 0x75061b5c168477499b3e297AdA97a1d22b72A264
* Collateral pools:
  * Pool_DAI: 0xf13a49Eb6b2F6918500ee5cf8b39bb15a38F5b32 (Chainlink oracle)
  * Pool_USDC: 0x75aAf03CBF330e2b3F0623c55B7a528CFCAE8d75 (Chainlink oracle)
* Staking pools:
  * XUS/XUSD-LP(30%): 0x608D8b1511Cb3eB7dbcCb5c626922EBfE7A62583
  * XUS/ETH-LP(20%): 0x39d8189306a254120EF88e0A465808BB6532d63B
  * LINK/XUSD-LP(20%): 0x5E20B7824f2A7Ba15fda7ECF1a2e6e05219De5aa
  * DAI/XUSD-LP(15%): 0x7b24E729aa3a39c0555509A486eA7a415b4Df934
  * ETH/XUSD-LP(15%): 0xdaB209915b683EA3cd338D20B07e3Bd63001b87A
* Oracles:
  * Uniswap_ETH/XUSD: 0xA98Ce5bB71652b58eF6D0ab23778a355f89639B1
  * Uniswap_XUS/ETH: 0x6c36E0eFb05733FeB2e2033d29B16314b20E04a2
  * ChainlinkDAIUSDPriceConsumer: 0x0cD255e2f97E9DCD28c375046bB45149097d7889
  * ChainlinkUSDCUSDPriceConsumer: 0xF67405E155B67a472b3c02dFeB0932C2579F4682