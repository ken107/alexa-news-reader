
module.exports = require("../config.json")[
  process.env.envir || "prod"
];
