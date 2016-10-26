
var log = require("../util/log.js");
var cache = require("../cache/combined.js");

var parsers = [
  { matcher: /www\.cnn\.com$/i, parse: require("../parser/article/cnn.js").parse },
  { matcher: /./, parse: require("../parser/article/default.js").parse }
];

exports.load = function(url) {
  log.debug("article", "load", url);

  var hash = require('crypto').createHash('md5').update(url).digest("hex");
  var key = "article-" + hash;
  return cache.read(key)
    .then(entry => entry.data)
    .catch(err => {
      if (err.message == "NOT_FOUND") return loadFeed(url).then(texts => {cache.write(key, texts); return texts;});
      else throw err;
    });
}

function loadFeed(url) {
  var hostname = require("url").parse(url, true).hostname;
  var parser = parsers.find(parser => parser.matcher.test(hostname));
  return Promise.resolve(url)
    .then(require("../loader/http.js").load)
    .then(parser.parse);
}
