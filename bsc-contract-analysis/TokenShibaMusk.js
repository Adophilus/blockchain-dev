const Token = require("./Token");
const moment = require("moment");

const { accounts, config, provider } = Token;

async function main() {
  const token = { address: config.tokens.bsc.erc20.ShibaMusk };
  const account = accounts.main;
  const receiver = accounts.secondary;

  try {
    token.contract = await Token.initContract(
      token.address,
      "ShibaMusk",
      account.address
    );
    console.log("Instantiated contract object!");
  } catch (err) {
    console.log("Failed to instantiate token contract");
    console.log(err);
    return false;
  }

  try {
    token.balance = await Token.fetchBalance(token.contract, account.address);
    console.log(`Balance of the ${account.address} is ${token.balance}`);
  } catch (err) {
    console.log("Couldn't fetch balance");
    console.log(err);
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
}

main()
  .then(() => {
    provider.engine.stop();
    console.log("Execution completed!");
  })
  .catch((err) => {
    provider.engine.stop();
    console.log("An error occurred");
    console.log(err);
  });
