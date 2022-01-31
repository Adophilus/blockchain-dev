const { accounts, config, helpers, web3 } = require("./Token")
const moment = require("moment")

async function checkImplementation (METAMUSK) {
  let ret = (await METAMUSK.methods.implementation().call())

  for (let prop in ret) {
    console.log(prop)
  }
  process.exit(1)
}

async function fetchBalance (METAMUSK) {
  return await METAMUSK.methods.getBalance().call()
}

async function main () {
  let METAMUSK

  try {
    METAMUSK = await helpers.loadABI("METAMUSK")
  }
  catch (err) {
    try {
      METAMUSK = await helpers.fetchABI(config.tokens.bsc.erc20.METAMUSK, "bsc", config)
      helpers.saveABI(METAMUSK, "METAMUSK")
    }
    catch (err) {
      console.log("Couldn't fetch contract ABI")
      console.log(err)
      process.exit(1)
    }
  }
  
  // instantiate the Contract object
  METAMUSK = new web3.eth.Contract(METAMUSK, config.tokens.bsc.erc20.METAMUSK, { from: accounts.main.address })

  try {
    let implementation = await checkImplementation(METAMUSK)
    console.log(`Implementation: ${implementation}`)
  }
  catch (err) {
    console.log("Couldn't check implementation")
    console.log(err)
  }

  try {
    let balance = await fetchBalance(METAMUSK);
    console.log(`The balance of the ${accounts[0]} is ${balance}`)
  }
  catch (err) {
    console.log("Couldn't fetch balance")
    console.log(`Error: ${err}`)
  }

  return true
}

main();
