// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;
pragma experimental ABIEncoderV2;

import "./AggregatorV3Interface.sol";
import "../Math/SignedSafeMath.sol";

contract ChainlinkUSDTUSDPriceConsumer {
    using SignedSafeMath for int256;

    AggregatorV3Interface internal priceFeedUSDTETH;
    AggregatorV3Interface internal priceFeedETHUSD;


    constructor() public {
        // mainnet
        priceFeedUSDTETH = AggregatorV3Interface(0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46); // usdt-eth.data.eth
        priceFeedETHUSD  = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419); // eth-usd.data.eth
        
        // kovan
        // priceFeedUSDTETH = AggregatorV3Interface(0x0bF499444525a23E7Bb61997539725cA2e928138); 
        // priceFeedETHUSD  = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331); 
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            , 
            int256 priceUSDTETH,
            ,
            ,
            
        ) = priceFeedUSDTETH.latestRoundData(); // 835781130862914, 18    


        (
            , 
            int256 priceETHUSD,
            ,
            ,
            
        ) = priceFeedETHUSD.latestRoundData(); // 119804000000, 8 
        
        

        int price = priceUSDTETH.mul(priceETHUSD).div(int256(10) ** priceFeedUSDTETH.decimals());


        return price;
    }

    function getDecimals() public view returns (uint8) {
        return priceFeedETHUSD.decimals();  //8
    }
    
    
}

