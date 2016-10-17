'use strict';

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
    if (handler) handler(event.request, event.session, sendResponse);
  }
  catch (err) {
    callback(err);
  }

  function sendResponse(response) {
    callback(null, {
      version: '1.0',
      sessionAttributes: response.sessionAttributes || {},
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: response.text,
        },
        card: {
          type: 'Simple',
          title: response.title || "Info",
          content: response.text,
        },
        reprompt: {
          outputSpeech: {
            type: 'PlainText',
            text: response.reprompt || "I'm waiting for your response",
          },
        },
        shouldEndSession: res.shouldEndSession || false,
      },
    });
  };
};

var handlers = {};
var state = {};
var positions = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth"];

handlers.Launch = function(launchRequest, session, sendResponse) {
  getTopics(topics => sendResponse({
    text: "Which topic would you like to read?",
    title: "Welcome",
    reprompt: "To hear the list of topics, say 'list topics'."
  });
};

handlers.ListTopics = function(intentRequest, session, sendResponse) {
  getTopics(topics => sendResponse({
    text: topics.join(),
    title: "Topics",
    reprompt: "You can say the name of a topic."
  }));
};

handlers.ListArticles = function(intentRequest, session, sendResponse) {
  getArticles(intentRequest.intent.slots, (topic, articles) => {
    if (topic) {
      sendResponse({
        text: articles.map((article, index) => `${positions[index]} article.\nFrom ${article.source}.\n${article.title}.\n${article.text}.`).join("\n\n"),
        title: `In ${topic}`,
        reprompt: "You can say 'first article' to read the first article in the topic."
      });
    }
    else {
      sendResponse({
        text: "Which topic?",
        title: "No topic",
        reprompt: "You can say 'list topics' to hear the available topics."
      });
    }
  });
};

handlers.ReadArticle = function(intentRequest, session, sendResponse) {
  getArticle(intentRequest.intent.slots, (topic, article) => {
    if (topic) {
      sendResponse({
        text: `Now reading ${article.title}.\n\n${article.text}.\n\nWould you like me to read the next article?`,
        title: article.title,
        reprompt: "To hear the next article, say 'next article'."
      });
    }
    else {
      sendResponse({
        text: "Which topic?",
        title: "No topic",
        reprompt: "You can say 'list topics' to hear the available topics."
      });
    }
  });
};

handlers.ListRelatedArticles = function(intentRequest, session, sendResponse) {
};

handlers.ReadRelatedArticle = function(intentRequest, session, sendResponse) {
};

handlers.PreviousArticle = function(intentRequest, session, sendResponse) {
};

handlers.NextArticle = function(intentRequest, session, sendResponse) {
};

handlers.PreviousSentence = function(intentRequest, session, sendResponse) {
};

handlers['AMAZON.YesIntent'] = function(intentRequest, session, sendResponse) {
  if (state.yesIntent == "NextArticle") {
    var nextIndex = state.article.index + 1;
    if (nextIndex < state.topic.articles.length) {
      this.ReadArticle(makeIntentRequest({position: {value: positions[nextIndex]}}), session, sendResponse);
    }
    else {
      sendResponse({
        text: "There are no more articles in this topic. You can say 'list topics' to hear other available topics.",
        title: "No more articles",
        reprompt: "You can also say 'related articles' to list the articles related to the one you just heard."
      });
    }
  }
  else if (state.yesIntent == "TopStories") {
    this.ListArticles(makeIntentRequest({topic: {value: "Top Stories"}}), session, sendResponse);
  }
  else if (state.yesIntent == "HangOut") {
    var responses = [
      "Okay, let's hang out together!",
      "Okay, sounds fun!",
      "Okay, have fun, I gotta go.",
      "Okay, fine!"
    ];
    sendResponse({
      text: responses[Math.floor(Math.random()*responses.length)],
      title: "Hang Out",
      shouldEndSession: true
    });
  }
  else {
    sendResponse({
      text: "I'm not sure what you mean. Would you like to hear the top news stories?",
      title: "What do you mean?",
      reprompt: "You can say 'list topics' to hear the available topics."
    });
    state.yesIntent = "TopStories";
  }
};

handlers['AMAZON.NoIntent'] = function(intentRequest, session, sendResponse) {
  if (state.yesIntent != "HangOut") {
    sendResponse({
      text: "So, what do ya want to do? Hang out?",
      title: "What next?",
      reprompt: "Are you still there?"
    });
    state.yesIntent = "HangOut";
  }
  else {
    sendResponse({
      text: "Okay, I can't help you. Goodbye.",
      title: "Can't help you",
      shouldEndSession: true
    });
  }
};

handlers['AMAZON.StopIntent'] =
handlers['AMAZON.CancelIntent'] = function(intentRequest, session, sendResponse) {
  sendResponse({
    text: "Goodbye.",
    title: "Goodbye",
    shouldEndSession: true
  });
};

function makeIntentRequest(slots, name) {
  return {
    intent: {
      name: name,
      slots: slots
    }
  };
}

function getTopics(callback) {

}

function getArticles(slots, callback) {

}

function getArticle(slots, callback) {

}
