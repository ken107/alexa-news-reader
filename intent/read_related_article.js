
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("ReadRelatedArticle");

  ses.relatedIndex = req.articleIndex;
  ses.toRead = 0;

  return require("./continue_reading_related.js").handle(req, ses);
}
