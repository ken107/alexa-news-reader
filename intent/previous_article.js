
handlers.PreviousArticle = function(intentRequest, session, sendResponse) {
  log.debug("PreviousArticle");
  if (state.article) {
    var index = state.topic.articles.indexOf(state.article) - 1;
    if (index >= 0) {
      this.ReadArticle(makeIntentRequest({topic: {value: state.topic.name}, position: {value: positions[index]}}), session, sendResponse);
    }
    else {
      sendResponse({
        text: "You made an invalid choice. Which article would you like me to read?",
        title: "Invalid choice",
        reprompt: "You can say 'read me the first article'."
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
