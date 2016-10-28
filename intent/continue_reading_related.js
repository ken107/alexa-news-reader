
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("ContinueReadingRelated");

  if (!ses.topicName) throw new Error("NO_TOPIC");
  if (ses.articleIndex == null) throw new Error("NO_ARTICLE");
  if (ses.relatedIndex == null) throw new Error("BAD_RELATED_INDEX");

  return Promise.resolve(ses.topicName)
    .then(require("../loader/topic.js").load)
    .then(topic => {
      if (ses.articleIndex >= topic.articles.length) throw new Error("BAD_ARTICLE_INDEX");
      else {
        var relatedArticles = topic.articles[ses.articleIndex].relatedArticles;
        if (relatedArticles.length == 0) throw new Error("NO_RELATED");
        else if (ses.relatedIndex >= relatedArticles.length) throw new Error("NO_MORE_RELATED");
        else return relatedArticles[ses.relatedIndex];
      }
    })
    .then(article => {
      return require("../loader/article.js").load(article.link)
        .then(texts => readNext(article, texts, ses));
    });
};

function readNext(article, texts, ses) {
  var text = ses.toRead == 0 ? `From ${article.source}.\n\n${article.title}.\n\n` : "";
  var i = ses.toRead;
  while (i < texts.length && text.length + texts[i].length + 50 <= 8000) text += texts[i++] + "\n\n";

  if (i < texts.length) {
    ses.toRead = i;
    ses.yesIntent = "ContinueReadingRelated";
    return {
      text: `${text}Continue?`,
      title: article.title,
      reprompt: "Should I continue reading?"
    }
  }
  else {
    ses.yesIntent = "NextArticle";
    return {
      text: `${text}Would you like me to read the next article?`,
      title: article.title,
      reprompt: "You can also say 'list articles'."
    }
  }
}
