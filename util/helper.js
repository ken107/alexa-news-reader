
exports.spread = function(f, self) {
  return function(args) {
    return f.apply(self, args);
  };
};

exports.getTopicIndex = function(source, topicName) {
  topicName = topicName.toLowerCase();
  return source.topics.findIndex(x => x.name.toLowerCase().replace(/\./g,'') == topicName);
}
