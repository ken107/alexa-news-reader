const axios = require("axios");

async function getTopic(sourceIndex, topicIndex) {
  const res = await axios({
    method: "POST",
    url: config.serviceUrl,
    data: {
      method: "getTopic",
      sourceIndex,
      topicIndex
    }
  })
  return res.data;
}

exports.getTopic = getTopic;
