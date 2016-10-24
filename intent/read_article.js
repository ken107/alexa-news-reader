
handlers.ReadArticle = function(intentRequest, session, sendResponse) {
  log.debug("ReadArticle");
  getTopic(intentRequest.intent.slots.topic.value, topic => {
    if (topic) {
      state.topic = topic;
      getArticle(topic.articles, intentRequest.intent.slots.position.value, article => {
        if (article) {
          state.article = article;
          if (article.texts) {
            state.toRead = {
              title: article.title,
              texts: [`From ${article.source}.`, `${article.title}.`].concat(article.texts)
            };
            this.ContinueReading(intentRequest, session, sendResponse);
          }
          else {
            state.yesIntent = "NextRelatedArticle";
            sendResponse({
              text: "An error occurred while loading this article, should I read you a related article?",
              title: "Error loading article",
              reprompt: "You can also say 'read me the first related article'."
            });
          }
        }
        else {
          sendResponse({
            text: "You made an invalid choice. Which article would you like me to read?",
            title: "Invalid choice",
            reprompt: "You can say 'read me the first article'."
          });
        }
      });
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
