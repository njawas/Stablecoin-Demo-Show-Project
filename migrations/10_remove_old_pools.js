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


// Collateral Pools
const XUSDPoolLibrary = artifacts.require("XUSD/Pools/XUSDPoolLibrary");
const Pool_DAI = artifacts.require("XUSD/Pools/Pool_DAI");
const Pool_BAC = artifacts.require("XUSD/Pools/Pool_BAC");
const Pool_WETH = artifacts.require("XUSD/Pools/Pool_WETH");


// Oracles
const UniswapPairOracle_XUSD_WETH = artifacts.require("Oracle/Variants/UniswapPairOracle_XUSD_WETH");
const UniswapPairOracle_XUS_WETH = artifacts.require("Oracle/Variants/UniswapPairOracle_XUS_WETH");
const UniswapPairOracle_DAI_WETH = artifacts.require("Oracle/Variants/UniswapPairOracle_DAI_WETH");
const UniswapPairOracle_WETH_WETH = artifacts.require("Oracle/Variants/UniswapPairOracle_WETH_WETH");


// Chainlink Price Consumer
const ChainlinkETHUSDPriceConsumer = artifacts.require("Oracle/ChainlinkETHUSDPriceConsumer");
const ChainlinkETHUSDPriceConsumerTest = artifacts.require("Oracle/ChainlinkETHUSDPriceConsumerTest");

// XUSD core
const XUSDStablecoin = artifacts.require("XUSD/XUSDStablecoin");
const XUSDShares = artifacts.require("XUS/XUSDShares");

const Timelock = artifacts.require("Timelock");

// Staking contracts
const StakingRewards_XUS_WETH = artifacts.require("Staking/Variants/Stake_XUS_WETH.sol");
const StakingRewards_XUSD_WETH = artifacts.require("Staking/Variants/Stake_XUSD_WETH.sol");
const StakingRewards_XUS_XUSD = artifacts.require("Staking/Variants/Stake_XUS_XUSD.sol");
const StakingRewards_BAC_XUSD = artifacts.require("Staking/Variants/Stake_BAC_XUSD.sol");
const StakingRewards_XUSD = artifacts.require("Staking/Variants/Stake_XUSD.sol");

const DUMP_ADDRESS = "0x6666666666666666666666666666666666666666";

// Make sure Ganache is running beforehand
module.exports = async function(deployer, network, accounts) {

	const timelock = await Timelock.deployed();
	const timelock_addr = timelock.address;
	const owner_addr = accounts[0];

	const DEV_ADDRESS = "0xFb42719060e14888a569d20520FdE5116A2B126f";
	const DEV_FEE = new BigNumber("40000");

	const ONE_MILLION_DEC18 = new BigNumber("1000000e18");
	const ONE_DEC18 = new BigNumber("100e18");
	const FIVE_MILLION_DEC18 = new BigNumber("5000000e18");
	const TEN_MILLION_DEC18 = new BigNumber("10000000e18");
	const ONE_HUNDRED_MILLION_DEC18 = new BigNumber("100000000e18");
	const ONE_HUNDRED_MILLION_DEC6 = new BigNumber("100000000e6");
	const ONE_BILLION_DEC18 = new BigNumber("1000000000e18");
	const COLLATERAL_SEED_DEC18 = new BigNumber(508500e18);
	const start_time = new BigNumber(1609812000);

	let routerInstance;
	let uniswapFactoryInstance;
	let xusdInstance = await XUSDStablecoin.deployed();
	let xusInstance = await XUSDShares.deployed();
	let wethInstance;
	let bacInstance;
	let daiInstance;
	if(network === 'mainnet') {
		bacInstance = await FakeCollateral_BAC.at("0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a");
		wethInstance = await FakeCollateral_WETH.at("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
		daiInstance = await FakeCollateral_DAI.at("0x6B175474E89094C44Da98b954EedeAC495271d0F");
	} else {
		bacInstance = await FakeCollateral_BAC.deployed();
		wethInstance = await FakeCollateral_WETH.deployed();
		daiInstance = await FakeCollateral_DAI.deployed();
	}

	if (network !== 'development') {
		routerInstance = await UniswapV2Router02.at("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
		uniswapFactoryInstance = await UniswapV2Factory.at("0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");
	} else {
		routerInstance = await UniswapV2Router02_Modified.deployed();
		uniswapFactoryInstance = await UniswapV2Factory.deployed();
	}

	// const pair_addr_XUS_WETH = await uniswapFactoryInstance.getPair(xusInstance.address, wethInstance.address);

	// const pair_addr_XUSD_WETH = await uniswapFactoryInstance.getPair(xusdInstance.address, wethInstance.address);
	// const pair_addr_XUS_XUSD = await uniswapFactoryInstance.getPair(xusInstance.address, xusdInstance.address);
	// const pair_addr_BAC_XUSD = await uniswapFactoryInstance.getPair(bacInstance.address, xusdInstance.address);

	// ======== Deploy the staking contracts ========
	// console.log(chalk.yellow('===== DEPLOY THE STAKING CONTRACTS ====='));
	// await Promise.all([
	// 	deployer.deploy(StakingRewards_XUS_WETH, DEV_ADDRESS, DEV_FEE, xusInstance.address, pair_addr_XUS_WETH, XUSDStablecoin.address, timelock_addr, 100000, start_time)
	// ])
	
	// ======== Get various staking addresses ======== 
	const stakingInstance_XUS_WETH = await StakingRewards_XUS_WETH.deployed();
	const stakingInstance_XUSD_WETH = await StakingRewards_XUSD_WETH.deployed();
	const stakingInstance_XUS_XUSD = await StakingRewards_XUS_XUSD.deployed();
	const stakingInstance_BAC_XUSD = await StakingRewards_BAC_XUSD.deployed();
	const stakingInstance_XUSD = await StakingRewards_XUSD.deployed();

	// console.log(chalk.yellow.bold('======== Initialize the staking rewards ========'));
	// await Promise.all([
	// 	stakingInstance_XUS_WETH.initializeDefault()
	// ]);
	
	// add to XUS staking pools
	// console.log(`=====Adding reward pools to XUS contract=====`);
	// await xusInstance.addRewardPool.sendTransaction(stakingInstance_XUS_WETH.address, new BigNumber("1000000e18"));

	// adjust pool weights
	// await stakingInstance_XUSD_WETH.setPoolWeight.sendTransaction();
	// await stakingInstance_XUS_XUSD.setPoolWeight.sendTransaction();
	let n = new BigNumber("38580246913580246");

	// console.log(`update reward rate`);
	// await stakingInstance_XUSD_WETH.setRewardRate.sendTransaction(0);
	// await stakingInstance_XUS_WETH.setRewardRate.sendTransaction(0);
	// await stakingInstance_XUS_XUSD.setRewardRate.sendTransaction(0);
	// await stakingInstance_BAC_XUSD.setRewardRate.sendTransaction(0);
	// await stakingInstance_XUSD.setRewardRate.sendTransaction(0);
	
	// console.log('removing reward pools');
	// await xusInstance.removeRewardPool.sendTransaction(stakingInstance_BAC_XUSD.address);
	// await xusInstance.removeRewardPool.sendTransaction(stakingInstance_XUS_WETH.address);
	// await xusInstance.removeRewardPool.sendTransaction(stakingInstance_XUS_XUSD.address);
	await xusInstance.removeRewardPool.sendTransaction(stakingInstance_XUSD_WETH.address);
	await xusInstance.removeRewardPool.sendTransaction(stakingInstance_XUSD.address);
};
