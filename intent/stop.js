
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("StopIntent");
  return {
    text: "Goodbye.",
    title: "Goodbye",
    shouldEndSession: true
  }
};
