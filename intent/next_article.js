
handlers.NextArticle = function(intentRequest, session, sendResponse) {
  log.debug("NextArticle");
  if (state.topic) {
    var index = state.topic.articles.indexOf(state.article) + 1;
    if (index < state.topic.articles.length) {
      this.ReadArticle(makeIntentRequest({topic: {value: state.topic.name}, position: {value: positions[index]}}), session, sendResponse);
    }
    else {
      sendResponse({
        text: "There are no more articles from this topic. Which topic would you like to read?",
        title: "No more articles",
        reprompt: "For a list of topics, say 'list topics'."
      });
    }
  }
  else {
    sendResponse({
      text: "Which topic would you like to read?",
      title: "Which topic?",
      reprompt: "For a list of topics, say 'list topics'."
    });
  }
};
