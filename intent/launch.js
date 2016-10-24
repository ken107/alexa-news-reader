
handlers.Launch = function(launchRequest, session, sendResponse) {
  log.debug("Launch");
  sendResponse({
    text: "Which topic would you like to read?",
    title: "Welcome",
    reprompt: "To hear the list of topics, say 'list topics'."
  });
};
