const { accounts, openstoreContract } = require("./OpenstorePolygon");
const helpers = require("../src/helpers");
const config = helpers.loadConfig();

async function main() {
  const wallet = "nft";
  const nft = "BillionaireNFT";
  let res;

  try {
    res = await openstoreContract.methods
      .totalSupply(config.tokens.erc1155[nft])
      .call();
    console.log(`The total supply of ${nft} is ${res}`);
  } catch (err) {
    console.log(
      `An error occurred while trying to get the total supply of ${nft} tokens`
    );

    if (err.response) {
      console.log(err.response);
    } else {
      console.log(err.message);
    }
  }

  try {
    res = await openstoreContract.methods
      .balanceOf(config.wallets[wallet].address, config.tokens.erc1155[nft])
      .call();
    console.log(`${wallet} account has a total of ${res} ${nft} tokens`);
  } catch (err) {
    console.log(
      `An error occurred while trying to get the balance of ${nft} tokens in ${wallet} account`
    );
    console.log(err);
  }

  try {
    const functionSignature = await openstoreContract.methods.safeTransferFrom(
      accounts[wallet].address,
      config.wallets.test.address,
      config.tokens.erc1155[nft],
      1,
      0x00
    );
  } catch (err) {
    console.log("error while creating safeTransferFrom contract call");
    console.log(err);
    process.exit(1)
  }

  try {
    const transferCall = await accounts[wallet].sign(
      functionSignature.encodeABI()
    );
  } catch (err) {
    console.log("error occurred while signing safeTransferFrom call");
    console.log(err)
    process.exit(1)
  }

  try {
    const res = await openstoreContract.methods
      .executeMetaTransaction(
        accounts[wallet].address,
        transferCall.message,
        transferCall.r,
        transferCall.s,
        transferCall.v
      )
      .call({
        from: accounts[wallet].address,
        to: config.wallets.test.address,
      });
    console.log(res);
  } catch (err) {
    console.log(`An error occurred while transferring ${nft}`);
    console.log(err);
  }
}

main()
