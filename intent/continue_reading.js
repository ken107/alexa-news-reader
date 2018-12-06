var log = require("../util/log.js");
const config = require("../config.json");
const { getSource } = require("../loader/source");
const { getTopicIndex } = require("../util/helper");
const { getTopic } = require("../loader/topic");
const { getArticle } = require("../loader/article");


exports.handle = async function(req, ses) {
  log.debug("ContinueReading");

  if (!ses.topicName) throw new Error("NO_TOPIC");
  if (ses.articleIndex == null) throw new Error("NO_ARTICLE");

  const source = await getSource(config.sourceIndex);
  const topicIndex = getTopicIndex(source, ses.topicName);
  if (topicIndex == -1) throw new Error("BAD_TOPIC");

  const topic = await getTopic(config.sourceIndex, topicIndex);
  if (ses.articleIndex >= topic.articles.length) throw new Error("NO_MORE_ARTICLES");

  const article = await getArticle(config.sourceIndex, topicIndex, ses.articleIndex);
  return readNext(article, article.texts, ses);
};


function readNext(article, texts, ses) {
  var text = ses.toRead == 0 ? `From ${article.source}.\n\n${article.title}.\n\n` : "";
  var i = ses.toRead;
  while (i < texts.length && text.length + texts[i].length + 50 <= 8000) text += texts[i++] + "\n\n";

  if (i < texts.length) {
    ses.toRead = i;
    ses.yesIntent = "ContinueReading";
    return {
      text: `${text}Continue?`,
      title: article.title,
      reprompt: "Should I continue reading?"
    }
  }
  else {
    ses.yesIntent = "NextArticle";
    return {
      text: `${text}Would you like me to read the next article?`,
      title: article.title,
      reprompt: "You can also say 'related articles' to list articles related to the one you just heard."
    }
  }
}
