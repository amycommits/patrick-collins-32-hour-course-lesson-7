const { network } = require('hardhat')
const { networkConfig } = require('../helper-hardhat-config')


module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = network.config.chainId

  let ethUsdPriceFeedAddress
  if (chainId === 31337 || !networkConfig[chainId]) {
    // running the mock
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
  }
  console.log({ ethUsdPriceFeedAddress })
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [],
    log: true
  })
}
// function main () {
//   console.log('HI?')
// }

// module.exports.default = main