
handlers.ContinueListing = function(intentRequest, session, sendResponse) {
  var text = "";
  while (state.toList.heads.length) text += state.toList.heads.shift() + "\n\n";
  for (var i=0; i<3 && state.toList.texts.length; i++) text += state.toList.texts.shift() + "\n\n";
  if (state.toList.texts.length) {
    state.yesIntent = "ContinueListing";
    sendResponse({
      text: `${text}Continue?`,
      title: `In ${state.toList.topicName}`,
      reprompt: "Or you can say 'read the first article'."
    });
  }
  else {
    sendResponse({
      text: `${text}Which article would you like to read?`,
      title: `In ${state.topic.name}`,
      reprompt: "You can say 'read the first article'."
    });
  }
}
