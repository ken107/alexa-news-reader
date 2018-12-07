const config = require("../util/config");

exports.spread = function(f, self) {
  return function(args) {
    return f.apply(self, args);
  };
};

exports.getTopicIndex = function(source, topicName) {
  topicName = topicName.toLowerCase();
  topicName = config.topicMapping[topicName] || topicName;
  return source.topics.findIndex(x => x.name.toLowerCase() == topicName);
}
