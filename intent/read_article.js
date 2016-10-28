
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("ReadArticle");

  if (req.topicName) ses.topicName = req.topicName;
  if (req.articleIndex == null) throw new Error("BAD_ARTICLE_INDEX");
  else {
    if (req.articleIndex == "next") {
      if (ses.articleIndex == null) ses.articleIndex = 0;
      else ses.articleIndex++;
    }
    else if (req.articleIndex == "previous") {
      if (ses.articleIndex == null) throw new Error("NO_ARTICLE");
      else if (ses.articleIndex <= 0) throw new Error("BAD_ARTICLE_INDEX");
      else ses.articleIndex--;
    }
    else ses.articleIndex = req.articleIndex;
  }
  ses.toRead = 0;
  ses.relatedIndex = null;

  return require("./continue_reading.js").handle(req, ses);
};
