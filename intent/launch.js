
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("Launch");
  return {
    text: "Which topic would you like to read?",
    title: "Welcome",
    reprompt: "To hear the list of topics, say 'list topics'."
  };
};
