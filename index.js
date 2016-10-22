'use strict';

var handlers = {};
var state = {
  topics: {}
};
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

var log = require("loglevel");
log.setLevel(process.env.LOG_LEVEL || "warn");

var $;
require("jsdom").env("", (err, window) => {
  if (err) {
    console.error(err);
    return;
  }
  $ = require("jquery")(window);
});

var DOMParser = require("xmldom").DOMParser;
var domParser = new DOMParser();

var AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: 'AKIAJJYDT5S6ZEOK4JXA',
  secretAccessKey: '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',
  region: 'us-east-1'
});
var s3 = new AWS.S3();

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

handlers.Launch = function(launchRequest, session, sendResponse) {
  log.debug("Launch");
  sendResponse({
    text: "Which topic would you like to read?",
    title: "Welcome",
    reprompt: "To hear the list of topics, say 'list topics'."
  });
};

handlers.ListTopics = function(intentRequest, session, sendResponse) {
  log.debug("ListTopics");
  sendResponse({
    text: topics.join(", ") + "\n\nWhich topic would you like to read?",
    title: "Topics",
    reprompt: "You can say the name of a topic."
  });
};

handlers.ListArticles = function(intentRequest, session, sendResponse) {
  log.debug("ListArticles");
  getTopic(intentRequest.intent.slots.topic.value, topic => {
    if (topic) {
      state.topic = topic;
      sendResponse({
        text: `In ${topic.name}.\n\n` + topic.articles.map((article, index) => `${positions[index]} article.\nFrom ${article.source}.\n${article.title}.`).join("\n\n") + "\n\nWhich article would you like to read?",
        title: `In ${topic.name}`,
        reprompt: "You can say 'read the first article'."
      });
    }
    else {
      sendResponse({
        text: "Which topic?",
        title: "No topic",
        reprompt: "To hear the list of topics, say 'list topics'."
      });
    }
  });
};

handlers.ReadArticle = function(intentRequest, session, sendResponse) {
  log.debug("ReadArticle");
  getTopic(intentRequest.intent.slots.topic.value, topic => {
    if (topic) {
      state.topic = topic;
      getArticle(topic.articles, intentRequest.intent.slots.position.value, article => {
        if (article) {
          state.article = article;
          if (article.texts) {
            state.toRead = {
              title: article.title,
              texts: [`From ${article.source}.`, `${article.title}.`].concat(article.texts)
            };
            this.ContinueReading(intentRequest, session, sendResponse);
          }
          else {
            state.yesIntent = "NextRelatedArticle";
            sendResponse({
              text: "An error occurred while loading this article, should I read you a related article?",
              title: "Error loading article",
              reprompt: "You can also say 'read me the first related article'."
            });
          }
        }
        else {
          sendResponse({
            text: "You made an invalid choice. Which article would you like me to read?",
            title: "Invalid choice",
            reprompt: "You can say 'read me the first article'."
          });
        }
      });
    }
    else {
      sendResponse({
        text: "Which topic?",
        title: "No topic",
        reprompt: "To hear the list of topics, say 'list topics'."
      });
    }
  });
};

handlers.ContinueReading = function(intentRequest, session, sendResponse) {
  log.debug("ContinueReading");
  var text = "";
  while (state.toRead.texts.length && (text.length + state.toRead.texts[0].length + 50) <= 8000) text += state.toRead.texts.shift() + "\n\n";
  if (state.toRead.texts.length) {
    state.yesIntent = "ContinueReading";
    sendResponse({
      text: `${text}Continue?`,
      title: state.toRead.title,
      reprompt: "Should I continue reading?"
    });
  }
  else {
    state.yesIntent = "NextArticle";
    sendResponse({
      text: `${text}Would you like me to read the next article?`,
      title: state.toRead.title,
      reprompt: "You can also say 'related articles' to list articles related to the one you just heard."
    });
  }
};

handlers.ListRelatedArticles = function(intentRequest, session, sendResponse) {
  log.debug("ListRelatedArticles");
  if (state.article) {
    if (state.article.relatedArticles.length) {
      sendResponse({
        text: state.article.relatedArticles.map((article, index) => `${positions[index]} related article.\nFrom ${article.source}.\n${article.title}.`).join("\n\n") + "\n\nWhich related article would you like to read?",
        title: 'Related Articles',
        reprompt: "You can say 'read the first related article'."
      });
    }
    else {
      state.yesIntent = "NextArticle";
      sendResponse({
        text: "No related articles found, should I read the next article?",
        title: "No related articles",
        reprompt: "Should I read the next article?"
      })
    }
  }
  else {
    sendResponse({
      text: "You haven't read anything yet. To read an article about a topic, say 'read the first article about Science'.",
      title: 'No related articles',
      reprompt: "To list articles about a topic, say 'list articles about Science'."
    })
  }
};

