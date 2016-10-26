
var handlers = {
  ContinueListing: require("./continue_listing.js"),
  ContinueReading: require("./continue_reading.js"),
  ContinueReadingRelated: require("./continue_reading_related.js"),
  Launch: require("./launch.js"),
  ListArticles: require("./list_articles.js"),
  ListRelatedArticles: require("./list_related_articles.js"),
  ListTopics: require("./list_topics.js"),
  NextArticle: require("./next_article.js"),
  NextRelatedArticle: require("./next_related_article.js"),
  "AMAZON.NoIntent": require("./no.js"),
  PreviousArticle: require("./previous_article.js"),
  ReadArticle: require("./read_article.js"),
  ReadRelatedArticle: require("./read_related_article.js"),
  "AMAZON.StopIntent": require("./stop.js"),
  "AMAZON.CancelIntent": require("./stop.js"),
  "AMAZON.YesIntent": require("./yes.js")
};
//https://news.google.com/news/feeds?cf=all&ned=us&hl=en&q=education&output=rss

exports.handler = function(event, context, callback) {
  try {
    var handler;
    switch (event.request.type) {
      case 'LaunchRequest':
        handler = handlers['Launch'];
        break;
      case 'IntentRequest':
        handler = handlers[event.request.intent.name];
        if (!handler) throw new Error('Invalid intent');
        break;
      case 'SessionEndedRequest':
        callback();
        break;
    }
    if (handler) {
      var slots = event.request.intent.slots;
      var req = {};
      if (slots) {
        for (var name in slots)
          if (name == "topic") req.topicName = slots[name].value;
          else if (name == "position") req.articleIndex = slots[name].value;
      }
      log.debug("session", event.session.attributes);
      var ses = event.session.attributes || {};
      Promise.resolve([req, ses])
        .then(handler)
        .then(res => respond(res, ses))
        .catch(err => respond(getResponse(err, ses), ses));
    }
  }
  catch (err) {
    callback(err);
  }

  function respond(res, ses) {
    callback(null, {
      version: '1.0',
      sessionAttributes: ses,
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: res.text,
        },
        card: {
          type: 'Simple',
          title: res.title || "Info",
          content: res.text,
        },
        reprompt: {
          outputSpeech: {
            type: 'PlainText',
            text: res.reprompt || "I'm waiting for your response",
          },
        },
        shouldEndSession: res.shouldEndSession || false,
      },
    });
  };
};

function getResponse(err, ses) {
  switch (err.message) {
    case "NO_TOPIC":
      return {
        text: "Which topic?",
        title: "No topic",
        reprompt: "To hear the list of topics, say 'list topics'."
      }
    case "BAD_TOPIC":
      return {
        text: "You made an invalid choice. Please choose another topic.",
        title: "Invalid topic",
        reprompt: "To hear the list of topics, say 'list topics'."
      }
    case "NO_ARTICLE":
      return {
        text: "You haven't read anything yet. To read an article about a topic, say 'read the first article about Science'.",
        title: 'No related articles',
        reprompt: "To list articles about a topic, say 'list articles about Science'."
      }
    case "BAD_ARTICLE_INDEX":
      return {
        text: "You made an invalid choice. Which article would you like me to read?",
        title: "Invalid choice",
        reprompt: "You can say 'read me the first article'."
      }
    case "BAD_ARTICLE":
      state.yesIntent = "NextRelatedArticle";
      return {
        text: "An error occurred while loading this article, should I read you a related article?",
        title: "Error loading article",
        reprompt: "You can also say 'read me the first related article'."
      }
    case "NO_MORE_ARTICLES":
      return {
        text: "There are no more articles from this topic. Which topic would you like to read?",
        title: "No more articles",
        reprompt: "For a list of topics, say 'list topics'."
      }
    case "NO_MORE_RELATED":
      return {
        text: `There are no more related articles. Would you like to read the next article in ${ses.topicName}?`,
        title: "No more articles",
        reprompt: "Which article would you like to read?"
      }
    case "BAD_RELATED_INDEX":
      return {
        text: "You made an invalid choice. Which related article would you like me to read?",
        title: "Invalid choice",
        reprompt: "You can also say 'list related articles'."
      }
    default:
      return {
        text: "An error has occurred with the previous request.",
        title: "Error",
        reprompt: "Which topic would you like to read?"
      }
  }
}
