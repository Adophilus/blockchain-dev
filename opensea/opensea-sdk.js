const Web3 = require("web3");
const { OpenSeaPort, Network } = require("opensea-js");
const helpers = require("../src/helpers.js");

const config = helpers.loadConfig();

const provider = new Web3.providers.HttpProvider("https://mainnet.infura.io");
const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main,
  apiKey: config.services.opensea.api.key,
});

async function getAsset(tokenId) {
  return await seaport.api.getAsset({
    tokenAddress: config.contracts.openstore.address,
    id: tokenId,
  });
}

async function getAssetBalance(address, asset) {
  return await seaport.api.getAssetBalance({
    accountAddress: address,
    asset,
  });
}

async function main() {
  const tokenId = config.tokens.erc1155.BillionaireNFT;
  const nft = await getAsset(tokenId);
  console.log(nft);

  const balance = await getAssetBalance(config.wallets.nft.address, nft);
  console.log(balance);
}

main();
