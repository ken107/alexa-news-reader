
exports.parse = function(doc) {
  return require("../../util/jquery.js").then($ => parse($, doc));
}

function parse($, doc) {
  var paragraphs = $(doc).find(".zn-body__paragraph").get();
  var texts = paragraphs.map(elem => $(elem).text().trim()).filter(text => text);
  return texts;
}
