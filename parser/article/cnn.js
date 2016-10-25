
var cheerio = require("cheerio");

exports.parse = function(html) {
  var $ = cheerio.load(html);
  var paragraphs = $(".zn-body__paragraph").get();
  var texts = paragraphs.map(elem => $(elem).text().trim()).filter(text => text);
  return texts;
}
