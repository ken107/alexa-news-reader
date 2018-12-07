const axios = require("axios");
const config = require("../util/config");

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
