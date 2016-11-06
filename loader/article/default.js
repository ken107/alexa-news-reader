
exports.load = function(url) {
  return require("../http.js").load(url)
    .then(html => require("../../parser/article.js").parse(html, url));
}
