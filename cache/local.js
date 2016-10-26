
var log = require("../util/log.js");
var cache = {};

exports.write = function(key, data, lastModified) {
  log.debug("local write", key);
  cache[key] = {
    data: data,
    lastModified: lastModified || new Date().getTime()
  };
  return Promise.resolve();
}

exports.writeEntry = function(key, entry) {
  log.debug("local write", key);
  cache[key] = entry;
  return Promise.resolve();
}

exports.read = function(key) {
  log.debug("local read", key);
  if (cache[key]) {
    log.debug("local cache hit");
    return Promise.resolve(cache[key]);
  }
  else {
    log.debug("local cache miss");
    return Promise.reject(new Error("NOT_FOUND"));
  }
}
