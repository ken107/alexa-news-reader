
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

tests.sourceLoader = function() {
  Promise.resolve()
    .then(() => require("./loader/source").getSource(0))
    .then(console.log)
    .catch(console.error)
}

tests.topicLoader = function() {
  Promise.resolve()
    .then(() => require("./loader/topic").getTopic(0,0))
    .then(console.log)
    .catch(console.error)
}

tests.articleLoader = function() {
  Promise.resolve()
    .then(() => require("./loader/article").getArticle(0,0,0))
    .then(console.log)
    .catch(console.error)
}

tests.launch = function() {
  Promise.resolve([{}, {}])
    .then(helper.spread(require("./intent/launch.js").handle))
    .then(console.log)
    .catch(console.error)
}

tests.listTopics = function() {
  Promise.resolve([{}, {}])
    .then(helper.spread(require("./intent/list_topics.js").handle))
    .then(console.log)
    .catch(console.error)
}

tests.listArticles = function() {
  return Promise.resolve([{topicName: "Science"}, ses = {topicName: "Business"}])
    .then(helper.spread(require("./intent/list_articles.js").handle))
    .then(console.log)
    .catch(console.error)
}

tests.continueListing = function() {
  tests.listArticles()
    .then(() => require("./intent/continue_listing.js").handle(null, ses))
    .then(console.log)
    .catch(console.error)
}

tests.readArticle = function() {
  return Promise.resolve([{topicName: "Technology", articleIndex: 2}, ses = {topicName: "Top Stories"}])
    .then(helper.spread(require("./intent/read_article.js").handle))
    .then(console.log)
    .catch(console.error)
}

tests.continueReading = function() {
  return tests.readArticle()
    .then(() => require("./intent/continue_reading.js").handle(null, ses))
    .then(console.log)
    .catch(console.error)
}

tests.listRelatedArticles = function() {
  return Promise.resolve([{}, ses = {topicName: "Technology", articleIndex: 0}])
    .then(helper.spread(require("./intent/list_related_articles.js").handle))
    .then(console.log)
    .catch(console.error)
}

tests.readRelatedArticle = function() {
  return Promise.resolve([{articleIndex: 1}, ses = {topicName: "Technology", articleIndex: 0}])
    .then(helper.spread(require("./intent/read_related_article.js").handle))
    .then(console.log)
    .catch(console.error)
}

tests.continueReadingRelated = function() {
  return tests.readRelatedArticle()
    .then(() => require("./intent/continue_reading_related.js").handle(null, ses))
    .then(console.log)
    .catch(console.error)
}

tests.nextRelatedArticle = function() {
  return Promise.resolve([{}, ses = {topicName: "Technology", articleIndex: 0, relatedIndex: 1}])
    .then(helper.spread(require("./intent/next_related_article.js").handle))
    .then(console.log)
    .catch(console.error)
}

tests.stop = function() {
  return Promise.resolve()
    .then(require("./intent/stop.js").handle)
    .then(console.log)
    .catch(console.error)
}

tests.help = function() {
  return Promise.resolve([{}, {yesIntent: "PickTopic"}])
    .then(helper.spread(require("./intent/help.js").handle))
    .then(console.log)
    .catch(console.error)
}



if (process.argv.length < 3) throw new Error("Need test name");
tests[process.argv[2]].apply(null, process.argv.slice(3));
