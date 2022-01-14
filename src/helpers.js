const fs = require("fs");

module.exports = {
  loadConfig (configPath = ".env") {
    return JSON.parse(fs.readFileSync(configPath));
  }
}
