
var log = require("../util/log.js");

exports.load = function(url, cookieJar) {
  log.debug("http", "load", url);
  return new Promise(function(fulfill, reject) {
    require("request").get({
      url: url,
      jar: cookieJar || true,
      gzip: true,
      forever: true,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36"
      }
    },
    function(err, res, body) {
      if (err) reject(err);
      else if (res.statusCode != 200) reject(new Error(`HTTP ${res.statusCode}`));
      else fulfill(body);
    });
  });
}
