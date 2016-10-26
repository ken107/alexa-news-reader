
var log = require("../util/log.js");
var helper = require("../util/helper.js");

exports.handle = function(req, ses) {
  log.debug("NextArticle");

  if (!ses.topicName) throw new Error("NO_TOPIC");
  if (ses.articleIndex == null) ses.articleIndex = -1;

  return Promise.resolve(ses.topicName)
    .then(require("../loader/topic.js").load)
    .then(topic => {
      var index = ses.articleIndex + 1;
      if (index >= 0 && index < topic.articles.length) {
        return Promise.resolve([{articleIndex: index}, ses])
          .then(helper.spread(require("./read_article.js").handle));
      }
      else {
        return Promise.reject(new Error("NO_MORE_ARTICLES"));
      }
    });
};