handlers.ReadRelatedArticle = function(intentRequest, session, sendResponse) {
  log.debug("ReadRelatedArticle");
  if (state.article) {
    getArticle(state.article.relatedArticles, intentRequest.intent.slots.position.value, article => {
      if (article) {
        state.relatedArticle = article;
        if (article.texts) {
          state.toRead = {
            title: article.title,
            texts: [`From ${article.source}.`, `${article.title}.`].concat(article.texts)
          };
          this.ContinueReading(intentRequest, session, sendResponse);
        }
        else {
          state.yesIntent = "NextRelatedArticle";
          sendResponse({
            text: "An error occurred while loading this article, should I try the next related article?",
            title: "Error loading article",
            reprompt: "Would you like me to read the next related article?"
          });
        }
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
      text: "You haven't read anything yet. To read an article about a topic, say 'read the first article about Science'.",
      title: 'No related articles',
      reprompt: "To list articles about a topic, say 'list articles about Science'."
    })
  }
};

handlers.PreviousArticle = function(intentRequest, session, sendResponse) {
  log.debug("PreviousArticle");
  if (state.article) {
    var index = state.topic.articles.indexOf(state.article) - 1;
    if (index >= 0) {
      this.ReadArticle(makeIntentRequest({topic: {value: state.topic.name}, position: {value: positions[index]}}), session, sendResponse);
    }
    else {
      sendResponse({
        text: "You made an invalid choice. Which article would you like me to read?",
        title: "Invalid choice",
        reprompt: "You can say 'read me the first article'."
      });
    }
  }
  else {
    sendResponse({
      text: "Which topic would you like to read?",
      title: "Which topic?",
      reprompt: "For a list of topics, say 'list topics'."
    });
  }
};

handlers.NextArticle = function(intentRequest, session, sendResponse) {
  log.debug("NextArticle");
  if (state.topic) {
    var index = state.topic.articles.indexOf(state.article) + 1;
    if (index < state.topic.articles.length) {
      this.ReadArticle(makeIntentRequest({topic: {value: state.topic.name}, position: {value: positions[index]}}), session, sendResponse);
    }
    else {
      sendResponse({
        text: "There are no more articles from this topic. Which topic would you like to read?",
        title: "No more articles",
        reprompt: "For a list of topics, say 'list topics'."
      });
    }
  }
  else {
    sendResponse({
      text: "Which topic would you like to read?",
      title: "Which topic?",
      reprompt: "For a list of topics, say 'list topics'."
    });
  }
};

handlers.NextRelatedArticle = function(intentRequest, session, sendResponse) {
  log.debug("NextRelatedArticle");
  var index = state.article.relatedArticles.indexOf(state.relatedArticle) + 1;
  if (index < state.article.relatedArticles.length) {
    this.ReadRelatedArticle(makeIntentRequest({position: {value: positions[index]}}), session, sendResponse);
  }
  else {
    state.yesIntent = "NextArticle";
    sendResponse({
      text: `There are no more related articles. Would you like to read the next article from ${state.topic.name}?`,
      title: "No more related articles",
      reprompt: "To list all articles about the topic, say 'list all articles'."
    });
  }
};

handlers.HangOut = function(intentRequest, session, sendResponse)  {
  log.debug("HangOut");
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
  log.debug("YesIntent");
  if (state.yesIntent == "NextArticle") {
    this.NextArticle(makeIntentRequest(), session, sendResponse);
  }
  else if (state.yesIntent == "ContinueReading") {
    this.ContinueReading(makeIntentRequest(), session, sendResponse);
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
    state.yesIntent = "TopStories";
    sendResponse({
      text: "I'm not sure what you mean. Would you like to hear the top news stories?",
      title: "What do you mean?",
      reprompt: "To hear the list of topics, say 'list topics'."
    });
  }
};

handlers['AMAZON.NoIntent'] = function(intentRequest, session, sendResponse) {
  log.debug("NoIntent");
    if (state.yesIntent == "NextArticle") {
      sendResponse({
        text: "Please tell me which article you'd like to read.",
        title: "Choose article",
        reprompt: "You can say 'read the first article about Health'"
      })
    }
    else if (state.yesIntent == "ContinueReading") {
      state.yesIntent = "NextArticle";
      sendResponse({
        text: "Would you like me to read the next article?",
        title: "Next article?",
        reprompt: `Would you like to read the next article from ${state.topic.name}?`
      });
    }
    else if (state.yesIntent == "NextRelatedArticle") {
      state.yesIntent = "NextArticle";
      sendResponse({
        text: `Would you like me to read the next article from ${state.topic.name}?`,
        title: "Next article?",
        reprompt: `You can choose another topic by saying 'read me Technology news'`
      });
    }
    else if (state.yesIntent != "HangOut") {
      state.yesIntent = "HangOut";
      sendResponse({
        text: "So, what do ya want to do? Hang out?",
        title: "What next?",
        reprompt: "Do you want to hang out?"
      });
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
  log.debug("StopIntent");
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

function getTopic(topicName, callback) {
  log.debug("getTopic", topicName);
  if (topicName) {
    topicName = topicName.toLowerCase();
    if (!state.topics[topicName]) {
      var key = "topic-" + topicName;
      readCache(key, entry => {
        log.debug("cache-entry", key, entry);
        if (entry) {
          state.topics[topicName] = JSON.parse(entry.Body.toString());
          callback(state.topics[topicName]);
          if (new Date().getTime() > Date.parse(entry.LastModified) + 2*60*1000) {
            if (feeds[topicName]) {
              loadContent(feeds[topicName], content => {
                if (content) {
                  var topic = parseFeed(content);
                  topic.name = topicName;
                  state.topics[topicName] = topic;
                  writeCache(key, JSON.stringify(topic));
                }
              });
            }
          }
        }
        else {
          if (feeds[topicName]) {
            loadContent(feeds[topicName], content => {
              if (content) {
                var topic = parseFeed(content);
                topic.name = topicName;
                state.topics[topicName] = topic;
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
    else callback(state.topics[topicName]);
  }
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
      readCache(key, entry => {
        log.debug("cache-entry", key, entry);
        if (entry) {
          article.texts = JSON.parse(entry.Body.toString());
          callback(article);
          if (new Date().getTime() > Date.parse(entry.LastModified) + Math.max(Date.parse(entry.LastModified)-entry.Metadata.created, 5*60*1000)) {
            loadContent(article.link, content => {
              if (content) {
                article.texts = parseArticle(content);
                writeCache(key, JSON.stringify(article.texts), {created: entry.Metadata.created});
              }
            });
          }
        }
        else {
          loadContent(article.link, content => {
            if (content) {
              article.texts = parseArticle(content);
              writeCache(key, JSON.stringify(article.texts), {created: String(new Date().getTime())});
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

function loadContent(link, callback) {
  log.debug("loadContent", link);
  require("request")
    .get({
      url: link,
      jar: true,
      gzip: true,
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36"
      }
    },
    (err, res, body) => {
      if (err) {
        log.error(err);
        callback(null);
      }
      else if (res.statusCode != 200) {
        log.error(res.statusCode);
        callback(null);
      }
      else callback(body);
    });
}

function parseFeed(xml) {
  var doc = domParser.parseFromString(xml);
  return {
    articles: $(doc).find("channel:first > item").map(toArticle).get()
  };
  function toArticle() {
    var title = $(this).children("title:first").text();
    var titleEnd = title.lastIndexOf(" - ");
    var desc = $(this).children("description:first").text();
    var descDoc = $.parseHTML(desc);
    return {
      source: title.slice(titleEnd + 3),
      title: title.slice(0, titleEnd),
      link: getLink($(this).children("link:first").text()),
      relatedArticles: $(descDoc).find("div.lh > font").filter(isRelatedArticle).map(toRelatedArticle).get()
    };
  }
  function isRelatedArticle() {
    var children = $(this).children();
    return children.length == 2 && children.eq(0).is("a") && children.eq(1).is("font");
  }
  function toRelatedArticle() {
    var link = $(this).children("a:first");
    return {
      title: link.text(),
      link: getLink(link.attr("href")),
      source: $(this).children("font:first").text()
    };
  }
  function getLink(text) {
    return require("url").parse(text, true).query.url;
  }
}

function parseArticle(html) {
  html = '<div>' + html.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/ig, '') + '</div>';
  var doc = $.parseHTML(html);
  $(doc).find("a > *").remove();
  var tags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "blockquote"];
  $(doc).find(tags.map(tag => tag + " > div").join(", ")).remove();
  var textBlocks = $(doc).find("p").parent().get();
  $.uniqueSort(textBlocks);
  var longest = {length: 0};
  textBlocks.forEach(block => {
    var text = $(block).children(tags.join(", ")).text();
    if (text.length > longest.length) longest = {block: block, length: text.length};
  });
  if (longest.block) {
    var elems = $(longest.block).children(tags.join(", ")).get();
    return elems.map(elem => $(elem).text().trim()).filter(text => text);
  }
  else return null;
}

function writeCache(key, body, metadata) {
  log.debug("writeCache", key);
  s3.putObject({
    Bucket: "news-reader-article-cache",
    Key: key,
    Body: body,
    Metadata: metadata
  },
  function(err) {
    if (err) console.error(err);
  });
}

function readCache(key, callback) {
  log.debug("readCache", key);
  s3.getObject({
    Bucket: "news-reader-article-cache",
    Key: key
  },
  function(err, data) {
    if (err && err.code != 'NoSuchKey') console.error(err);
    callback(data);
  });
}
