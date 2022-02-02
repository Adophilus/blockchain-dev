const Token = require("./Token");
const moment = require("moment");

const {
  accounts,
  config,
  determineUnlockTime,
  ethers,
  helpers,
  provider,
  web3,
} = Token;

async function main() {
  const token = { address: config.tokens.bsc.erc20.METAMUSK };
  const account = accounts.main;
  let METAMUSK;

  try {
    METAMUSK = await Token.initContract(token.address, "METAMUSK", account);
    console.log("Instantiated contract object!");
  } catch (err) {
    console.log("Failed to instantiate token contract");
    console.log(err);
    return false;
  }

  try {
    token.balance = await Token.fetchBalance(METAMUSK, account.address);
    console.log(`Balance of the ${account.address} is ${token.balance}`);
  } catch (err) {
    console.log("Couldn't fetch balance");
    console.log(`Error: ${err}`);
  }

  try {
    const unlockTime = await Token.determineUnlockTime(
      METAMUSK,
      account.address
    );
    console.log(`The token is unlocking at: ${unlockTime}`);
  } catch (err) {
    console.log(`Token unlock date could not be determined!`);
    console.log(err);
  }

  // console.log(web3.eth.gasPrice)
  return false;

  try {
    const res = METAMUSK.methods
      .transferLockToken(accounts.secondary, token.balance)
      .send();
    console.log(res);
  } catch (err) {
    console.log("An error occurred while trying to transfer the locked tokens");
    console.log(err);
  }
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
