
var log = require("../util/log.js");
var cache = require("../cache/combined.js");
var pending = {};

var loaders = [
  { matcher: /\.forbes\.com$/i, load: require("./article/forbes.js").load },
  { matcher: /./, load: require("./article/default.js").load }
];

exports.load = function(url) {
  if (pending[url]) return pending[url];
  return pending[url] = load(url)
    .then(result => {
      delete pending[url];
      return result;
    })
}

function load(url) {
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
  var loader = loaders.find(loader => loader.matcher.test(hostname));
  return loader.load(url);
}
