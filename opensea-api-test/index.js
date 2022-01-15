const axios = require("axios");
const fs = require("fs");
const helpers = require("../src/helpers.js");

const config = helpers.loadConfig();

/*
async function getAsset (tokenId, owner) {
  try {
    // let res = await axios.get(`https://api.opensea.io/api/v1/asset/${config.contracts.openstore.address}/${tokenId}/`, {
    let res = await axios.get(`https://api.opensea.io/api/v1/assets`, {
      headers: {
        "X-API-KEY": config.services.opensea.api.key
      },
      params: {
        asset_contract_address: config.contracts.openstore.address
      }
    });

    console.log("Assets from the openstore smart contract");
    console.log(res.data);
  }
  catch (e) {
    console.log("An error occurred!");
    console.log(e.response.data);
  }
}
*/

async function getAsset (tokenId, owner) {
  try {
    let res = await axios.get(`https://api.opensea.io/api/v2/metadata/matic/${config.contracts.openstore.address}/0x${tokenId}/`, {
      headers: {
        "X-API-KEY": config.services.opensea.api.key
      }
    });

    console.log("Assets from the openstore smart contract");
    console.log(res.data);
  }
  catch (e) {
    console.log("An error occurred!");
    console.log(e.response.data);
  }
}

async function getListings (tokenId) {
  try {
    let res = await axios.get(`https://testnets-api.opensea.io/api/v1/asset/${config.contracts.openstore.address}/${tokenId}/`); /*, {
      headers: {
        "X-API-KEY": config.services.opensea.api.key
      }
    });*/

    console.log(res.data);
  }
  catch (e) {
    console.log("An error occurred!");
    console.log(e.response.data);
  }
}

async function main () {
  let tokenId = config.tokens.erc1155.Floater;
  await getAsset(tokenId);
  // await getListings(tokenId);
}

main();
