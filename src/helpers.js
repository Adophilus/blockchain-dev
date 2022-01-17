const axios = require("axios");
const fs = require("fs");
const path = require("path");

function loadConfig (configPath = "./.env") {
  return JSON.parse(fs.readFileSync(configPath));
}

async function fetchABI (contractAddress, network, config) {
  let apiKey, apiUrl;

  if (network === "polygon") {
    apiKey = config.explorers.polygonscan.api.key;
    apiUrl = config.explorers.polygonscan.api.url;
  }
  else {
    throw new Error("Unsupported or invalid network!");
  }

  let res = await axios.get(apiUrl, {
    params: {
      module: "contract",
      action: "getabi",
      address: contractAddress,
      format: "raw",
      apikey: apiKey
    }
  });

  return res.data;
}

function loadABI (abi) {
  return JSON.parse(fs.readFileSync(path.join("abis", `${abi}.abi`)));
}

module.exports = {
  loadConfig,
  fetchABI,
  loadABI
}
