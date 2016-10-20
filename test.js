var handler = require("./index.js").handler;
first();

function first() {
  handler({
    request: {
      type: "IntentRequest",
      intent: {
        name: "ReadArticle",
        slots: {
          topic: {
            value: "Technology"
          },
          position: {
            value: "second"
          }
        }
      }
    }
  },
  null, second);
}

function second() {
  handler({
    request: {
      type: "IntentRequest",
      intent: {
        name: "ListRelatedArticles"
      }
    }
  },
  null, print);
}

function print(a,b) {
  console.log(b);
}
