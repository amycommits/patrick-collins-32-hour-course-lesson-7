const { network } = require("hardhat")
const { developmentChains, DECIMALS, INITIAL_PRICE } = require('../helper-hardhat-config')



module.exports = async ({ getNamedAccounts, deployments}) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = network.config.chainId
  log({ chainId })
  if (developmentChains.includes(network.name)) {
    log("running the mocks")
    await deploy("MockV3Aggregator", {
      contract: "@chainlink/contracts/src/v0.6/tests/MockV3Aggregator.sol:MockV3Aggregator", 
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE]
    })
    log("Mocks Deployed!")
    log("------------------------------------------------")
    log("You are deploying to a local network, you'll need a local network running to interact")
    log("Please run `npx hardhat console` to interact with the deployed smart contracts!")
    log("------------------------------------------------")
  } else {
    log("not using hardhat/localhost skipping mocks")
  }
}

module.exports.tags = ['all', 'mocks']