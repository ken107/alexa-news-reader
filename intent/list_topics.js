
handlers.ListTopics = function(intentRequest, session, sendResponse) {
  log.debug("ListTopics");
  sendResponse({
    text: topics.join(", ") + "\n\nWhich topic would you like to read?",
    title: "Topics",
    reprompt: "You can say the name of a topic."
  });
};
