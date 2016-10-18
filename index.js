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
var topics = ["top stories", "world", "US", "elections", "business", "technology", "entertainment", "sports", "science", "health", "spotlight"];

handlers.Launch = function(launchRequest, session, sendResponse) {
  sendResponse({
    text: "Which topic would you like to read?",
    title: "Welcome",
    reprompt: "To hear the list of topics, say 'list topics'."
  });
};

handlers.ListTopics = function(intentRequest, session, sendResponse) {
  sendResponse({
    text: topics.join() + "\n\nWhich topic would you like to read?",
    title: "Topics",
    reprompt: "You can say the name of a topic."
  });
};

handlers.ListArticles = function(intentRequest, session, sendResponse) {
  getTopic(intentRequest.intent.slots.topic, topic => {
    if (topic) {
      sendResponse({
        text: topic.articles.map((article, index) => `${positions[index]} article.\nFrom ${article.source}.\n${article.title}.\n${article.text}.`).join("\n\n") + "\n\nYou can say 'first article' to read the first article in the topic.",
        title: `In ${topic}`,
        reprompt: "Which article would you like to read?"
      });
      state.topic = topic;
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
  getTopic(intentRequest.intent.slots.topic, topic => {
    if (topic) {
      getArticle(topic.articles, intentRequest.intent.slots.position, article => {
        if (article) {
          sendResponse({
            text: `From ${article.source}.\n\n${article.title}.\n\n${article.text}.\n\nWould you like me to read the next article?`,
            title: article.title,
            reprompt: "You can also say 'related articles' to list articles related this the one you just heard."
          });
          state.yesIntent = "NextArticle";
        }
        else {
          sendResponse({
            text: "You made an invalid choice. Which article would you like me to read?",
            title: "Invalid choice",
            reprompt: "You can say 'read me the first article'."
          });
        }
      });
      state.topic = topic;
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
  if (state.article) {
    sendResponse({
      text: state.article.relatedArticles.map((article, index) => `${positions[index]} related article.\nFrom ${article.source}.\n${article.title}.`).join("\n\n") + "\n\nYou can say 'read the first related article'.",
      title: 'Related Articles',
      reprompt: "Or say 'next article' to go to the next article in the topic."
    })
  }
  else {
    sendResponse({
      text: "You have not read any articles. To read an article in a topic, say 'read the first article in Science'.",
      title: 'No related articles',
      reprompt: "To list articles in a topic, say 'list articles in Science'."
    })
  }
};

handlers.ReadRelatedArticle = function(intentRequest, session, sendResponse) {
  if (state.article) {
    getRelatedArticle(state.article.relatedArticles, intentRequest.intent.slots.position, article => {
      if (article) {
        sendResponse({
          text: `From ${article.source}.\n\n${article.title}.\n\n${article.text}.\n\nWould you like me to read the next related article?`,
          title: article.title,
          reprompt: "To go to the next article in the topic, say 'next article'."
        });
        state.relatedArticle = article;
        state.yesIntent = "NextRelatedArticle";
      }
      else {
        sendResponse({
          text: "You made an invalid choice. Which article would you like me to read?",
          title: "Invalid choice",
          reprompt: "You can say 'read me the first related article'."
        });
      }
    });
  }
  else {
    sendResponse({
      text: "You have not read any articles. To read an article in a topic, say 'read the first article in Science'.",
      title: 'No related articles',
      reprompt: "To list articles in a topic, say 'list articles in Science'."
    })
  }
};

handlers.PreviousArticle = function(intentRequest, session, sendResponse) {
  var index = state.topic.articles.indexOf(state.article) - 1;
  if (index >= 0) {
    this.ReadArticle(makeIntentRequest({position: {value: positions[index]}}), session, sendResponse);
  }
  else {
    sendResponse({
      text: "You made an invalid choice. Which article would you like me to read?",
      title: "Invalid choice",
      reprompt: "You can say 'read me the first article'."
    });
  }
};

handlers.NextArticle = function(intentRequest, session, sendResponse) {
  var index = state.topic.articles.indexOf(state.article) + 1;
  if (index < state.topic.articles.length) {
    this.ReadArticle(makeIntentRequest({position: {value: positions[index]}}), session, sendResponse);
  }
  else {
    sendResponse({
      text: "There are no more articles in this topic. You can say 'list topics' to hear other available topics.",
      title: "No more articles",
      reprompt: "You can also say 'related articles' to list the articles related to the one you just heard."
    });
  }
};

handlers.NextRelatedArticle = function(intentRequest, session, sendResponse) {
  var index = state.article.relatedArticles.indexOf(state.relatedArticle) + 1;
  if (index < state.article.relatedArticles.length) {
    this.ReadRelatedArticle(makeIntentRequest({position: {value: positions[index]}}), session, sendResponse);
  }
  else {
    sendResponse({
      text: "There are no more related articles. To hear the next article in this topic, say 'next article'.",
      title: "No more related articles",
      reprompt: "To list all articles in the topic, say 'list all articles'."
    });
  }
};

handlers.HangOut = function(intentRequest, session, sendResponse)  {
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
};

handlers['AMAZON.YesIntent'] = function(intentRequest, session, sendResponse) {
  if (state.yesIntent == "NextArticle") {
    this.NextArticle(makeIntentRequest(), session, sendResponse);
  }
  else if (state.yesIntent == "NextRelatedArticle") {
    this.NextRelatedArticle(makeIntentRequest(), session, sendResponse);
  }
  else if (state.yesIntent == "TopStories") {
    this.ListArticles(makeIntentRequest({topic: {value: "Top Stories"}}), session, sendResponse);
  }
  else if (state.yesIntent == "HangOut") {
    this.HangOut(makeIntentRequest(), session, sendResponse);
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

function getTopic(topic, callback) {

}

function getArticle(articles, position, callback) {

}

function getRelatedArticle(articles, position, callback) {

}
