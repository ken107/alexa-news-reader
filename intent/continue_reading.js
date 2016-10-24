
handlers.ContinueReading = function(intentRequest, session, sendResponse) {
  log.debug("ContinueReading");
  var text = "";
  while (state.toRead.texts.length && (text.length + state.toRead.texts[0].length + 50) <= 8000) text += state.toRead.texts.shift() + "\n\n";
  if (state.toRead.texts.length) {
    state.yesIntent = "ContinueReading";
    sendResponse({
      text: `${text}Continue?`,
      title: state.toRead.title,
      reprompt: "Should I continue reading?"
    });
  }
  else {
    state.yesIntent = "NextArticle";
    sendResponse({
      text: `${text}Would you like me to read the next article?`,
      title: state.toRead.title,
      reprompt: "You can also say 'related articles' to list articles related to the one you just heard."
    });
  }
};
