const Token = require("./Token");
const moment = require("moment");

const { accounts, config, helpers, provider, web3 } = Token;

async function main() {
  const token = config.tokens.bsc.erc20.ShibaMusk;
  const abi = await Token.loadABI(token, "ShibaMusk");
  let ShibaMusk;
  const account = accounts.main;

  // instantiate the Contract object
  ShibaMusk = new web3.eth.Contract(abi, token, { from: account.address });
  console.log(ShibaMusk);

  try {
    const balance = await Token.fetchBalance(ShibaMusk, account);
    console.log(`Balance of the ${account.address} is ${balance}`);
  } catch (err) {
    console.log("Couldn't fetch balance");
    console.log(`Error: ${err}`);
  }

  //
  // try {
  // let counter = 1;
  // let unlockTime
  // let res
  //
  // do {
  //     unlockTime = moment(new Date()).add(counter, "year")
  //     res = Number(await ShibaMusk.methods
  //       .getUnlockAmount(accounts.main.address, unlockTime.unix())
  //       .call())
  //     console.log(`Funds will not be unlocked by ${unlockTime.format("MMM DD YYYY")}`)
  //     counter++
  // } while (res === 0);
  // console.log(`Funds will be unlocked by ${unlockTime.format("MMM DD YYYY")}`)
  // }
  // catch (err) {
  // console.log(err)
  // }
  //

  provider.engine.stop();
}

main();
