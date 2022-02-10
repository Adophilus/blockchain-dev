const Token = require("./Token");

const { accounts, config, provider } = Token;

async function main() {
  const token = { address: config.tokens.bsc.erc20.METAKINGS };
  const account = accounts.main;

  try {
    token.contract = await Token.initContract(
      token.address,
      "METAKINGS",
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
    const METAKINGSLockContract = await Token.initContract(
      await token.contract.methods.LOCK_CONTRACT().call(),
      "METAKINGSLockContract",
      account.address
    );
  } catch (err) {
    console.log("Couldn't determine the lock contract address");
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
