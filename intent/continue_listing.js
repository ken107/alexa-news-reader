
var config = require("../util/config.js");
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("ContinueListing");

  return Promise.resolve(ses.topicName)
    .then(require("../loader/topic.js").load)
    .then(topic => {
      var text = ses.toList == 0 ? `In ${topic.name}\n\n` : "";
      var start = ses.toList;
      var end = Math.min(start+3, topic.articles.length);
      for (var i=start; i<end; i++) {
        var position = config.positions[i];
        var article = topic.articles[i];
        text += `${position} article.\nFrom ${article.source}.\n${article.title}.\n\n`;
      }

      if (end < topic.articles.length) {
        ses.toList = end;
        ses.yesIntent = "ContinueListing";
        return Promise.resolve({
          title: `In ${topic.name}`,
          text: `${text}Continue?`,
          reprompt: "Or you can say 'read the first article'."
        });
      }
      else {
        return Promise.resolve({
          title: `In ${topic.name}`,
          text: `${text}Which article would you like to read?`,
          reprompt: "You can say 'read the first article'."
        });
      }
    });
}
