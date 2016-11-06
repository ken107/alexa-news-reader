
var config = require("../util/config.js");
var log = require("../util/log.js");
var cache = require("../cache/combined.js");
var pending = {};

exports.load = function(topicName) {
  if (pending[topicName]) return pending[topicName];
  return pending[topicName] = load(topicName)
    .then(result => {
      delete pending[topicName];
      return result;
    })
}

function load(topicName) {
  log.debug("topic", "load", topicName);

  var key = "topic-" + topicName.toLowerCase();
  return cache.read(key)
    .then(entry => {
      if (new Date().getTime() > entry.lastModified + 15*60*1000) {
        log.debug("cache entry expired");
        throw new Error("NOT_FOUND");
      }
      return entry.data;
    })
    .catch(err => {
      if (err.message == "NOT_FOUND") return loadFeed(topicName).then(topic => {cache.write(key, topic); return topic;});
      else throw err;
    })
    .then(topic => {
      topic.name = topicName;
      return topic;
    });
}

function loadFeed(topicName) {
  var url = config.feeds[topicName.toLowerCase()];
  if (!url) url = config.feeds.$$.replace("${topic}", encodeURIComponent(topicName));

  return Promise.resolve(url)
    .then(require("./http.js").load)
    .then(xml => require("../parser/feed.js").parse(xml, url));
}
