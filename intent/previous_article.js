
var log = require("../util/log.js");
var helper = require("../util/helper.js");

exports.handle = function(req, ses) {
  log.debug("PreviousArticle");

  if (!ses.topicName) throw new Error("NO_TOPIC");
  if (ses.articleIndex == null) throw new Error("NO_ARTICLE");

  return Promise.resolve(ses.topicName)
    .then(require("../loader/topic.js").load)
    .then(topic => {
      var index = ses.articleIndex - 1;
      if (index >= 0 && index < topic.articles.length) {
        return Promise.resolve([{articleIndex: index}, ses])
          .then(helper.spread(require("./read_article.js").handle));
      }
      else {
        return Promise.reject(new Error("BAD_ARTICLE_INDEX"));
      }
    });
};
