const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { getImplementationAddress } = require("@openzeppelin/upgrades-core");

function loadConfig(configPath = "./.env") {
  return JSON.parse(fs.readFileSync(configPath));
}

async function fetchABI(contractAddress, network, config) {
  let apiKey, apiUrl;

  if (network === "polygon") {
    apiKey = config.explorers.polygonscan.api.key;
    apiUrl = config.explorers.polygonscan.api.url;
  } else if (network === "bsc") {
    apiKey = config.explorers.bscscan.api.key;
    apiUrl = config.explorers.bscscan.api.url;
  } else {
    throw new Error("Unsupported or invalid network!");
  }

  const res = await axios.get(apiUrl, {
    params: {
      module: "contract",
      action: "getabi",
      address: contractAddress,
      format: "raw",
      apikey: apiKey,
    },
  });

  return res.data;
}

function loadABI(abiName) {
  return JSON.parse(fs.readFileSync(path.join("abis", `${abiName}.abi`)));
}

function saveABI(abi, abiName) {
  fs.writeFileSync(path.join("abis", `${abiName}.abi`), JSON.stringify(abi));
}

async function checkImplementationAddress(provider, tokenAddress) {
  return await getImplementationAddress(provider, tokenAddress);
}

module.exports = {
  loadConfig,

  fetchABI,
  loadABI,
  saveABI,

  checkImplementationAddress,
};
