const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

if(!developmentChains.includes(network.name)) {
  describe("FundMe on staging", async () => {
    let FundMeContract
    let deployer
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async () => {
      deployer = (await getNamedAccounts()).deployer
      FundMeContract = await ethers.getContract('FundMe', deployer)
    })

    it('fails if not enough ETH is sent', async () => {
      // expect(FundMeContract.fund()).to.be.reverted
      expect(FundMeContract.fund()).to.be.revertedWith('You need to spend more ETH!')
    })
  })
} else {
  console.log('not in staging')
}

//describe.skip is a thing