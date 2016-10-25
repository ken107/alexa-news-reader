
var cheerio = require("cheerio");

exports.parse = function(xml) {
  var $ = cheerio.load(xml, {xmlMode: true});
  return {
    articles: $("channel").first().children("item").get().map(elem => toArticle.call(elem, $))
  };
}

function toArticle($) {
  var title = $(this).children("title").first().text();
  var titleEnd = title.lastIndexOf(" - ");
  var link = $(this).children("link").first().text();
  var descHtml = $(this).children("description").first().text();
  var desc = parseDesc(descHtml);
  return {
    source: title.slice(titleEnd + 3),
    title: title.slice(0, titleEnd),
    link: getLink(link),
    relatedArticles: desc.relatedArticles
  };
}

function getLink(text) {
  return require("url").parse(text, true).query.url;
}

function parseDesc(html) {
  var $ = cheerio.load(html);
  return {
    relatedArticles: $("div.lh > font").get().filter(elem => isRelatedArticle.call(elem, $)).map(elem => toRelatedArticle.call(elem, $))
  };
}

function isRelatedArticle($) {
  var children = $(this).children();
  return children.length == 2 && children.eq(0).is("a") && children.eq(1).is("font");
}

function toRelatedArticle($) {
  var link = $(this).children("a").first();
  return {
    title: link.text(),
    link: getLink(link.attr("href")),
    source: $(this).children("font").first().text()
  };
}
