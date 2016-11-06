
var parsers = [
  { matcher: /news\.google\.com$/i, parse: require("./feed/google.js").parse }
]

exports.parse = function(html, url) {
  var hostname = require("url").parse(url, true).hostname;
  var parser = parsers.find(parser => parser.matcher.test(hostname));
  return parser.parse(html);
}
