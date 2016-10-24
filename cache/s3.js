
var log = require("../util/log.js");

var AWS = require("aws-sdk");
var s3 = new AWS.S3();

exports.write = function(key, body) {
  log.debug("writeCache", key);
  return new Promise(function(fulfill, reject) {
    s3.putObject({
      Bucket: "news-reader-article-cache",
      Key: key,
      Body: body,
      CacheControl: "no-cache"
    },
    function(err, data) {
      if (err) reject(err);
      else fulfill(data);
    });
  });
};

exports.read = function(key) {
  log.debug("readCache", key);
  return new Promise(function(fulfill, reject) {
    s3.getObject({
      Bucket: "news-reader-article-cache",
      Key: key
    },
    function(err, data) {
      if (err && err.code != 'NoSuchKey') reject(err);
      else fulfill(data);
    });
  });
}
