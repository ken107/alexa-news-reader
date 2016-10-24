
var log = require("../util/log.js");

module.exports = function(link) {
  log.debug("loadContent", link);
  return new Promise(fulfill, reject) {
    require("request").get({
      url: link,
      jar: true,
      gzip: true,
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36"
      }
    },
    (err, res, body) => {
      if (err) reject(err);
      else if (res.statusCode != 200) reject(new Error(`HTTP ${res.statusCode}`));
      else fulfill(body);
    });
  });
}
