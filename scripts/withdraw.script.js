const { getNamedAccounts, ethers } = require('hardhat')
async function main() {
  const { deployer } = await getNamedAccounts()
  const FundMe = await ethers.getContract("FundMe", deployer)

  console.log("Funding Contract...")

  const transactionResponse = await FundMe.withdraw()
  await transactionResponse.wait(1)
  console.log("WITHDREW")
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e)
  process.exit(1)
})