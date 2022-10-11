require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
require("hardhat-gas-reporter");
require('solidity-coverage')
require('dotenv').config()


/** @type import('hardhat/config').HardhatUserConfig */

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ''
const GOERLI_PRIVATE_KEY_PASSWORD = process.env.GOERLI_PRIVATE_KEY_PASSWORD || ''
const OUTPUT_FILE = `./logs/gas-reports/${new Date()}-gas-report.log`
const COIN_MARKETCAP_API_KEY = process.env.COIN_MARKETCAP || ''
const TEST_GAS = process.env.TEST_GAS || false


module.exports = {
  solidity: {
    compilers: [
      {version: "0.8.17"},
      {version: "0.6.6"},
    ]
  },
  defaultNetwork: 'hardhat',
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: TEST_GAS ? true : false,
    outputFile: OUTPUT_FILE,
    noColors: true,
    currency: "USD",
    coinmarketcap: COIN_MARKETCAP_API_KEY,
    token: 'MATIC'
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [
        GOERLI_PRIVATE_KEY_PASSWORD
      ],
      chainId: 5,
      blockConfirmations: 6,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    }
  },
};
