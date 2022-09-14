const Ethers = require("ethers");
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const helpers = require("../src/helpers");

const config = helpers.loadConfig();

const provider = new HDWalletProvider(
  config.wallets.main.privateKey,
  config.networks.bsc.moralis
);

const ethers = new Ethers.providers.Web3Provider(provider);
const web3 = new Web3(provider);

const accounts = {
  main: web3.eth.accounts.wallet.add(config.wallets.main.privateKey),
  nft: web3.eth.accounts.wallet.add(config.wallets.nft.privateKey),
  secondary: web3.eth.accounts.wallet.add(config.wallets.secondary.privateKey),
  test: web3.eth.accounts.wallet.add(config.wallets.test.privateKey),
};

async function loadABI(contractAddress, name, fetchFirst = false) {
  let abi;

  try {
    if (fetchFirst) {
      throw new Error("dummy error message");
    }

    abi = await helpers.loadABI(name);
  } catch (err) {
    try {
      abi = await helpers.fetchABI(contractAddress, "bsc", config);
      helpers.saveABI(abi, name);
    } catch (err) {
      console.log("Couldn't fetch contract ABI");
      throw err;
    }
  }

  return abi;
}

async function initContract(tokenContractAddress, tokenName, account) {
  try {
    const tokenImplementationAddress = await helpers.checkImplementationAddress(
      ethers,
      tokenContractAddress
    );

    const tokenAbi = await loadABI(tokenImplementationAddress, tokenName);

    // instantiate the Contract object
    return new web3.eth.Contract(tokenAbi, tokenContractAddress, {
      from: account,
    });
  } catch (err) {
    const tokenAbi = await loadABI(tokenContractAddress, tokenName);

    // instantiate the Contract object
    return new web3.eth.Contract(tokenAbi, tokenContractAddress, {
      from: account,
    });
  }
}

function fetchBalance(tokenContract, account) {
  return tokenContract.methods.balanceOf(account).call();
}

module.exports = {
  accounts,
  config,
  Ethers,
  ethers,
  helpers,
  provider,
  web3,

  fetchBalance,
  initContract,
  loadABI,
};
