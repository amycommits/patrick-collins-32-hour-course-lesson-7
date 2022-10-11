const { run } = require("hardhat");
const verify = async function verifyContract(contractAddress, args) {
  console.log('Verifying contract, please wait...')
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args
    })
  }
  catch (e){
    const message = e.message.toLowerCase().includes('already verified') ? 'Already Verified' : e

    console.error(message)
    
  } 
}

module.exports = { verify }