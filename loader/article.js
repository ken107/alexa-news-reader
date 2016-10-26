
var parsers = [
  { matcher: /www\.cnn\.com$/i, parse: require("./article/cnn.js") },
  { matcher: /./, parse: require("./article/default.js") }
];
var hostname = require("url").parse(link, true).hostname;
return parsers.find(parser => parser.matcher.test(hostname)).parse(doc);

exports.load = function(link) {
  log.debug("getArticle");
  position = position.toLowerCase();
  var index = positions.indexOf(position);
  if (index == -1) index = positions2.indexOf(position);
  var article = articles[index];
  if (article) {
    if (!article.texts) {
      var key = "article-" + require('crypto').createHash('md5').update(article.link).digest("hex");
      //fetch from S3 cache
      readCache(key, entry => {
        log.debug("cache-entry", key, entry);
        //if cache hits, use cache entry
        if (entry) {
          article.texts = JSON.parse(entry.Body.toString());
          callback(article);
        }
        //if cache misses, load from source
        else {
          loadContent(article.link, content => {
            if (content) {
              article.texts = parser.parseArticle(content, article.link);
              writeCache(key, JSON.stringify(article.texts));
            }
            callback(article);
          });
        }
      });
    }
    else callback(article);
  }
  else callback(null);
}
