const { accounts, config, helpers, web3 } = require("./Token")
const moment = require("moment")

async function main () {
  let ShibaMusk

  try {
    ShibaMusk = await helpers.loadABI("ShibaMusk");
  }
  catch (err) {
    try {
      // ShibaMusk = await helpers.fetchABI(config.tokens.bsc.erc20.ShibaMusk, "bsc", config)
      ShibaMusk = await helpers.fetchABI("0x1074d5bf122985da98e131fef7397f51f9978c7b", "bsc", config)
      helpers.saveABI(ShibaMusk, "ShibaMusk")
    }
    catch (err) {
      console.log("Couldn't fetch ABI")
      console.log(err)
      process.exit(1)
    }
  }
  
  // instantiate the Contract object
  ShibaMusk = new web3.eth.Contract(ShibaMusk, config.tokens.bsc.erc20.ShibaMusk, { from: accounts.main.address })
  
  // console.log(ShibaMusk)
  
  try {
    let balance = await ShibaMusk.methods.balanceOf(accounts.main.address).call()
    console.log(`Balance of ShibaMusk is: ${balance}`)
  }
  catch (err) {
    console.log("Failed to get Balance!")
    console.log(err)
  }

  /*
  try {
    let counter = 1;
    let unlockTime
    let res

    do {
      unlockTime = moment(new Date()).add(counter, "year")
      res = Number(await ShibaMusk.methods
        .getUnlockAmount(accounts.main.address, unlockTime.unix())
        .call())
      console.log(`Funds will not be unlocked by ${unlockTime.format("MMM DD YYYY")}`)
      counter++
    } while (res === 0);
    console.log(`Funds will be unlocked by ${unlockTime.format("MMM DD YYYY")}`)
  }
  catch (err) {
    console.log(err)
  }
  */
}

main()
