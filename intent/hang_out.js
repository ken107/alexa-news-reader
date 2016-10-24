
handlers.HangOut = function(intentRequest, session, sendResponse)  {
  log.debug("HangOut");
  var responses = [
    "Okay, let's hang out together!",
    "Okay, sounds fun!",
    "Okay, have fun, I gotta go.",
    "Okay, fine!"
  ];
  sendResponse({
    text: responses[Math.floor(Math.random()*responses.length)],
    title: "Hang Out",
    shouldEndSession: true
  });
};
