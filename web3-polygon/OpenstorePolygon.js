const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const helpers = require("../src/helpers");

const config = helpers.loadConfig();

let accounts = {}, openstoreABI;

const provider = new HDWalletProvider(
  config.wallets.nft.privateKey,
  config.networks.polygon.mainnet.moralis
);
const web3 = new Web3(provider);

try {
  openstoreABI = helpers.loadABI("polygon.openstore");
} catch (err) {
  console.log("An error occurred while fetching the openstore ABI");
  console.log(err);
  process.exit(1);
}

const openstoreContract = new web3.eth.Contract(
  openstoreABI,
  config.contracts.polygon.openstore.address,
  { from: config.wallets.nft.address }
);

accounts.nft = web3.eth.accounts.wallet.add(config.wallets.nft.privateKey);
accounts.test = web3.eth.accounts.wallet.add(config.wallets.test.privateKey);

module.exports = {
  accounts,
  openstoreContract
};
