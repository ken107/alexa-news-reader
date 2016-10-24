
module.exports = function(doc) {
  return require("../../util/jquery.js").then(function($) {
    var paragraphs = $(doc).find(".zn-body__paragraph").get();
    var texts = paragraphs.map(elem => $(elem).text().trim()).filter(text => text);
    return texts;
  });
}
