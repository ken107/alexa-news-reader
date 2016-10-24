
exports.parse = function(html) {
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  html = html.replace(/<script[\s\S]*?\/script>/g, '');
  html = html.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/ig, '');
  return require("../util/jquery.js").then($ => $.parseHTML('<div>' + html + '</div>')[0]);
}
