
var config = require("../config.json");
var extend = require("extend");

var envir = process.env.envir || "prod";
module.exports = extend({}, config.common, config[envir]);
