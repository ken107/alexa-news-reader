const config = require("../util/config");

exports.spread = function(f, self) {
  return function(args) {
    return f.apply(self, args);
  };
};

exports.getTopicIndex = function(source, topicName) {
  return source.topics.findIndex(x => x.name.toLowerCase() == config.topicMapping[topicName] || topicName);
}
