
handlers['AMAZON.YesIntent'] = function(intentRequest, session, sendResponse) {
  log.debug("YesIntent");
  if (state.yesIntent == "ContinueListing") {
    this.ContinueListing(intentRequest, session, sendResponse);
  }
  else if (state.yesIntent == "NextArticle") {
    this.NextArticle(intentRequest, session, sendResponse);
  }
  else if (state.yesIntent == "ContinueReading") {
    this.ContinueReading(intentRequest, session, sendResponse);
  }
  else if (state.yesIntent == "NextRelatedArticle") {
    this.NextRelatedArticle(intentRequest, session, sendResponse);
  }
  else if (state.yesIntent == "TopStories") {
    this.ListArticles(makeIntentRequest({topic: {value: "Top Stories"}}), session, sendResponse);
  }
  else if (state.yesIntent == "HangOut") {
    this.HangOut(intentRequest, session, sendResponse);
  }
  else {
    state.yesIntent = "TopStories";
    sendResponse({
      text: "I'm not sure what you mean. Would you like to hear the top news stories?",
      title: "What do you mean?",
      reprompt: "To hear the list of topics, say 'list topics'."
    });
  }
};
