
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("ListArticles");

  if (req.topicName) ses.topicName = req.topicName;
  ses.toList = 0;

  return require("./continue_listing.js").handle(req, ses);
};
