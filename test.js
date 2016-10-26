
var helper = require("./util/helper.js");

var tests = {
  scratch: scratch,
  config: config,
  log: log,
  localCache: localCache,
  s3Cache: s3Cache,
  httpLoader: httpLoader,
  topicLoader: topicLoader,
  articleLoader: articleLoader,
  defaultArticleParser: defaultArticleParser,
  cnnParser: cnnParser,
  googleFeedParser: googleFeedParser,
  launch: launch,
  listTopics: listTopics,
  listArticles: listArticles,
  continueListing: continueListing
};

if (process.argv.length < 3) throw new Error("Need test name");
tests[process.argv[2]].apply(null, process.argv.slice(3));

function scratch() {
  new Promise(function(resolve, reject) {
    resolve('Success');
  }).then(function(value) {
    console.log(value); // "Success!"
    throw 'oh, no!';
  }).catch(function(e) {
    console.log(e); // "oh, no!"
    return "HEllo";
  }).then(function(value) {
    console.log('after a catch the chain is restored', value);
  }, function () {
    console.log('Not fired due to the catch');
  });
}

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

function topicLoader() {
  Promise.resolve("Technology")
    .then(require("./loader/topic.js").load)
    .then(console.log)
    .catch(err => console.log(err.stack));
}

function articleLoader() {

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

function launch() {
  Promise.resolve()
    .then(require("./intent/launch.js").handle)
    .then(console.log);
}

function listTopics() {
  Promise.resolve()
    .then(require("./intent/list_topics.js").handle)
    .then(console.log);
}

function listArticles() {
  Promise.resolve([{topicName: "Technology"}, {topicName: "Business"}])
    .then(helper.spread(require("./intent/list_articles.js").handle))
    .then(console.log)
    .catch(err => console.log(err.stack));
}
