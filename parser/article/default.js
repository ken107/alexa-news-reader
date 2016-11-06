
var cheerio = require("cheerio");

exports.parse = function(html) {
  var $ = cheerio.load(html);
  var tags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "blockquote"];

  //remove unwanted elems
  $("script").remove();
  $("a > *").remove();
  $(tags.map(tag => tag + " > div").join(", ")).remove();

  //find longest text block
  var textBlocks = new Set($("p").parent().get());
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
  else throw new Error("NO_CONTENT");
}
