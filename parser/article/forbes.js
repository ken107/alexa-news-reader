
exports.parse = function(html) {
  var matches = html.match(/"body":".*?[^\\]"/);
  var body = JSON.parse('{' + matches[0] + '}').body;
  body = body.replace(/\[caption.*?\/caption\]/g, '');
  body = body.replace(/\[.*?\]/g, '');
  var $ = require("cheerio").load(body);
  return $.text().split(/(?:\r\n){2,}/);
}
