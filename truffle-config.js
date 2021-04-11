const path = require('path');
const envPath = path.join(__dirname, './.env');
require('dotenv').config({ path: envPath });

// const HDWalletProvider = require("@truffle/hdwallet-provider");
const HDWalletProvider = require("truffle-hdwallet-provider");

const providerFactory = () => {
	return new HDWalletProvider(
		process.env.PRIVKEY,
		process.env.NETWORK_ENDPOINT
	  )
  }

module.exports = {
	// Uncommenting the defaults below 
	// provides for an easier quick-start with Ganache.
	// You can also follow this format for other networks;
	// see <http://truffleframework.com/docs/advanced/configuration>
	// for more details on how to specify configuration options!
	//
	networks: {
		// development: {
		// 	host: "127.0.0.1",
		// 	port: 8545, // 7545
		// 	network_id: "*",
		// 	// gas: 0x1ffffffffffffe
		// },
		development: {
			host: "127.0.0.1",
			port: 8545,
			network_id: "*",
			// gas: 0x1ffffffffffffe
			websockets: true,        // Enable EventEmitter interface for web3 (default: false)
		},
		mainnet: {
			provider: providerFactory(),
			network_id: 1,
			gas: 8000000,      // Make sure this gas allocation isn't over 4M, which is the max
			gasPrice: 80000000000
		},
		ropsten: {
			provider: providerFactory(),
			network_id: 3,
			gas: 8000000      // Make sure this gas allocation isn't over 4M, which is the max
		},
		rinkeby: {
			provider: providerFactory(),
			network_id: 4,
			gas: 8000000      //  Sure this gas allocation isn't over 4M, which is the max
		},
		kovan: {
			provider: providerFactory(),
			network_id: 42,
			gas: 8000000      //  Sure this gas allocation isn't over 4M, which is the max
		}
	},
	compilers: {
		solc: {
			version: "0.6.11",
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	},
	mocha: {
		useColors: true,
	},
	plugins: ["truffle-contract-size", "truffle-plugin-verify"],
	api_keys: {
		etherscan: process.env.APIKEY
	}
};
