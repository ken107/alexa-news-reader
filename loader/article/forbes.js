
var request = require("request");

exports.load = function(url) {
  var urlObj = require("url").parse(url);
  var rootUrl = require("url").format({
    protocol: urlObj.protocol,
    auth: urlObj.auth,
    host: urlObj.host,
    path: "/"
  });

  var cookieJar = request.jar();
  cookieJar.setCookie(request.cookie("welcomeAd=true"), rootUrl);
  cookieJar.setCookie(request.cookie("dailyWelcomeCookie=true"), rootUrl);

  return require("../http.js").load(url, cookieJar)
    .then(html => require("../../parser/article.js").parse(html, url));
}
