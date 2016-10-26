
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("NoIntent");

  if (ses.yesIntent == "ContinueListing") {
    ses.yesIntent = null;
    return {
      text: "Please tell me which article you'd like to read.",
      title: "Choose article",
      reprompt: "You can say 'read the first article'."
    }
  }
  else if (ses.yesIntent == "NextArticle") {
    ses.yesIntent = null;
    return {
      text: "Please tell me which article you'd like to read.",
      title: "Choose article",
      reprompt: "You can say 'read the first article about Health'"
    }
  }
  else if (ses.yesIntent == "ContinueReading") {
    ses.yesIntent = "NextArticle";
    return {
      text: "Would you like me to read the next article?",
      title: "Next article?",
      reprompt: `Would you like to read the next article from ${ses.topicName}?`
    }
  }
  else if (ses.yesIntent == "NextRelatedArticle") {
    ses.yesIntent = "NextArticle";
    return {
      text: `Would you like me to read the next article from ${ses.topicName}?`,
      title: "Next article?",
      reprompt: `You can choose another topic by saying 'read me Technology news'`
    }
  }
  else {
    return {
      text: "Okay, Goodbye.",
      title: "Goodbye",
      shouldEndSession: true
    }
  }
};
