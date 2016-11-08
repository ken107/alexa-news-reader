
var parsers = [
  { matcher: /www\.cnn\.com$/i, parse: require("./article/cnn.js").parse },
  { matcher: /\.forbes\.com$/i, parse: require("./article/forbes.js").parse },
  { matcher: /\.usnews\.com$/i, parse: require("./article/usnews.js").parse },
  { matcher: /./, parse: require("./article/default.js").parse }
];

exports.parse = function(html, url) {
  var hostname = require("url").parse(url, true).hostname;
  var parser = parsers.find(parser => parser.matcher.test(hostname));
  return parser.parse(html);
}
