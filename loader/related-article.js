const axios = require("axios");

function getRelatedArticle(sourceIndex, topicIndex, articleIndex, relatedArticleIndex) {
  const res = await axios({
    method: "POST",
    url: config.serviceUrl,
    data: {
      method: "getRelatedArticle",
      sourceIndex,
      topicIndex,
      articleIndex,
      relatedArticleIndex
    }
  })
  return res.data;
}

exports.getRelatedArticle = getRelatedArticle;
