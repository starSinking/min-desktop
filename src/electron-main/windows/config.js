const ACHEME = "file";
const path = require("path");
const LOAD_URL = `file://${path.join(__dirname, "../../../dist/index.html")}`;
module.exports = {
  ACHEME,
  LOAD_URL,
};
