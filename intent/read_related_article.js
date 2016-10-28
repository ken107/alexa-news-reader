
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("ReadRelatedArticle");

  if (req.articleIndex == null) throw new Error("BAD_RELATED_INDEX");
  else {
    if (req.articleIndex == "next") {
      if (ses.relatedIndex == null) ses.relatedIndex = 0;
      else ses.relatedIndex++;
    }
    else if (req.articleIndex == "previous") {
      if (ses.relatedIndex == null || ses.relatedIndex <= 0) throw new Error("BAD_RELATED_INDEX");
      else ses.relatedIndex--;
    }
    else ses.relatedIndex = req.articleIndex;
  }
  ses.toRead = 0;

  return require("./continue_reading_related.js").handle(req, ses);
}
