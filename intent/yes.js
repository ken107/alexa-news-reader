
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("YesIntent");

  if (ses.yesIntent == "ContinueListing") return require("./continue_listing.js").handle(req, ses);
  else if (ses.yesIntent == "ContinueReading") return require("./continue_reading.js").handle(req, ses);
  else if (ses.yesIntent == "NextArticle") return require("./next_article.js").handle(req, ses);
  else if (ses.yesIntent == "NextRelatedArticle") return require("./next_related_article.js").handle(req, ses);
  else if (ses.yesIntent == "TopStories") return require("./list_articles.js").handle({topicName: "Top Stories"}, ses);
  else {
    ses.yesIntent = "TopStories";
    return {
      text: "I'm not sure what you mean. Would you like to hear the top news stories?",
      title: "What do you mean?",
      reprompt: "To hear the list of topics, say 'list topics'."
    }
  }
};
