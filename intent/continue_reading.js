
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("ContinueReading");

  if (!ses.topicName) throw new Error("NO_TOPIC");
  if (ses.articleIndex == null) throw new Error("NO_ARTICLE");

  return require("../loader/topic.js").load(ses.topicName)
    .then(topic => {
      if (ses.articleIndex >= topic.articles.length) throw new Error("NO_MORE_ARTICLES");
      else return topic.articles[ses.articleIndex];
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
    ses.yesIntent = "ContinueReading";
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
      reprompt: "You can also say 'related articles' to list articles related to the one you just heard."
    }
  }
}
