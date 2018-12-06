const config = require("../config.json");

exports.spread = function(f, self) {
  return function(args) {
    return f.apply(self, args);
  };
};

exports.getTopicIndex = function(source, topicName) {
  return source.topics.findIndex(x => x.name.toLowerCase() == config.topicMapping[topicName] || topicName);
}
