
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("Help");

  if (ses.yesIntent == "ContinueListing") {
    return {
      text: "You can say 'Continue' to read the next three headlines. Or you can pick an article to read by saying 'read the first article'.",
      title: "Help",
      reprompt: "Should I read the next three headlines?"
    }
  }
  else if (ses.yesIntent == "ContinueReading" || ses.yesIntent == "ContinueReadingRelated") {
    return {
      text: "Say 'yes' to continue reading this article, or 'no' to stop.",
      title: "Help",
      reprompt: "Or you can say 'list articles' to pick another article to read."
    }
  }
  else if (ses.yesIntent == "NextArticle") {
    return {
      text: "Say 'yes' to read the next article in this topic. Or you can say 'list articles' to pick another article to read.",
      title: "Help",
      reprompt: "Should I read the next article?"
    }
  }
  else if (ses.yesIntent == "NextRelatedArticle") {
    return {
      text: "If I fail to load the content of an article, I can read you a related article instead. A related article is usually an article about the same subject, but from a different news outlet. You can simply say 'yes' to read the first related article. You can also say: 'read the first related article'; or: 'list all related articles'.",
      title: "Help",
      reprompt: "Do you want to read the first related article?"
    }
  }
  else if (ses.yesIntent == "PickArticle") {
    return {
      text: "You can say 'first article' to read the first article in the list. Or say 'list articles'. You can also pick another topic at any time by speaking the name of the topic. To hear the list of available topics, say 'list topics'.",
      title: "Help",
      reprompt: "Which article would you like to read?"
    }
  }
  else if (ses.yesIntent == "PickRelatedArticle") {
    return {
      text: "A related article is an article about the same subject as the one you just heard, but from a different news outlet. You can say 'read the first related article'. Or say 'list related articles'.",
      title: "Help",
      reprompt: `To go back and read the next article in topic ${ses.topicName}, say 'read the next article'.`
    }
  }
  else {
    ses.yesIntent = "PickTopic";
    return {
      text: "I can read you news headlines from a particular topic. To hear the list of available topics, say 'list topics'. To pick a topic, simply say its name, for example, 'Science', or, 'Technology'. You can also give me longer commands such as, 'read me Science news', or, 'read me the first article in Science'.",
      title: "Help",
      reprompt: "Which topic would you like?"
    }
  }
}
