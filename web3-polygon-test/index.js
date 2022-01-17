const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const helpers = require("../src/helpers");

const config = helpers.loadConfig();

let provider = new HDWalletProvider(config.wallets.nft.privateKey, config.networks.polygon.mainnet.moralis);
// let provider = new Web3.providers.HttpProvider(config.networks.polygon.mainnet.moralis);
const web3 = new Web3(provider);
let accounts = {};
let openstoreContract;

async function setup () {
  let openstoreABI;

  try {
    // openstoreABI = await helpers.fetchABI(config.contracts.openstore.address, "polygon", config);
    openstoreABI = helpers.loadABI("openstore");
  }
  catch (err) {
    console.log("An error occurred while fetching the openstore ABI");
    console.log(err);
    process.exit(1);
  }

  openstoreContract = new web3.eth.Contract(openstoreABI, config.contracts.openstore.address);
  accounts.nft = web3.eth.accounts.wallet.add(config.wallets.nft.privateKey);
}

async function interim () {
  console.log(await web3.eth.getAccounts());
  process.exit();
}

async function main () {
  await setup();

  let wallet = "nft";
  let nft = "BillionaireNFT";
  let res;

  // console.log(openstoreContract.methods); // openstore smart contract methods

  await interim();

  try {
    await openstoreContract.methods.setApprovalForAll(config.wallets[wallet].address, true)
      .call();
  }
  catch (err) {
    console.log("An error occurred while calling setApprovalForAll");
    console.log(err);
  }

  try {
    res = await openstoreContract.methods.totalSupply(config.tokens.erc1155[nft])
      .call();
    console.log(`The total supply of ${nft} is ${res}`);
  }
  catch (err) {
    console.log(`An error occurred while trying to get the total supply of ${nft} tokens`);
    if (err.response) {
      console.log(err.response);
    }
    else {
      console.log(err.message);
    }
  }

  try {
    res = await openstoreContract.methods.balanceOf(config.wallets[wallet].address, config.tokens.erc1155[nft])
      .call();
    console.log(`${wallet} account has a total of ${res} ${nft} tokens`);
  }
  catch (err) {
    console.log(`An error occurred while trying to get the balance of ${nft} tokens in ${wallet} account`);
    console.log(err);
  }

  let safeTransferFromCall = await openstoreContract.methods.safeTransferFrom(accounts[wallet].address, config.wallets.test.address, config.tokens.erc1155[nft], 1, 0x00);
  // let functionSignature = accounts[wallet].sign(safeTransferFromCall.encodeABI());
  let functionSignature = web3.eth.accounts.sign(safeTransferFromCall.encodeABI(), accounts[wallet].privateKey);

  try {
    let res = await openstoreContract.methods.executeMetaTransaction(accounts[wallet].address, functionSignature.message, functionSignature.r, functionSignature.s, functionSignature.v)
      .call({ from: accounts[wallet].address })
    console.log(res);
  }
  catch (err) {
    console.log(`An error occurred while transferring ${nft}`);
    console.log(err.message);
  }
}

main();
