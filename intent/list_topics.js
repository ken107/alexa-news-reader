var config = require("../util/config.js");
var log = require("../util/log.js");
const { getSource } = require("../loader/source");

exports.handle = async function(req, ses) {
  log.debug("ListTopics");
  const source = await getSource(config.sourceIndex);

  ses.yesIntent = "PickTopic";
  return {
    text: "The available topics are: " + source.topics.map(x => x.name).join(", ") + "\n\nWhich topic would you like to read?",
    title: "Topics",
    reprompt: "You can say the name of a topic."
  };
};
