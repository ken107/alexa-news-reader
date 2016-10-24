
handlers.ReadRelatedArticle = function(intentRequest, session, sendResponse) {
  log.debug("ReadRelatedArticle");
  if (state.article) {
    getArticle(state.article.relatedArticles, intentRequest.intent.slots.position.value, article => {
      if (article) {
        state.relatedArticle = article;
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
            text: "An error occurred while loading this article, should I try the next related article?",
            title: "Error loading article",
            reprompt: "Would you like me to read the next related article?"
          });
        }
      }
      else {
        sendResponse({
          text: "You made an invalid choice. Which article would you like me to read?",
          title: "Invalid choice",
          reprompt: "You can say 'read me the first related article'."
        });
      }
    });
  }
  else {
    sendResponse({
      text: "You haven't read anything yet. To read an article about a topic, say 'read the first article about Science'.",
      title: 'No related articles',
      reprompt: "To list articles about a topic, say 'list articles about Science'."
    })
  }
};
