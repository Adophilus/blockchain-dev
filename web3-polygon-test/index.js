const axios = require("axios");
const Web3 = require("web3");
const helpers = require("../src/helpers");

const config = helpers.loadConfig();

let provider = new Web3.providers.HttpProvider(config.networks.polygon.mainnet.moralis);
const web3 = new Web3(provider);
let accounts = {};
let openstoreContract;

async function setup () {
  let res = await axios.get("http://api.polygonscan.com/api", {params: {
    module: "contract",
    action: "getabi",
    address: config.contracts.openstore.address,
    format: "raw",
    apikey: config.explorers.polygonscan.apiKey
  }});

  let openstoreAbi = res.data;
  openstoreContract = new web3.eth.Contract(openstoreAbi, config.contracts.openstore.address);
  accounts.nft = web3.eth.accounts.wallet.add(config.wallets.nft.privateKey);
}

async function main () {
  await setup();

  let wallet = "nft";
  let nft = "BillionaireNFT";

  // console.log(openstoreContract.methods); // openstore smart contract methods

  openstoreContract.methods.totalSupply(config.tokens.erc1155[nft])
    .call()
    .then(res => console.log(`The total supply of ${nft} is ${res}`));

  openstoreContract.methods.balanceOf(config.wallets[wallet].address, config.tokens.erc1155[nft])
    .call()
    .then(res => console.log(`${wallet} account has a total of ${res} ${nft} tokens`));

  let safeTransferFromCall = await openstoreContract.methods.safeTransferFrom(config.wallets[wallet].address, config.wallets.test.address, config.tokens.erc1155[nft], 1, 0x00);
  let functionSignature = accounts[wallet].sign(safeTransferFromCall.encodeABI());

  openstoreContract.methods.setApproveForAll(config.wallets[wallet].address, true)
    .call()
    .then(res => console.log(res));

  openstoreContract.methods.executeMetaTransaction(config.wallets[wallet].address, functionSignature.message, functionSignature.r, functionSignature.s, functionSignature.v)
    .call()
    .then(res => console.log(res));
    .catch(err => console.log(`An error occurred while transferring ${nft}. ${err}`))
}

main();
