
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("ReadArticle");

  if (req.topicName) ses.topicName = req.topicName;
  if (req.articleIndex != null) ses.articleIndex = req.articleIndex;
  ses.toRead = 0;

  return require("./continue_reading.js").handle(req, ses);
};
