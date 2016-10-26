
var log = require("../util/log.js");
var cache = {};

exports.write = function(key, data, lastModified) {
  cache[key] = {
    data: data,
    lastModified: lastModified || new Date().getTime()
  };
  return Promise.resolve();
}

exports.read = function(key) {
  if (cache[key]) {
    log.debug("local cache hit");
    return Promise.resolve(cache[key]);
  }
  else {
    log.debug("local cache miss");
    return Promise.reject(new Error("NOT_FOUND"));
  }
}
