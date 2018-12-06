
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("Launch");

  ses.yesIntent = "PickTopic";
  return {
    text: "Which topic would you like to read?  To hear the list of topics, say 'list topics'.",
    title: "Welcome",
    reprompt: "To hear the list of topics, say 'list topics'."
  };
};
