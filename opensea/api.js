const axios = require("axios");
const helpers = require("../src/helpers.js");

const config = helpers.loadConfig();

async function getAsset(tokenId, owner) {
  try {
    const res = await axios.get(`https://api.opensea.io/api/v1/assets`, {
      headers: {
        "X-API-KEY": config.services.opensea.api.key,
      },
      params: {
        asset_contract_address: config.contracts.openstore.address,
      },
    });

    console.log("Assets from the openstore smart contract");
    console.log(res.data);
  } catch (e) {
    console.log("An error occurred!");
    console.log(e.response.data);
  }
}

async function getListings(tokenId) {
  try {
    const res = await axios.get(
      `https://testnets-api.opensea.io/api/v1/asset/${config.contracts.openstore.address}/${tokenId}/`,
      {
        headers: {
          "X-API-KEY": config.services.opensea.api.key,
        },
      }
    );

    console.log(res.data);
  } catch (e) {
    console.log("An error occurred!");
    console.log(e.response.data);
  }
}

async function main() {
  const tokenId = config.tokens.erc1155.Floater;
  await getAsset(tokenId);
  // await getListings(tokenId);
}

main();
