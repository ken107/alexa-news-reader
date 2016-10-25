
var tests = {
  config: config,
  log: log,
  localCache: localCache,
  s3Cache: s3Cache,
  httpLoader: httpLoader,
  defaultArticleParser: defaultArticleParser,
  cnnParser: cnnParser,
  googleFeedParser: googleFeedParser
};

if (process.argv.length < 3) throw new Error("Need test name");
tests[process.argv[2]].apply(null, process.argv.slice(3));

function config() {
  Promise.resolve(require("./util/config.js"))
    .then(console.log);
}

function log() {
  var log = require("./util/log.js");
  log.debug("suppy");
  log.warn("what");
}

function localCache() {
  var cache = require("./cache/local.js");
  cache.write("test", {a: 1})
    .then(() => cache.read("test"))
    .then(console.log);
}

function s3Cache() {
  var cache = require("./cache/s3.js");
  cache.write("test", {a: 1})
    .then(() => cache.read("test"))
    .then(console.log);
}

function httpLoader() {
  Promise.resolve("http://esdiscuss.org/")
    .then(require("./loader/http.js").load)
    .then(console.log);
}

function defaultArticleParser() {
  Promise.resolve("https://www.washingtonpost.com/news/worldviews/wp/2016/10/24/britains-first-white-lives-matter-rally-was-as-much-of-a-joke-as-it-sounds/")
    .then(require("./loader/http.js").load)
    .then(require("./parser/article/default.js").parse)
    .then(console.log);
}

function cnnParser() {
  Promise.resolve("http://www.cnn.com/2016/10/24/asia/japan-explosion-car-fire/index.html")
    .then(require("./loader/http.js").load)
    .then(require("./parser/article/cnn.js").parse)
    .then(console.log);
}

function googleFeedParser() {
  Promise.resolve("https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&topic=el&output=rss")
    .then(require("./loader/http.js").load)
    .then(require("./parser/feed/google.js").parse)
    .then(feed => console.log(feed.articles[0]));
}
