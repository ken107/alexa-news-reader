
var config = require("../util/config.js");
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("ListRelatedArticles");

  if (!ses.topicName) throw new Error("NO_TOPIC");
  if (ses.articleIndex == null) throw new Error("NO_ARTICLE");

  return Promise.resolve(ses.topicName)
    .then(require("../loader/topic.js").load)
    .then(topic => list(topic.articles[ses.articleIndex].relatedArticles, ses));
}

function list(articles, ses) {
  if (articles.length) {
    ses.yesIntent = "PickRelatedArticle";
    return {
      text: articles.map((article, index) => `${config.positions[index]} related article.\nFrom ${article.source}.\n${article.title}.`).join("\n\n") + "\n\nWhich related article would you like to read?",
      title: 'Related articles',
      reprompt: "You can say 'read the first related article'."
    }
  }
  else {
    ses.yesIntent = "NextArticle";
    return {
      text: "No related articles found. Should I go to the next article?",
      title: "No related articles",
      reprompt: "Please tell me which article you'd like to read."
    }
  }
}
