
exports.parse = function(doc) {
  return require("../../util/jquery.js").then($ => parse($, doc));
}

function parse($, doc) {
  return {
    articles: $(doc).find("channel:first > item").map(toArticle).get()
  };

  function toArticle() {
    var title = $(this).children("title:first").text();
    var titleEnd = title.lastIndexOf(" - ");
    var desc = $(this).children("description:first").text();
    var descDoc = $.parseHTML(desc);
    return {
      source: title.slice(titleEnd + 3),
      title: title.slice(0, titleEnd),
      link: getLink($(this).children("link:first").text()),
      relatedArticles: $(descDoc).find("div.lh > font").filter(isRelatedArticle).map(toRelatedArticle).get()
    };
  }

  function isRelatedArticle() {
    var children = $(this).children();
    return children.length == 2 && children.eq(0).is("a") && children.eq(1).is("font");
  }

  function toRelatedArticle() {
    var link = $(this).children("a:first");
    return {
      title: link.text(),
      link: getLink(link.attr("href")),
      source: $(this).children("font:first").text()
    };
  }

  function getLink(text) {
    return require("url").parse(text, true).query.url;
  }
}
