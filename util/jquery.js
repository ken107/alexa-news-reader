
module.exports = new Promise(function(fulfill, reject) {
  require("jsdom").env("", (err, window) => {
    if (err) reject(err);
    else fulfill(require("jquery")(window));
  });
});
