const path = require('path');
const envPath = path.join(__dirname, '../../.env');
require('dotenv').config({ path: envPath });

const BigNumber = require('bignumber.js');
require('@openzeppelin/test-helpers/configure')({
	provider: process.env.NETWORK_ENDPOINT,
});

const { expectEvent, send, shouldFail, time } = require('@openzeppelin/test-helpers');
const BIG6 = new BigNumber("1e6");
const BIG18 = new BigNumber("1e18");
const chalk = require('chalk');

const Address = artifacts.require("Utils/Address");
const BlockMiner = artifacts.require("Utils/BlockMiner");
const MigrationHelper = artifacts.require("Utils/MigrationHelper");
const StringHelpers = artifacts.require("Utils/StringHelpers");
const Math = artifacts.require("Math/Math");
const SafeMath = artifacts.require("Math/SafeMath");
const Babylonian = artifacts.require("Math/Babylonian");
const FixedPoint = artifacts.require("Math/FixedPoint");
const UQ112x112 = artifacts.require("Math/UQ112x112");
const Owned = artifacts.require("Staking/Owned");
const ERC20 = artifacts.require("ERC20/ERC20");
const ERC20Custom = artifacts.require("ERC20/ERC20Custom");
const SafeERC20 = artifacts.require("ERC20/SafeERC20");

// Uniswap related
const TransferHelper = artifacts.require("Uniswap/TransferHelper");
const SwapToPrice = artifacts.require("Uniswap/SwapToPrice");
const UniswapV2ERC20 = artifacts.require("Uniswap/UniswapV2ERC20");
const UniswapV2Factory = artifacts.require("Uniswap/UniswapV2Factory");
const UniswapV2Library = artifacts.require("Uniswap/UniswapV2Library");
const UniswapV2OracleLibrary = artifacts.require("Uniswap/UniswapV2OracleLibrary");
const UniswapV2Pair = artifacts.require("Uniswap/UniswapV2Pair");
const UniswapV2Router02 = artifacts.require("Uniswap/UniswapV2Router02");
const UniswapV2Router02_Modified = artifacts.require("Uniswap/UniswapV2Router02_Modified");

// Collateral
const WETH = artifacts.require("ERC20/WETH");
const FakeCollateral_DAI = artifacts.require("FakeCollateral/FakeCollateral_DAI");
const FakeCollateral_BAC = artifacts.require("FakeCollateral/FakeCollateral_BAC");
const FakeCollateral_WETH = artifacts.require("FakeCollateral/FakeCollateral_WETH");
const FakeCollateral_USDT = artifacts.require("FakeCollateral/FakeCollateral_USDT");
const FakeCollateral_USDC = artifacts.require("FakeCollateral/FakeCollateral_USDC");


// Collateral Pools
const XUSDPoolLibrary = artifacts.require("XUSD/Pools/XUSDPoolLibrary");
const Pool_DAI = artifacts.require("XUSD/Pools/Pool_DAI");
const Pool_BAC = artifacts.require("XUSD/Pools/Pool_BAC");
const Pool_WETH = artifacts.require("XUSD/Pools/Pool_WETH");

const Pool_DAI_NEW = artifacts.require("XUSD/Pools/Pool_DAI_NEW");
const Pool_USDC = artifacts.require("XUSD/Pools/Pool_USDC");
const Pool_USDT = artifacts.require("XUSD/Pools/Pool_USDT");


// Oracles
const UniswapPairOracle_XUSD_WETH = artifacts.require("Oracle/Variants/UniswapPairOracle_XUSD_WETH");
const UniswapPairOracle_XUS_WETH = artifacts.require("Oracle/Variants/UniswapPairOracle_XUS_WETH");
const UniswapPairOracle_DAI_WETH = artifacts.require("Oracle/Variants/UniswapPairOracle_DAI_WETH");
const UniswapPairOracle_WETH_WETH = artifacts.require("Oracle/Variants/UniswapPairOracle_WETH_WETH");


// Chainlink Price Consumer
const ChainlinkETHUSDPriceConsumer = artifacts.require("Oracle/ChainlinkETHUSDPriceConsumer");
const ChainlinkETHUSDPriceConsumerTest = artifacts.require("Oracle/ChainlinkETHUSDPriceConsumerTest");

const ChainlinkDAIUSDPriceConsumer = artifacts.require("Oracle/ChainlinkDAIUSDPriceConsumer");
const ChainlinkUSDCUSDPriceConsumer = artifacts.require("Oracle/ChainlinkUSDCUSDPriceConsumer");
const ChainlinkUSDTUSDPriceConsumer = artifacts.require("Oracle/ChainlinkUSDTUSDPriceConsumer");

// XUSD core
const XUSDStablecoin = artifacts.require("XUSD/XUSDStablecoin");
const XUSDShares = artifacts.require("XUS/XUSDShares");

const Timelock = artifacts.require("Timelock");
const XUSDFeePool = artifacts.require("XUSD/XUSDFeePool");

