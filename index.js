'use strict';

var handlers = {};
var state = {};
var cache = {};
var positions = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth"];
var positions2 = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th"];
var topics = ["top stories", "world", "US", "elections", "business", "technology", "entertainment", "sports", "science", "health", "spotlight"];
var feeds = {
  "top stories": "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&output=rss",
  "world": "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&topic=w&output=rss",
  "US": "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&topic=n&output=rss",
  "elections": "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&topic=el&output=rss",
  "business": "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&topic=b&output=rss",
  "technology": "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&topic=tc&output=rss",
  "entertainment": "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&topic=e&output=rss",
  "sports": "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&topic=s&output=rss",
  "science": "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&topic=snc&output=rss",
  "health": "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&topic=m&output=rss",
  "spotlight": "https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&topic=ir&output=rss",
};
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

function getTopic(topicName, callback) {
  log.debug("getTopic", topicName);
  //if topic name is specified
  if (topicName) {
    topicName = topicName.toLowerCase();
      var key = "topic-" + topicName;
      //fetch from S3 cache
      readCache(key, entry => {
        log.debug("cache-entry", key, entry);
        //if cache hits
        if (entry) {
          //return cache entry
          var topic = JSON.parse(entry.Body.toString());
          callback(topic);
          //if cache entry had expired, refresh
          if (new Date().getTime() > Date.parse(entry.LastModified) + 5*60*1000) {
            if (feeds[topicName]) {
              loadContent(feeds[topicName], content => {
                if (content) {
                  var topic = parser.parseFeed(content);
                  topic.name = topicName;
                  writeCache(key, JSON.stringify(topic));
                }
              });
            }
          }
        }
        //if cache misses, load from source
        else {
          if (feeds[topicName]) {
            loadContent(feeds[topicName], content => {
              if (content) {
                var topic = parser.parseFeed(content);
                topic.name = topicName;
                writeCache(key, JSON.stringify(topic));
                callback(topic);
              }
              else callback(null);
            });
          }
          else callback(null);
        }
      });
  }
  //if topic name isn't specified, return the current topic (which may be null)
  else callback(state.topic);
}

function getArticle(articles, position, callback) {
  log.debug("getArticle");
  position = position.toLowerCase();
  var index = positions.indexOf(position);
  if (index == -1) index = positions2.indexOf(position);
  var article = articles[index];
  if (article) {
    if (!article.texts) {
      var key = "article-" + require('crypto').createHash('md5').update(article.link).digest("hex");
      //fetch from S3 cache
      readCache(key, entry => {
        log.debug("cache-entry", key, entry);
        //if cache hits, use cache entry
        if (entry) {
          article.texts = JSON.parse(entry.Body.toString());
          callback(article);
        }
        //if cache misses, load from source
        else {
          loadContent(article.link, content => {
            if (content) {
              article.texts = parser.parseArticle(content, article.link);
              writeCache(key, JSON.stringify(article.texts));
            }
            callback(article);
          });
        }
      });
    }
    else callback(article);
  }
  else callback(null);
}

var articleParsers = [
  { matcher: /cnn\.com$/i, parseArticle: cnn },
  { matcher: /./, parseArticle: defaultArticleParser }
];

exports.parseArticle = function(html, link) {
  var hostname = require("url").parse(link, true).hostname;
  return articleParsers.find(parser => parser.matcher.test(hostname)).parseArticle(doc);
};
