const axios = require("axios");

function getArticle(sourceIndex, topicIndex, articleIndex) {
  const res = await axios({
    method: "POST",
    url: config.serviceUrl,
    data: {
      method: "getArticle",
      sourceIndex,
      topicIndex,
      articleIndex
    }
  })
  return res.data;
}

exports.getArticle = getArticle;
