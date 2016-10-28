
var config = require("./util/config.js");
var log = require("./util/log.js");
var helper = require("./util/helper.js");

var handlers = {
  ContinueListing: require("./intent/continue_listing.js"),
  ContinueReading: require("./intent/continue_reading.js"),
  ContinueReadingRelated: require("./intent/continue_reading_related.js"),
  Launch: require("./intent/launch.js"),
  ListArticles: require("./intent/list_articles.js"),
  ListRelatedArticles: require("./intent/list_related_articles.js"),
  ListTopics: require("./intent/list_topics.js"),
  "AMAZON.NoIntent": require("./intent/no.js"),
  ReadArticle: require("./intent/read_article.js"),
  ReadRelatedArticle: require("./intent/read_related_article.js"),
  "AMAZON.StopIntent": require("./intent/stop.js"),
  "AMAZON.CancelIntent": require("./intent/stop.js"),
  "AMAZON.YesIntent": require("./intent/yes.js")
};
//https://news.google.com/news/feeds?cf=all&ned=us&hl=en&q=education&output=rss

exports.handler = function(event, context, callback) {
  switch (event.request.type) {
    case 'LaunchRequest':
      handle({intent: {name: "Launch"}, slots: {}}, event.session)
        .then(res => callback(null, res));
      break;
    case 'IntentRequest':
      handle(event.request, event.session)
        .then(res => callback(null, res));
      break;
    case 'SessionEndedRequest':
      callback();
      break;
  }
};

function handle(request, session) {
  var req = unwrapRequest(request);
  var ses = unwrapSession(session);
  log.info(req, ses);

  return Promise.resolve([req, ses])
    .then(helper.spread(handlers[req.intent].handle))
    .catch(err => {
      log.error(err.stack);
      return getErrorResponse(err, ses);
    })
    .then(res => {
      log.debug(res);
      return wrapResponse(res, ses);
    });
}

function unwrapRequest(request) {
  var req = {
    intent: request.intent.name
  };
  for (var name in request.intent.slots) {
    var slot = request.intent.slots[name];
    if (name == "topic") {
      req.topicName = slot.value;
    }
    else if (name == "position") {
      if (slot.value == "next" || slot.value == "previous") req.articleIndex = slot.value;
      else {
        req.articleIndex = config.positions.indexOf(slot.value);
        if (req.articleIndex == -1) req.articleIndex = config.positions2.indexOf(slot.value);
      }
    }
  }
  return req;
}

function unwrapSession(session) {
  return session.attributes || {};
}

function wrapResponse(res, ses) {
  return {
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
  };
}

function getErrorResponse(err, ses) {
  switch (err.message) {
    case "NO_TOPIC":
      return {
        text: "Which topic?",
        title: "No topic",
        reprompt: "To hear the list of topics, say 'list topics'."
      };
    case "BAD_TOPIC":
      return {
        text: "You made an invalid choice. Please choose another topic.",
        title: "Invalid topic",
        reprompt: "To hear the list of topics, say 'list topics'."
      };
    case "NO_ARTICLE":
      return {
        text: "You haven't read anything yet. To read an article about a topic, say 'read the first article about Science'.",
        title: 'No related articles',
        reprompt: "To list articles about a topic, say 'list articles about Science'."
      };
    case "BAD_ARTICLE_INDEX":
      return {
        text: "You made an invalid choice. Which article would you like me to read?",
        title: "Invalid choice",
        reprompt: "You can say 'read me the first article'."
      };
    case "NO_CONTENT":
      ses.yesIntent = "NextRelatedArticle";
      return {
        text: "This article has no text content, would you like to hear a related article?",
        title: "No content",
        reprompt: "You can also say 'read me the first related article'."
      };
    case "NO_MORE_ARTICLES":
      return {
        text: "There are no more articles from this topic. Which topic would you like to read?",
        title: "No more articles",
        reprompt: "For a list of topics, say 'list topics'."
      };
    case "NO_MORE_RELATED":
      return {
        text: `There are no more related articles. Would you like to read the next article in ${ses.topicName}?`,
        title: "No more articles",
        reprompt: "Which article would you like to read?"
      };
    case "BAD_RELATED_INDEX":
      return {
        text: "You made an invalid choice. Which related article would you like me to read?",
        title: "Invalid choice",
        reprompt: "You can also say 'list related articles'."
      };
    case "NO_RELATED":
      return {
        text: `There are no related articles. Would you like to read the next article in ${ses.topicName}?`,
        title: "No related articles",
        reprompt: "Which article would you like to read?"
      };
    default:
      return {
        text: "An error has occurred with the previous request.",
        title: "Error",
        reprompt: "Which topic would you like to read?"
      };
  }
}
