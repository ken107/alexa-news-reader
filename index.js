'use strict';

var handlers = {};
//https://news.google.com/news/feeds?cf=all&ned=us&hl=en&q=education&output=rss

var config = require("./config.json")[process.env.envir || "prod"];

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
    if (handler) handler.call(handlers, event.request, event.session, sendResponse);
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
        shouldEndSession: response.shouldEndSession || false,
      },
    });
  };
};

function makeIntentRequest(slots, name) {
  return {
    intent: {
      name: name,
      slots: slots
    }
  };
}

function getResponse(reason) {
  switch (reason) {
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
  }
}
