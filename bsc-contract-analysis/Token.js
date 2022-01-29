const Web3 = require("web3")
const HDWalletProvider = require("@truffle/hdwallet-provider")
const helpers = require("../src/helpers")

const config = helpers.loadConfig()

const provider = new HDWalletProvider(
  config.wallets.main.privateKey,
  config.networks.bsc.mainnet.node.moralis
)
const web3 = new Web3(provider);

const accounts = {
  main: web3.eth.accounts.wallet.add(config.wallets.main.privateKey),
  nft: web3.eth.accounts.wallet.add(config.wallets.nft.privateKey),
  test: web3.eth.accounts.wallet.add(config.wallets.test.privateKey)
}

module.exports = {
  accounts,
  config,
  helpers,
  web3
}
