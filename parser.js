
var $;
require("jsdom").env("", (err, window) => {
  if (err) {
    console.error(err);
    return;
  }
  $ = require("jquery")(window);
});

/***********
 Feed Parser
 ***********/

exports.parseFeed = function(xml) {
  var XMLParser = require("xmldom").DOMParser;
  var doc = new XMLParser().parseFromString(xml);
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
};

/**************
 Article Parser
 **************/

var articleParsers = [
  { matcher: /cnn\.com$/i, parseArticle: cnn },
  { matcher: /./, parseArticle: defaultArticleParser }
];

exports.parseArticle = function(html, link) {
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  html = html.replace(/<script[\s\S]*?\/script>/g, '');
  html = html.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/ig, '');
  var doc = $.parseHTML('<div>' + html + '</div>');
  var hostname = require("url").parse(link, true).hostname;
  return articleParsers.find(parser => parser.matcher.test(hostname)).parseArticle(doc);
};

function defaultArticleParser(doc) {
  //only interested in these tags
  var tags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "blockquote"];

  //remove unwanted elems
  $(doc).find("a > *").remove();
  $(doc).find(tags.map(tag => tag + " > div").join(", ")).remove();

  //enum text blocks
  var textBlocks = $(doc).find("p").parent().get();
  $.uniqueSort(textBlocks);

  //find longest text block
  var longest = {length: 0};
  textBlocks.forEach(block => {
    var text = $(block).children(tags.join(", ")).text();
    if (text.length > longest.length) longest = {block: block, length: text.length};
  });

  //return
  if (longest.block) {
    var elems = $(longest.block).children(tags.join(", ")).get();
    return elems.map(elem => $(elem).text().trim()).filter(text => text);
  }
  else return null;
}

function cnn(doc) {
  var paragraphs = $(doc).find(".zn-body__paragraph").get();
  return paragraphs.map(elem => $(elem).text().trim()).filter(text => text);
}
