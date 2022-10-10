require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
require("hardhat-gas-reporter");
require('solidity-coverage')
require('dotenv').config()


/** @type import('hardhat/config').HardhatUserConfig */

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ''
const GOERLI_PRIVATE_KEY_PASSWORD = process.env.GOERLI_PRIVATE_KEY_PASSWORD || ''


module.exports = {
  // solidity: "0.8.17",
  solidity: {
    compilers: [
      {version: "0.8.17"},
      {version: "0.6.6"},
    ]
  },
  defaultNetwork: 'hardhat',
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
      chainId: 5
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    }
  },
};
