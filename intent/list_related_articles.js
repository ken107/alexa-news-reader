
handlers.ListRelatedArticles = function(intentRequest, session, sendResponse) {
  log.debug("ListRelatedArticles");
  if (state.article) {
    if (state.article.relatedArticles.length) {
      sendResponse({
        text: state.article.relatedArticles.map((article, index) => `${positions[index]} related article.\nFrom ${article.source}.\n${article.title}.`).join("\n\n") + "\n\nWhich related article would you like to read?",
        title: 'Related Articles',
        reprompt: "You can say 'read the first related article'."
      });
    }
    else {
      state.yesIntent = "NextArticle";
      sendResponse({
        text: "No related articles found, should I read the next article?",
        title: "No related articles",
        reprompt: "Should I read the next article?"
      })
    }
  }
  else {
    sendResponse({
      text: "You haven't read anything yet. To read an article about a topic, say 'read the first article about Science'.",
      title: 'No related articles',
      reprompt: "To list articles about a topic, say 'list articles about Science'."
    })
  }
};
