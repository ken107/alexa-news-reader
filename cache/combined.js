
var localCache = require("./local.js");
var s3Cache = require("./s3.js");

exports.write = function(key, data) {
  return Promise.all([
    localCache.write(key, data),
    s3Cache.write(key, data)
  ]);
}

exports.read = function(key) {
  return Promise.resolve(key)
    .then(localCache.read)
    .catch(err => {
      if (err.message == "NOT_FOUND") {
        return Promise.resolve(key)
          .then(s3Cache.read)
          .then(entry => {
            localCache.write(key, entry.data, entry.lastModified);
            return entry;
          });
      }
      else throw err;
    })
}
