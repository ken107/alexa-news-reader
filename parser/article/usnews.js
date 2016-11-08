
exports.parse = function(html) {
  var $ = require("cheerio").load(html);
  var paragraphs = $(".ad-in-text-target > p").get();
  var texts = paragraphs.map(elem => $(elem).text().trim()).filter(text => text);
  return texts;
}
