
var config = require("../util/config.js");
var log = require("../util/log.js");
var localCache = require("../cache/local.js");
var s3Cache = require("../cache/s3.js");

exports.load = function(topicName) {
  log.debug("topic", "load", topicName);

  var key = "topic-" + topicName.toLowerCase();
  return readCache(key)
    .then(entry => {
      if (new Date().getTime() > entry.lastModified + 5*60*1000) {
        log.debug("cache entry expired");
        loadFeed(topicName)
          .then(topic => {
            localCache.write(key, topic);
            s3Cache.write(key, topic);
          });
      }
      return entry.data;
    })
    .catch(err => {
      if (err.message == "NOT_FOUND") {
        log.debug("cache miss");
        return loadFeed(topicName)
          .then(topic => {
            localCache.write(key, topic);
            s3Cache.write(key, topic);
            return topic;
          });
      }
      else throw err;
    })
    .then(topic => {
      topic.name = topicName;
      return topic;
    });
}

function readCache(key) {
  return Promise.resolve(key)
    .then(localCache.read)
    .then(entry => {
      log.debug("local cache hit");
      return entry;
    })
    .catch(err => {
      if (err.message == "NOT_FOUND") {
        return Promise.resolve(key)
          .then(s3Cache.read)
          .then(entry => {
            log.debug("s3 cache hit");
            localCache.write(key, entry.data, entry.lastModified);
            return entry;
          });
      }
      else throw err;
    });
}

function loadFeed(topicName) {
  var url = config.feeds[topicName.toLowerCase()];
  if (!url) throw new Error("NO_FEED");

  return Promise.resolve(url)
    .then(require("../loader/http.js").load)
    .then(require("../parser/feed/google.js").parse);
}
