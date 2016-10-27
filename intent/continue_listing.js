
var config = require("../util/config.js");
var log = require("../util/log.js");

exports.handle = function(req, ses) {
  log.debug("ContinueListing");

  if (!ses.topicName) throw new Error("NO_TOPIC");

  return Promise.resolve(ses.topicName)
    .then(require("../loader/topic.js").load)
    .then(topic => listNext(topic, ses));
}

function listNext(topic, ses) {
  var start = ses.toList;
  var end = Math.min(start+3, topic.articles.length);
  var text = start == 0 ? `In topic ${topic.name}\n\n` : "";
  for (var i=start; i<end; i++) {
    var position = config.positions[i];
    var article = topic.articles[i];
    text += `${position} article.\nFrom ${article.source}.\n${article.title}.\n\n`;
  }

  if (end < topic.articles.length) {
    ses.toList = end;
    ses.yesIntent = "ContinueListing";
    return {
      title: topic.name,
      text: `${text}Continue?`,
      reprompt: "Or you can say 'read the first article'."
    };
  }
  else {
    return {
      title: topic.name,
      text: `${text}Which article would you like to read?`,
      reprompt: "You can say 'read the first article'."
    };
  }
}
