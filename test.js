
var helper = require("./util/helper.js");
var tests = {};
var ses = {};

tests.scratch = function() {
  tests.topicLoader();
  tests.topicLoader();
}

tests.config = function() {
  Promise.resolve(require("./util/config.js"))
    .then(console.log);
}

tests.log = function() {
  var log = require("./util/log.js");
  log.debug("suppy");
  log.warn("what");
}

tests.localCache = function() {
  var cache = require("./cache/local.js");
  cache.write("test", {a: 1})
    .then(() => cache.read("test"))
    .then(console.log);
}

tests.s3Cache = function() {
  var cache = require("./cache/s3.js");
  cache.write("test", {a: 1})
    .then(() => cache.read("test"))
    .then(console.log);
}

tests.combinedCache = function() {
  var cache = require("./cache/combined.js");
  cache.read("test")
    .then(console.log)
    .catch(console.log);
}

tests.httpLoader = function() {
  Promise.resolve("http://esdiscuss.org/")
    .then(require("./loader/http.js").load)
    .then(console.log);
}

tests.topicLoader = function() {
  Promise.resolve("Technology")
    .then(require("./loader/topic.js").load)
    .then(console.log)
    .catch(err => console.log(err.stack));
}

tests.articleLoader = function() {
  Promise.resolve("http://www.usnews.com/news/national-news/articles/2016-11-08/tim-kaine-joe-biden-rally-for-hillary-clinton-in-virginia")
    .then(require("./loader/article.js").load)
    .then(console.log)
    .catch(err => console.log(err.stack));
}

tests.forbesLoader = function() {
  require("request").debug = true;
  Promise.resolve("http://www.forbes.com/sites/currentevents/2016/11/02/is-the-world-too-prosperous/#33c812d978fb")
    .then(require("./loader/article/forbes.js").load)
    .then(console.log)
    .catch(err => console.log(err.stack));
}

tests.defaultArticleParser = function() {
  Promise.resolve("https://www.washingtonpost.com/news/worldviews/wp/2016/10/24/britains-first-white-lives-matter-rally-was-as-much-of-a-joke-as-it-sounds/")
    .then(require("./loader/http.js").load)
    .then(require("./parser/article/default.js").parse)
    .then(console.log);
}

tests.cnnParser = function() {
  Promise.resolve("http://www.cnn.com/2016/10/24/asia/japan-explosion-car-fire/index.html")
    .then(require("./loader/http.js").load)
    .then(require("./parser/article/cnn.js").parse)
    .then(console.log);
}

tests.googleFeedParser = function() {
  Promise.resolve("https://news.google.com/news?cf=all&hl=en&pz=1&ned=us&topic=el&output=rss")
    .then(require("./loader/http.js").load)
    .then(require("./parser/feed/google.js").parse)
    .then(feed => console.log(feed.articles[0]));
}

tests.launch = function() {
  Promise.resolve([{}, {}])
    .then(helper.spread(require("./intent/launch.js").handle))
    .then(console.log)
    .catch(console.log);
}

tests.listTopics = function() {
  Promise.resolve()
    .then(require("./intent/list_topics.js").handle)
    .then(console.log);
}

tests.listArticles = function() {
  return Promise.resolve([{topicName: "Kim Kardashian"}, ses = {topicName: "Business"}])
    .then(helper.spread(require("./intent/list_articles.js").handle))
    .then(console.log)
    .catch(err => console.log(err.stack));
}

tests.continueListing = function() {
  tests.listArticles()
    .then(() => require("./intent/continue_listing.js").handle(null, ses))
    .then(console.log);
}

tests.readArticle = function() {
  return Promise.resolve([{topicName: "Technology", articleIndex: 2}, ses = {topicName: "Top Stories"}])
    .then(helper.spread(require("./intent/read_article.js").handle))
    .then(console.log)
    .catch(err => console.log(err.stack));
}

tests.continueReading = function() {
  return tests.readArticle()
    .then(() => require("./intent/continue_reading.js").handle(null, ses))
    .then(console.log);
}

tests.nextArticle = function() {
  return Promise.resolve([{}, ses = {topicName: "Technology", articleIndex: 1}])
    .then(helper.spread(require("./intent/next_article.js").handle))
    .then(console.log)
    .catch(console.log);
}

tests.previousArticle = function() {
  return Promise.resolve([{}, ses = {topicName: "Technology", articleIndex: 1}])
    .then(helper.spread(require("./intent/previous_article.js").handle))
    .then(console.log)
    .catch(console.log);
}

tests.listRelatedArticles = function() {
  return Promise.resolve([{}, ses = {topicName: "Technology", articleIndex: 0}])
    .then(helper.spread(require("./intent/list_related_articles.js").handle))
    .then(console.log)
    .catch(console.log);
}

tests.readRelatedArticle = function() {
  return Promise.resolve([{articleIndex: 1}, ses = {topicName: "Technology", articleIndex: 0}])
    .then(helper.spread(require("./intent/read_related_article.js").handle))
    .then(console.log)
    .catch(console.log);
}

tests.continueReadingRelated = function() {
  return tests.readRelatedArticle()
    .then(() => require("./intent/continue_reading_related.js").handle(null, ses))
    .then(console.log);
}

tests.nextRelatedArticle = function() {
  return Promise.resolve([{}, ses = {topicName: "Technology", articleIndex: 0, relatedIndex: 1}])
    .then(helper.spread(require("./intent/next_related_article.js").handle))
    .then(console.log)
    .catch(console.log);
}

tests.stop = function() {
  return Promise.resolve()
    .then(require("./intent/stop.js").handle)
    .then(console.log);
}

tests.help = function() {
  return Promise.resolve([{}, {yesIntent: "PickTopic"}])
    .then(helper.spread(require("./intent/help.js").handle))
    .then(console.log);
}



if (process.argv.length < 3) throw new Error("Need test name");
tests[process.argv[2]].apply(null, process.argv.slice(3));
