
handlers.NextRelatedArticle = function(intentRequest, session, sendResponse) {
  log.debug("NextRelatedArticle");
  var index = state.article.relatedArticles.indexOf(state.relatedArticle) + 1;
  if (index < state.article.relatedArticles.length) {
    this.ReadRelatedArticle(makeIntentRequest({position: {value: positions[index]}}), session, sendResponse);
  }
  else {
    state.yesIntent = "NextArticle";
    sendResponse({
      text: `There are no more related articles. Would you like to read the next article from ${state.topic.name}?`,
      title: "No more related articles",
      reprompt: "To list all articles about the topic, say 'list all articles'."
    });
  }
};
