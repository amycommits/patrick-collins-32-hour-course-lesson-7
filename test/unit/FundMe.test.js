const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

if(developmentChains.includes(network.name)) {
describe("FundMe", async () => {
  let FundMeContract
  let deployer
  let mockV3Aggregator
  const sendValue = ethers.utils.parseEther('1')
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture(["all"])
    FundMeContract = await ethers.getContract('FundMe', deployer)
    mockV3Aggregator = await ethers.getContract('MockV3Aggregator', deployer)
  })
  describe('constructor', async () => {
    it('sets the aggregator addresses as expected', async () => {
      const actual = await FundMeContract.getPriceFeed()
      const expected = mockV3Aggregator.address
      assert.equal(actual, expected)
    })
  })
  describe('fund', async () => {
    it('fails if not enough ETH is sent', async () => {
      // expect(FundMeContract.fund()).to.be.reverted
      expect(FundMeContract.fund()).to.be.revertedWith('You need to spend more ETH!')
    })
    it('updated the amount funded data structure', async () => {
      await FundMeContract.fund({value: sendValue})
      const actual = await FundMeContract.getAddressToAmountFunded(deployer)
      assert.equal(actual.toString(), sendValue.toString())
    })
    it('adds to a funder mapping', async () => {
      await FundMeContract.fund({value: sendValue})
      const funder = await FundMeContract.getFunder(0)
      assert.equal(funder, deployer)
    })
  })
  describe('withdraw', async () => {
    beforeEach(async () => {
      await FundMeContract.fund({value: sendValue})
    })
    it('withdraw ETH from a single founder', async () => {
      const startingFundMeBalance = await FundMeContract.provider.getBalance(FundMeContract.address)
      const startingDeployerBalance = await FundMeContract.provider.getBalance(deployer)

      const transactionResponse = await FundMeContract.withdraw()
      const transactionReceipt = await transactionResponse.wait(1)
      const { gasUsed, effectiveGasPrice } = transactionReceipt
      const gasCost = gasUsed.mul(effectiveGasPrice)
      
      const endingFundMeBalance = await FundMeContract.provider.getBalance(FundMeContract.address)
      const endingDeployerBalance = await FundMeContract.provider.getBalance(deployer)

      assert.equal(endingFundMeBalance, 0)
      assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString())

    })
    it('allows us to withdraw with multiple founders', async () => {
      // setup
      const accounts = await ethers.getSigners()
      Array.from({length: 4}).forEach(async (x,i) => {
        if (i > 0) {
          const fundMeConnectedContract = await FundMeContract.connect(accounts[i])
          await fundMeConnectedContract.fund({ value: sendValue })
        }
      })
      const startingFundMeBalance = await FundMeContract.provider.getBalance(FundMeContract.address)
      const startingDeployerBalance = await FundMeContract.provider.getBalance(deployer)

      // act
      const transactionResponse = await FundMeContract.withdraw()
      const transactionReceipt = await transactionResponse.wait(1)
      const { gasUsed, effectiveGasPrice } = transactionReceipt
      const gasCost = gasUsed.mul(effectiveGasPrice)

      // assertions!
      const endingFundMeBalance = await FundMeContract.provider.getBalance(FundMeContract.address)
      const endingDeployerBalance = await FundMeContract.provider.getBalance(deployer)

      assert.equal(endingFundMeBalance, 0)
      
      await expect(FundMeContract.getFunder(0)).to.be.reverted
      Array.from({length: 4}).forEach(async (x,i) => {
          assert.equal(await FundMeContract.getAddressToAmountFunded(accounts[i].address), 0)
      })
    })
    it('cheaperWithdraw with muliple founders', async () => {
      // setup
      const accounts = await ethers.getSigners()
      Array.from({length: 4}).forEach(async (x,i) => {
        if (i > 0) {
          const fundMeConnectedContract = await FundMeContract.connect(accounts[i])
          await fundMeConnectedContract.fund({ value: sendValue })
        }
      })
      const startingFundMeBalance = await FundMeContract.provider.getBalance(FundMeContract.address)
      const startingDeployerBalance = await FundMeContract.provider.getBalance(deployer)

      // act
      const transactionResponse = await FundMeContract.cheaperWithdraw()
      const transactionReceipt = await transactionResponse.wait(1)
      const { gasUsed, effectiveGasPrice } = transactionReceipt
      const gasCost = gasUsed.mul(effectiveGasPrice)

      // assertions!
      const endingFundMeBalance = await FundMeContract.provider.getBalance(FundMeContract.address)
      const endingDeployerBalance = await FundMeContract.provider.getBalance(deployer)

      assert.equal(endingFundMeBalance, 0)
      
      await expect(FundMeContract.getFunder(0)).to.be.reverted
      Array.from({length: 4}).forEach(async (x,i) => {
          assert.equal(await FundMeContract.getAddressToAmountFunded(accounts[i].address), 0)
      })
    })
    it('cheaperWithdraw ETH from a single founder', async () => {
      const startingFundMeBalance = await FundMeContract.provider.getBalance(FundMeContract.address)
      const startingDeployerBalance = await FundMeContract.provider.getBalance(deployer)

      const transactionResponse = await FundMeContract.cheaperWithdraw()
      const transactionReceipt = await transactionResponse.wait(1)
      const { gasUsed, effectiveGasPrice } = transactionReceipt
      const gasCost = gasUsed.mul(effectiveGasPrice)
      
      const endingFundMeBalance = await FundMeContract.provider.getBalance(FundMeContract.address)
      const endingDeployerBalance = await FundMeContract.provider.getBalance(deployer)

      assert.equal(endingFundMeBalance, 0)
      assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString())

    })
    it("only allows the owner to withdraw", async () => {
      const accounts = await ethers.getSigners()
      const unauthorized = accounts[1]
      const unauthorizedConnectedContract = await FundMeContract.connect(unauthorized)
    await expect(unauthorizedConnectedContract.withdraw()).to.be.revertedWithCustomError(FundMeContract, "FundMe__NotOwner")
    })
  }),
  it("only allows the owner to withdraw", async () => {
    const accounts = await ethers.getSigners()
    const unauthorized = accounts[1]
    const unauthorizedConnectedContract = await FundMeContract.connect(unauthorized)
  await expect(unauthorizedConnectedContract.withdraw()).to.be.revertedWithCustomError(FundMeContract, "FundMe__NotOwner")
  })
})
} else {
  console.log('not in dev')
}