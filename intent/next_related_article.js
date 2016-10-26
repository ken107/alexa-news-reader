
var log = require("../util/log.js");
var helper = require("../util/helper.js");

exports.handle = function(req, ses) {
  log.debug("NextRelatedArticle");

  if (!ses.topicName) throw new Error("NO_TOPIC");
  if (ses.articleIndex == null) throw new Error("NO_ARTICLE");
  if (ses.relatedIndex == null) ses.relatedIndex = -1;

  return Promise.resolve(ses.topicName)
    .then(require("../loader/topic.js").load)
    .then(topic => {
      var index = ses.relatedIndex + 1;
      if (index >= 0 && index < topic.articles[ses.articleIndex].relatedArticles.length) {
        return Promise.resolve([{articleIndex: index}, ses])
          .then(helper.spread(require("./read_related_article.js").handle))
      }
      else {
        return Promise.reject(new Error("NO_MORE_RELATED"));
      }
    });
}
