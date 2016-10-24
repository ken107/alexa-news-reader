
handlers['AMAZON.NoIntent'] = function(intentRequest, session, sendResponse) {
  log.debug("NoIntent");
    if (state.yesIntent == "ContinueListing") {
      state.yesIntent = null;
      sendResponse({
        text: "Please tell me which article you'd like to read.",
        title: "Choose article",
        reprompt: "You can say 'read the first article'."
      })
    }
    else if (state.yesIntent == "NextArticle") {
      state.yesIntent = null;
      sendResponse({
        text: "Please tell me which article you'd like to read.",
        title: "Choose article",
        reprompt: "You can say 'read the first article about Health'"
      })
    }
    else if (state.yesIntent == "ContinueReading") {
      state.yesIntent = "NextArticle";
      sendResponse({
        text: "Would you like me to read the next article?",
        title: "Next article?",
        reprompt: `Would you like to read the next article from ${state.topic.name}?`
      });
    }
    else if (state.yesIntent == "NextRelatedArticle") {
      state.yesIntent = "NextArticle";
      sendResponse({
        text: `Would you like me to read the next article from ${state.topic.name}?`,
        title: "Next article?",
        reprompt: `You can choose another topic by saying 'read me Technology news'`
      });
    }
    else if (state.yesIntent != "HangOut") {
      state.yesIntent = "HangOut";
      sendResponse({
        text: "So, what do ya want to do? Hang out?",
        title: "What next?",
        reprompt: "Do you want to hang out?"
      });
    }
    else {
      sendResponse({
        text: "Okay, I can't help you. Goodbye.",
        title: "Can't help you",
        shouldEndSession: true
      });
    }
};
