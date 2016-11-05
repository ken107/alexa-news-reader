
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("NoIntent");

  if (ses.yesIntent == "ContinueListing") {
    ses.yesIntent = "PickArticle";
    return {
      text: "Please tell me which article you'd like to read. You can say 'read the first article'.",
      title: "Choose article",
      reprompt: "To pick another topic, simply say its name. For example, 'Entertainment news'. To hear the list of available topics, say 'list topics'."
    }
  }
  else if (ses.yesIntent == "NextArticle") {
    ses.yesIntent = "ListArticles";
    return {
      text: "To pick another article from the current topic, say 'list articles'. You can also pick another topic at any time by saying, for example, 'read me Business news'.",
      title: "Choose article",
      reprompt: "To hear the list of available topics, say 'list topics'."
    }
  }
  else if (ses.yesIntent == "ContinueReading" || ses.yesIntent == "ContinueReadingRelated") {
    ses.yesIntent = "NextArticle";
    return {
      text: "Would you like me to read the next article?",
      title: "Next article?",
      reprompt: `Would you like to read the next article from topic ${ses.topicName}?`
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
  else if (ses.yesIntent == "ListTopics") {
    ses.yesIntent = "PickTopic";
    return {
      text: "Please tell me which topic you'd like to read.",
      title: "Pick topic",
      reprompt: "To get help, say 'help me'."
    }
  }
  else if (ses.yesIntent == "ListArticles" || ses.yesIntent == "ListRelatedArticles") {
    ses.yesIntent = "PickArticle";
    return {
      text: "Please tell me which article you'd like to read.",
      title: "Pick article",
      reprompt: "To get help. say 'help me'."
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
