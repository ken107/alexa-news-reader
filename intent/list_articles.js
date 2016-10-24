
handlers.ListArticles = function(intentRequest, session, sendResponse) {
  log.debug("ListArticles");
  getTopic(intentRequest.intent.slots.topic.value, topic => {
    if (topic) {
      state.topic = topic;
      state.toList = {
        topicName: topic.name,
        heads: [`In ${topic.name}.`],
        texts: topic.articles.map((article, index) => `${positions[index]} article.\nFrom ${article.source}.\n${article.title}.`)
      };
      this.ContinueListing(intentRequest, session, sendResponse);
    }
    else {
      sendResponse({
        text: "Which topic?",
        title: "No topic",
        reprompt: "To hear the list of topics, say 'list topics'."
      });
    }
  });
};
