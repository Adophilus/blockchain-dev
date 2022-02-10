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
  const token = { address: config.tokens.bsc.erc20.METAKINGS };
  const account = accounts.main;

  try {
    token.contract = await Token.initContract(
      token.address,
      "METAMUSK",
      account.address
    );
    console.log("Instantiated contract object!");
  } catch (err) {
    console.log("Failed to instantiate token contract");
    console.log(`Error: ${err}`);
    return false;
  }

  try {
    token.balance = await Token.fetchBalance(token.contract, account.address);
    console.log(`Balance of the ${account.address} is ${token.balance}`);
  } catch (err) {
    console.log("Couldn't fetch balance");
    console.log(err);
  }

  console.log(token.contract.methods);
  return false;

  try {
    token.unlockTime = await Token.determineUnlockTime(
      token.contract,
      account.address
    );
    console.log(`The token is unlocking at: ${token.unlockTime}`);
  } catch (err) {
    console.log(`Token unlock date could not be determined!`);
    console.log(err);
  }

  try {
    const res = await token.contract.methods
      .transferLockToken(accounts.secondary.address, token.balance)
      .send({ gas: 22000, to: account.address });
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
