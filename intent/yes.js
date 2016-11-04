
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("YesIntent");

  if (ses.yesIntent == "ContinueListing") return require("./continue_listing.js").handle(req, ses);
  else if (ses.yesIntent == "ContinueReading") return require("./continue_reading.js").handle(req, ses);
  else if (ses.yesIntent == "ContinueReadingRelated") return require("./continue_reading_related.js").handle(req, ses);
  else if (ses.yesIntent == "NextArticle") return require("./read_article.js").handle({articleIndex: "next"}, ses);
  else if (ses.yesIntent == "NextRelatedArticle") return require("./read_related_article.js").handle({articleIndex: "next"}, ses);
  else if (ses.yesIntent == "ListTopics") return require("./list_topics.js").handle(req, ses);
  else if (ses.yesIntent == "ListArticles") return require("./list_articles.js").handle(req, ses);
  else if (ses.yesIntent == "ListRelatedArticles") return require("./list_related_articles.js").handle(req, ses);
  else {
    return {
      text: "I'm not sure what you mean. You can ask for help at any time by saying 'help me'.",
      title: "What do you mean?",
      reprompt: "Say 'help me' to get help with the current interaction."
    }
  }
};