// Staking contracts
const StakingRewards_XUSD_WETH = artifacts.require("Staking/Variants/Stake_XUSD_WETH.sol");
const StakingRewards_XUS_WETH = artifacts.require("Staking/Variants/Stake_XUS_WETH.sol");
const StakingRewards_XUSD = artifacts.require("Staking/Variants/Stake_XUSD.sol");

const DUMP_ADDRESS = "0x6666666666666666666666666666666666666666";

// Make sure Ganache is running beforehand
module.exports = async function(deployer, network, accounts) {

	const timelock = await Timelock.deployed();
	const timelock_addr = timelock.address;
	let owner_address = accounts[0];

	const ONE_MILLION_DEC18 = new BigNumber("1000000e18");
	const ONE_DEC18 = new BigNumber("100e18");
	const FIVE_MILLION_DEC18 = new BigNumber("5000000e18");
	const TEN_MILLION_DEC18 = new BigNumber("10000000e18");
	const ONE_HUNDRED_MILLION_DEC18 = new BigNumber("100000000e18");
	const ONE_HUNDRED_MILLION_DEC6 = new BigNumber("100000000e6");
	const ONE_BILLION_DEC18 = new BigNumber("1000000000e18");
	const COLLATERAL_SEED_DEC18 = new BigNumber(508500e18);

	let col_instance_WETH;
	let col_instance_DAI;
	let col_instance_USDC;
	let col_instance_USDT;
	let xusdInstance = await XUSDStablecoin.deployed();
	let xusInstance = await XUSDShares.deployed();
	let feepoolInstance = await XUSDFeePool.deployed();
	if(network == 'mainnet') {
		col_instance_WETH = await FakeCollateral_WETH.at("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
		col_instance_DAI = await FakeCollateral_DAI.at("0x6B175474E89094C44Da98b954EedeAC495271d0F");
		col_instance_USDC = await FakeCollateral_USDC.at("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
		col_instance_USDT = await FakeCollateral_USDT.at("0xdAC17F958D2ee523a2206206994597C13D831ec7");
	} else {
		await deployer.deploy(FakeCollateral_DAI, FIVE_MILLION_DEC18, "DAI", 18);
		await deployer.deploy(FakeCollateral_WETH, FIVE_MILLION_DEC18, "WETH", 18);
		await deployer.deploy(FakeCollateral_USDC, FIVE_MILLION_DEC18, "USDC", 6);
		await deployer.deploy(FakeCollateral_USDT, FIVE_MILLION_DEC18, "USDT", 6);
		col_instance_WETH = await FakeCollateral_WETH.deployed();
		col_instance_DAI = await FakeCollateral_DAI.deployed();
		col_instance_USDC = await FakeCollateral_USDC.deployed();
		col_instance_USDT = await FakeCollateral_USDT.deployed();
	}
	// ============= Set the XUSD Pools ========
	// await deployer.deploy(XUSDPoolLibrary);
	console.log('deploying Pool_USDC...')
	await deployer.link(XUSDPoolLibrary, [Pool_USDC]);
	await Promise.all([
		deployer.deploy(Pool_USDC, xusdInstance.address, xusInstance.address, col_instance_USDC.address, timelock_addr, ONE_HUNDRED_MILLION_DEC6),
		// deployer.deploy(Pool_USDT, xusdInstance.address, xusInstance.address, col_instance_USDT.address, timelock_addr, ONE_HUNDRED_MILLION_DEC6)
	]);
	
	// ============= Get the pool instances ========
	const pool_instance_USDC = await Pool_USDC.deployed();
	// const pool_instance_USDT = await Pool_USDT.deployed();

	console.log(`Pool_USDC: ${pool_instance_USDC.address}`);
	// console.log(`Pool_USDT: ${pool_instance_USDT.address}`);

	// add to collateral pools
	console.log(`=====adding collateral pools to xusd=====`)
	await xusdInstance.addPool.sendTransaction(pool_instance_USDC.address);
	// await xusdInstance.addPool.sendTransaction(pool_instance_USDT.address);

	// set feepool address
	console.log(`=====setting feepool address=====`)
	await pool_instance_USDC.setFeePool.sendTransaction(feepoolInstance.address);
	// await pool_instance_USDT.setFeePool.sendTransaction(feepoolInstance.address);

	console.log('deploying chainlink USDT USDC oracles');
	await Promise.all([
		deployer.deploy(ChainlinkUSDCUSDPriceConsumer),
		// deployer.deploy(ChainlinkUSDTUSDPriceConsumer)
	]);
	console.log('setCollatUSDOracle...')
	let oracle_chainlink_USDC_USD = await ChainlinkUSDCUSDPriceConsumer.deployed();
	// let oracle_chainlink_USDT_USD = await ChainlinkUSDTUSDPriceConsumer.deployed();
	await pool_instance_USDC.setCollatUSDOracle(oracle_chainlink_USDC_USD.address);
	// await pool_instance_USDT.setCollatUSDOracle(oracle_chainlink_USDT_USD.address);
};
