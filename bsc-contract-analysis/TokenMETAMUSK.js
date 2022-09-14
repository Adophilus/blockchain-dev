const Token = require("./Token");
const moment = require("moment");

const { accounts, config, provider } = Token;

async function main() {
  const token = { address: config.tokens.erc20.bsc.METAMUSK };
  const account = accounts.main;
  const receiver = config.wallets.secondary;

  try {
    token.contract = await Token.initContract(
      token.address,
      "METAMUSK",
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

  try {
    const res = await Token.fetchBalance(token.contract, receiver.address);
    console.log(`Balance of the ${receiver.address} is ${res}`);
  } catch (err) {
    console.log("Couldn't fetch balance");
    console.log(err);
  }

  try {
    token.unlockTime = moment.unix(
      await token.contract.methods.unlockTime().call()
    );
    console.log(`The token is unlocking at: ${token.unlockTime}`);
  } catch (err) {
    console.log(`Token unlock date could not be determined!`);
    console.log(err);
  }

  try {
    const res = await token.contract.methods
      .getAvailableBalance(
        account.address,
        moment(new Date()).add(2, "month").unix()
      )
      .call();
    console.log(
      `Available balance of ${account.address} in 2 months is ${res}`
    );
  } catch (err) {
    console.log("Couldn't fetch balance");
    console.log(err);
  }

  try {
    const res = await token.contract.methods
      .transferFrom(account.address, receiver.address, token.balance)
      .send({ gas: 22020, to: account.address });
    console.log(res);
  } catch (err) {
    console.log(
      `An error occurred while trying to transfer the tokens from ${account.address} to ${receiver.address}`
    );
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
